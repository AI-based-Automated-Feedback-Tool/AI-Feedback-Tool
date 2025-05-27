import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  //to store current task or exam
  const [task, setTask] = useState(null);
  //to track loading status
  const [loading, setLoading] = useState(true);
  //to track the current question index
  const [questionIndex, setQuestionIndex] = useState(0);
  //to store the user's answers for the questions
  const [answers, setAnswers] = useState([]);
  //to determine if the user is in review mode
  const [reviewMode, setReviewMode] = useState(false);
  //to check if the exam has already been submitted
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  //to fetch exam details and questions from the database
  const fetchExamWithQuestions = useCallback(async (id) => {
    setLoading(true);
    //get current authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;
    //check if the user has already submitted the exam
    const { data: existingSubmissions } = await supabase
      .from("exam_submission")
      .select("id")
      .eq("exam_id", id)
      .eq("user_id", userId)
      .limit(1);

    if (existingSubmissions?.length > 0) {
      // if the exam is already submitted, update the state and stop further processing
      setAlreadySubmitted(true);
      setLoading(false);
      return;
    }

    try {
      //fetch exam details from exam table
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("exam_id", id)
        .single();

      if (examError || !examData) {
        console.error("Exam not found");
        return;
      }

      const { data: questionsData, error: questionsError } = await supabase
        .from("mcq_questions")
        .select("question_id, question_text, options")
        .filter("exam_id", "eq", id);

      if (questionsError || !questionsData || questionsData.length === 0) {
        console.error("Questions not found");
        return;
      }

      const formattedQuestions = questionsData.map((q) => ({
        id: q.question_id,
        question: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
      }));

      setTask({
        exam_id: examData.exam_id,
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
    //update the user's selected answer for a specific question
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[index] = answer;
      return updated;
    });
  }, []);

  const handleNext = useCallback(() => {
    //move to the next question, ensuring it doesn't exceed the total number of questions
    setQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, task.questions.length - 1)
    );
  }, [task]);

  const handleBack = useCallback(() => {
    //move to the previous question, ensuring it doesn't go below the first question
    setQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  const handleSubmit = useCallback(
    async (navigate) => {
      //submit the user's answers to the database
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;
      if (!userId) {
        alert("User not authenticated");
        return;
      }
      //the responses for submission
      const responses = task.questions.map((question, index) => ({
        user_id: userId,
        exam_id: task.exam_id,
        question_id: question.id,
        selected_option: answers[index],
      }));
      //insert the res into the "exam_submission" table

      const { error } = await supabase
        .from("exam_submission")
        .insert(responses);

      if (error) {
        console.error("Error saving responses:", error);
        alert("Failed to submit answers. Please try again.");
      } else {

        

      // Redirect user to course page or exam list
      navigate(`/dashboard/courses/${task.course_id}/exams`);

      }
    },
    [task, answers]
  );

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
