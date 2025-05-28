import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

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
        .select("question_id, question_text, options")
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
        course_id: examData.course_id, // ensure this is set for navigation
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

  // Submit exam answers
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

      // Prepare response payload
      const responses = task.questions
        .map((question, index) => {
          const selected = answers[index];
          if (!selected) return null;

          return {
            user_id: userId,
            exam_id: task.exam_id,
            question_id: question.id,
            selected_option: selected,
          };
        })
        .filter(Boolean); // remove unanswered/null

      if (responses.length === 0) {
        alert("You must answer at least one question.");
        return;
      }

      console.log("🛠 Submitting responses:", responses);

      const { data,error } = await supabase
        .from("exam_submission")
        .insert(responses)
        .select();

        console.log(" Inserted exam_submission rows:", data);

      if (error) {
        console.error("Error saving responses:", error);
        alert("Failed to submit answers. Please try again.");
      } else {
        alert("Answers submitted!");
        console.log(" Responses saved. Redirecting...");

        // Redirect to correct exam list page
        navigate(`/student/courses/${task.userId}/${task.course_id}/exams`);
      }
    },
    [task, answers]
  );

   // Combine context values
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
