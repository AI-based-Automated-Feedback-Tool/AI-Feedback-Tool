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

  // initialize timer when task duration is available
  useEffect(() => {
    if (task?.duration) {
      setTimeLeft(task.duration * 60);
    }
  }, [task]);

  // countdown timer
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

  // format timer into MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // track tab focus loss
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

  // fetch exam and its questions (supports both MCQ & Code)
  const fetchExamWithQuestions = useCallback(async (id) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // check if already submitted
    const { data: existingSubmissions } = await supabase
      .from("exam_submissions")
      .select("id")
      .eq("exam_id", id)
      .eq("student_id", userId)
      .limit(1);

    setAlreadySubmitted(existingSubmissions?.length > 0);

    try {
      // fetch exam meta data
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("exam_id", id)
        .single();

      if (examError || !examData) {
        console.error("Exam not found", examError);
        return;
      }

      // fetch both mcq and code questions
      const { data: mcqData } = await supabase
        .from("mcq_questions")
        .select("question_id, question_text, options, answers")
        .eq("exam_id", id);

      const { data: codeData } = await supabase
        .from("code_questions")
        .select("question_id, question_description, function_signature, test_cases")
        .eq("exam_id", id);

      // format mcq questions
      const formattedMcqs = (mcqData || []).map((q) => ({
        id: q.question_id,
        type: "mcq",
        question: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswers: q.answers,
      }));

      // format code questions
      const formattedCodes = (codeData || []).map((q) => ({
        id: q.question_id,
        type: "code",
        question_description: q.question_description,
        function_signature: q.function_signature,
        test_cases: q.test_cases,
      }));

      // merge both types
      const allQuestions = [...formattedMcqs, ...formattedCodes];

      if (allQuestions.length === 0) {
        console.error("No questions found for exam");
        return;
      }

      // set task data
      setTask({
        exam_id: examData.exam_id,
        course_id: examData.course_id,
        ...examData,
        questions: allQuestions,
      });

      // init answers array
      setAnswers(new Array(allQuestions.length).fill(null));
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // handle mcq answer selection
  const handleAnswerSelect = useCallback((index, answer) => {
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[index] = answer;
      return updated;
    });
  }, []);

  // handle navigation next/back
  const handleNext = useCallback(() => {
    setQuestionIndex((prev) =>
      Math.min(prev + 1, task.questions.length - 1)
    );
  }, [task]);

  const handleBack = useCallback(() => {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // submit exam (works for MCQ, Code handled separately in CodeQuestionsList)
  const handleSubmit = useCallback(
    async (navigate) => {
      if (!task || !timeLeft) {
        alert("Task data is not available. Please try again later.");
        return;
      }
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
        feedback_summery: null,
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

      // only evaluate mcqs here
      const answersPayload = task.questions
        .filter((q) => q.type === "mcq")
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
            model_answer_advanced: "To be added later",
          };
        })
        .filter(Boolean);

      if (answersPayload.length > 0) {
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
      }

      // trigger AI feedback for mcq
      try {
        await fetch("http://localhost:3000/api/mcq-feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ submissionId }),
        });
        console.log(" AI MCQ feedback triggered.");
      } catch (err) {
        console.error("Error triggering AI MCQ feedback:", err);
      }

      setUserScore(totalScore);
      setPopupMessage(`Exam submitted! Your score is ${totalScore}.`);
      setShowPopup(true);

      if (navigate) {
        setTimeout(() => {
          navigate(`/student/courses/${userId}/${task.course_id}/exams`);
        }, 3000);
      }
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
      timeLeft,
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
