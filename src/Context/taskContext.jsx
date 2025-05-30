import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";
import { TimerContext } from "./TimerContext.jsx";

// Create the context for exam tasks
const TaskContext = createContext();

// Provider to wrap around components that need access to exam/task state
export const TaskProvider = ({ children }) => {
  // Store the full exam/task data
  const [task, setTask] = useState(null);

  // Track whether data is being loaded
  const [loading, setLoading] = useState(true);

  // Current question index (for navigation)
  const [questionIndex, setQuestionIndex] = useState(0);

  // User's selected answers
  const [answers, setAnswers] = useState([]);

  // Whether user is reviewing their answers
  const [reviewMode, setReviewMode] = useState(false);

  // Whether user has already submitted this exam
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  //access timeLeft from TimerContext
  const { timeLeft } = useContext(TimerContext);

  // Fetch exam data and questions
  const fetchExamWithQuestions = useCallback(async (id) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;

    // Check if this user has already submitted this exam
    const { data: existingSubmissions } = await supabase
      .from("exam_submission")
      .select("id")
      .eq("exam_id", id)
      .eq("user_id", userId)
      .limit(1);

    if (existingSubmissions?.length > 0) {
      setAlreadySubmitted(true);
      setLoading(false);
      return;
    }

    try {
      // Get exam details
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("exam_id", id)
        .single();

      if (examError || !examData) {
        console.error("Exam not found", examError);
        return;
      }

      // Get associated multiple choice questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("mcq_questions")
        .select("question_id, question_text, options, correct_answer")
        .eq("exam_id", id);

      if (questionsError || !questionsData || questionsData.length === 0) {
        console.error("Questions not found", questionsError);
        return;
      }

      // Format the questions
      const formattedQuestions = questionsData.map((q) => ({
        id: q.question_id,
        question: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
      }));

      // Set task and initialize answers with nulls
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

  // Save selected answer for a specific question
  const handleAnswerSelect = useCallback((index, answer) => {
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[index] = answer;
      return updated;
    });
  }, []);

  // Go to next question
  const handleNext = useCallback(() => {
    setQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, task.questions.length - 1)
    );
  }, [task]);

  // Go back to previous question
  const handleBack = useCallback(() => {
    setQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  //submit exam answers
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

      //calculate time taken for the exam
      const totalDurationInSeconds = task.duration * 60; //duration to seconds
      const timeTaken = totalDurationInSeconds - timeLeft; //subtract remaining time from total duration

      //payload for exam_submissions
      const submissionPayload = {
        submitted_at: new Date().toISOString(),
        student_id: userId,
        exam_id: task.exam_id,
        total_score: 0,
        time_taken: timeTaken,
        focus_loss_count: null,
        feedback_summery: null,
      };

      console.log("Submitting exam payload:", submissionPayload);

      //insert into exam_submissions
      const { data: submissionData, error: submissionError } = await supabase
        .from("exam_submissions")
        .insert([submissionPayload])
        .select();

      if (submissionError) {
        console.error("Error saving exam submission:", submissionError);
        alert("Failed to submit exam. Please try again.");
        return;
      }

      console.log("Inserted exam_submission rows:", submissionData);

      //payload for exam_submissions_answers
      const answersPayload = task.questions
        .map((question, index) => {
          const selectedAnswer = answers[index];
          if (!selectedAnswer) return null;

          //if the selected answer is correct
          const isCorrect = question.correct_answer === selectedAnswer;

          return {
            score: isCorrect ? 1 : 0,
            ai_feedback: null,
            question_id: question.id,
            submission_id: submissionData[0].id,
          };
        })
        .filter(Boolean); //remove unanswered/null answers

      if (answersPayload.length === 0) {
        alert("You must answer at least one question.");
        return;
      }

      console.log("Submitting answers payload:", answersPayload);

      //insert into exam_submissions_answers
      const { data: answersData, error: answersError } = await supabase
        .from("exam_submissions_answers")
        .insert(answersPayload)
        .select();

      if (answersError) {
        console.error(
          "Error saving responses to exam_submissions_answers:",
          answersError
        );
        alert("Failed to save answers. Please try again.");
        return;
      }

      console.log("Inserted exam_submissions_answers rows:", answersData);

      alert("Answers submitted successfully!");
      console.log("Responses saved. Redirecting...");

      //redirect to correct exam list page
      navigate(`/student/courses/${task.userId}/${task.course_id}/exams`);
    },
    [task, answers, timeLeft]
  );

  //combine context values
  const contextValue = useMemo(
    () => ({
      task,
      loading,
      questionIndex,
      answers,
      reviewMode,
      alreadySubmitted,
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
