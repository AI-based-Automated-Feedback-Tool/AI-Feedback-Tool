import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [userScore, setUserScore] = useState(null);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (task?.duration) {
      setTimeLeft(task.duration * 60);
    }
  }, [task]);

  useEffect(() => {
    if (timeLeft === null || alreadySubmitted || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, alreadySubmitted, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleFocus = () => console.log("Tab focused");
    const handleBlur = () => {
      console.log("Tab lost focus");
      setFocusLossCount((prev) => prev + 1);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const fetchExamWithQuestions = useCallback(async (id) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data: existingSubmissions } = await supabase
      .from("exam_submissions")
      .select("id")
      .eq("exam_id", id)
      .eq("student_id", userId)
      .limit(1);

    setAlreadySubmitted(existingSubmissions?.length > 0);

    try {
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("exam_id", id)
        .single();

      if (examError || !examData) {
        console.error("Exam not found", examError);
        return;
      }

      const { data: questionsData, error: questionsError } = await supabase
        .from("mcq_questions")
        .select("question_id, question_text, options, answers")
        .eq("exam_id", id);

      if (questionsError) {
      console.error("❌ Error fetching MCQ questions:", questionsError);
      return;
   }

      if (questionsError || !questionsData || questionsData.length === 0) {
        console.warn("⚠️ No MCQ questions found. Possibly a code or essay exam.");
        return;
      }

      const formattedQuestions = questionsData.map((q) => ({
        id: q.question_id,
        question: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswers: q.answers,
      }));

      setTask({
        exam_id: examData.exam_id,
        course_id: examData.course_id,
        ...examData,
        questions: formattedQuestions,
      });

      setAnswers(new Array(formattedQuestions.length).fill(null));
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswerSelect = useCallback((index, answer) => {
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[index] = answer;
      return updated;
    });
  }, []);

  const handleNext = useCallback(() => {
    setQuestionIndex((prev) =>
      Math.min(prev + 1, task.questions.length - 1)
    );
  }, [task]);

  const handleBack = useCallback(() => {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(
    async (navigate) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      if (!userId) {
        alert("User not authenticated");
        return;
      }

      const totalDurationInSeconds = task.duration * 60;
      const timeTaken = totalDurationInSeconds - (timeLeft ?? 0);

      const submissionPayload = {
        submitted_at: new Date().toISOString(),
        student_id: userId,
        exam_id: task.exam_id,
        total_score: 0,
        time_taken: timeTaken,
        focus_loss_count: focusLossCount,
        
      };

      const { data: submissionData, error: submissionError } = await supabase
        .from("exam_submissions")
        .insert([submissionPayload])
        .select();

      if (submissionError) {
        console.error("Error saving exam submission:", submissionError);
        alert("Failed to submit exam. Please try again.");
        return;
      }

      const submissionId = submissionData[0].id;
      let totalScore = 0;

      const answersPayload = task.questions
        .map((question, index) => {
          const selectedAnswer = answers[index];
          if (!selectedAnswer) return null;
          const isCorrect = question.correctAnswers?.includes(selectedAnswer);
          if (isCorrect) totalScore += 1;

          return {
            student_answer: [selectedAnswer],
            is_correct: isCorrect,
            score: isCorrect ? 1 : 0,
            ai_feedback: "Pending AI feedback generation",
            question_id: question.id,
            submission_id: submissionId,
            model_answer_basic: question.correctAnswers?.[0] ?? "N/A",
            model_answer_advanced: "To be added later"
          };
        })
        .filter(Boolean);

      if (answersPayload.length === 0) {
        alert("You must answer at least one question.");
        return;
      }

      const { error: answersError } = await supabase
        .from("exam_submissions_answers")
        .insert(answersPayload);

      if (answersError) {
        console.error("Error saving responses:", answersError);
        alert("Failed to save answers. Please try again.");
        return;
      }

      await supabase
        .from("exam_submissions")
        .update({ total_score: totalScore })
        .eq("id", submissionId);

        // Trigger AI MCQ feedback generation
       fetch("http://localhost:3000/api/mcq-feedback", {
       method: "POST",
       headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify({ submissionId }),
   })
      .then(() => console.log("AI MCQ feedback triggered."))
      .catch((err) => console.error("Error triggering AI MCQ feedback:", err));
      setUserScore(totalScore);
      setPopupMessage(`Exam submitted! Your score is ${totalScore}.`);
      setShowPopup(true);

      setTimeout(() => {
        navigate(`/student/courses/${userId}/${task.course_id}/exams`);
      }, 3000);
    },
    [task, answers, timeLeft]
  );

  const contextValue = useMemo(
    () => ({
      task,
      loading,
      questionIndex,
      answers,
      reviewMode,
      alreadySubmitted,
      userScore,
      setReviewMode,
      fetchExamWithQuestions,
      handleAnswerSelect,
      handleNext,
      handleBack,
      handleSubmit,
      setQuestionIndex,
      showPopup,
      setShowPopup,
      popupMessage,
      focusLossCount,
      timeLeft,
      formatTime,
    }),
    [
      task,
      loading,
      questionIndex,
      answers,
      reviewMode,
      alreadySubmitted,
      userScore,
      fetchExamWithQuestions,
      handleAnswerSelect,
      handleNext,
      handleBack,
      handleSubmit,
      showPopup,
      popupMessage,
      setShowPopup,
      timeLeft
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
