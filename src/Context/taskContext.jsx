import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";
import { TimerContext } from "./TimerContext.jsx";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [userScore, setUserScore] = useState(null); // NEW

  const { timeLeft } = useContext(TimerContext);

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

    if (existingSubmissions?.length > 0) {
      setAlreadySubmitted(true);
    } else {
      setAlreadySubmitted(false);
    }

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
        .select("question_id, question_text, options, answers") // UPDATED
        .eq("exam_id", id);

      if (questionsError || !questionsData || questionsData.length === 0) {
        console.error("Questions not found", questionsError);
        return;
      }

      const formattedQuestions = questionsData.map((q) => ({
        id: q.question_id,
        question: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswers: q.answers, // NEW
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
    setQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, task.questions.length - 1)
    );
  }, [task]);

  const handleBack = useCallback(() => {
    setQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
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
      const timeTaken = totalDurationInSeconds - timeLeft;

      const submissionPayload = {
        submitted_at: new Date().toISOString(),
        student_id: userId,
        exam_id: task.exam_id,
        total_score: 0, // initially 0, updated later
        time_taken: timeTaken,
        focus_loss_count: null,
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
      const answersPayload = task.questions
        .map((question, index) => {
          const selectedAnswer = answers[index];
          if (!selectedAnswer) return null;

          const isCorrect = question.correctAnswers?.includes(selectedAnswer);

          if (isCorrect) totalScore += 1;

          return {
            score: isCorrect ? 1 : 0,
            ai_feedback: null,
            question_id: question.id,
            submission_id: submissionId,
          };
        })
        .filter(Boolean);

      if (answersPayload.length === 0) {
        alert("You must answer at least one question.");
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("exam_submissions_answers")
        .insert(answersPayload)
        .select();

      if (answersError) {
        console.error("Error saving responses:", answersError);
        alert("Failed to save answers. Please try again.");
        return;
      }

      // Update total_score in exam_submissions
      await supabase
        .from("exam_submissions")
        .update({ total_score: totalScore })
        .eq("id", submissionId);

      setUserScore(totalScore);
      alert(`Exam submitted! Your score is ${totalScore}.`);
      navigate(`/student/courses/${userId}/${task.course_id}/exams`);
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
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
