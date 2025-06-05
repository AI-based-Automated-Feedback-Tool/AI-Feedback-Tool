import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";
import { TimerContext } from "./TimerContext.jsx";

// Create a context to share task-related state and methods
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // State variables
  const [task, setTask] = useState(null); // Holds the current exam data
  const [loading, setLoading] = useState(true); // Tracks if the exam is being fetched
  const [questionIndex, setQuestionIndex] = useState(0); // Index of the currently displayed question
  const [answers, setAnswers] = useState([]); // Array holding selected answers
  const [reviewMode, setReviewMode] = useState(false); // Indicates if in "review your answers" state
  const [alreadySubmitted, setAlreadySubmitted] = useState(false); // Tracks if the student already submitted this exam
  const [userScore, setUserScore] = useState(null); // Score after submitting the exam
  const [focusLossCount, setFocusLossCount] = useState(0); // Count of focus losses during the exam

  const { timeLeft } = useContext(TimerContext); // Remaining time from timer context
  //state for pop up after submit
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  //  FOCUS TRACKING EFFECT
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


  // Fetch the exam details and its related questions
  const fetchExamWithQuestions = useCallback(async (id) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // Check if the user already submitted this exam
    const { data: existingSubmissions } = await supabase
      .from("exam_submissions")
      .select("id")
      .eq("exam_id", id)
      .eq("student_id", userId)
      .limit(1);

    setAlreadySubmitted(existingSubmissions?.length > 0);

    try {
      // Fetch exam metadata (title, duration, course ID, etc.)
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("exam_id", id)
        .single();

      if (examError || !examData) {
        console.error("Exam not found", examError);
        return;
      }

      // Fetch multiple choice questions for this exam
      const { data: questionsData, error: questionsError } = await supabase
        .from("mcq_questions")
        .select("question_id, question_text, options, answers") // answers = correct answer(s)
        .eq("exam_id", id);

      if (questionsError || !questionsData || questionsData.length === 0) {
        console.error("Questions not found", questionsError);
        return;
      }

      // Format questions with readable structure and correct answers
      const formattedQuestions = questionsData.map((q) => ({
        id: q.question_id,
        question: q.question_text,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswers: q.answers,
      }));

      // Set state for task and initialize answers as null
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

  // Save selected answer for a given question
  const handleAnswerSelect = useCallback((index, answer) => {
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[index] = answer;
      return updated;
    });
  }, []);

  // Navigate to the next question
  const handleNext = useCallback(() => {
    setQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, task.questions.length - 1)
    );
  }, [task]);

  // Navigate to the previous question
  const handleBack = useCallback(() => {
    setQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  // Submit all answers to the backend
 const handleSubmit = useCallback(
  async (navigate) => {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      alert("User not authenticated");
      return;
    }

    // Calculate time taken
    const totalDurationInSeconds = task.duration * 60;
    const timeTaken = totalDurationInSeconds - timeLeft;

    // Step 1: Insert into exam_submissions table
    const submissionPayload = {
      submitted_at: new Date().toISOString(),
      student_id: userId,
      exam_id: task.exam_id,
      total_score: 0, // Placeholder — will be updated after scoring
      time_taken: timeTaken,
      focus_loss_count: focusLossCount,
      feedback_summery: null,
    };

    const { data: submissionData, error: submissionError } = await supabase
      .from("exam_submissions")
      .insert([submissionPayload])
      .select();

    if (submissionError) {
      console.error("❌ Error saving exam submission:", submissionError);
      alert("Failed to submit exam. Please try again.");
      return;
    }

    const submissionId = submissionData[0].id;

    // Step 2: Score answers and prepare payload for exam_submissions_answers table
let totalScore = 0;

const answersPayload = task.questions
  .map((question, index) => {
    const selectedAnswer = answers[index];

    // Only skip if truly unanswered (null or undefined)
    if (selectedAnswer === null || selectedAnswer === undefined) {
      console.warn(`⛔ Question ${index + 1} unanswered`);
      return null;
    }

    const correctAnswers = question.correctAnswers || [];

    // Check if selected answer is correct
    const isCorrect = correctAnswers.includes(selectedAnswer);
    if (isCorrect) totalScore += 1;

    const payload = {
      question_id: question.id,             // FK to mcq_questions
      submission_id: submissionId,          // FK to exam_submissions
      student_answer: selectedAnswer,       // Student's selected answer
      is_correct: isCorrect,                // Boolean true/false
      score: isCorrect ? 1 : 0,             // 1 for correct, 0 for wrong
      ai_feedback: null                     // Placeholder
    };

    console.log(`✅ Prepared answer for Q${index + 1}:`, payload);
    return payload;
  })
  .filter((entry) => entry !== null); // Remove skipped entries

console.log("📦 Final answersPayload:", answersPayload);
console.log("🏁 Total score to update:", totalScore);

if (answersPayload.length === 0) {
  alert("You must answer at least one question.");
  return;
}

   // Step 3: Insert answers into exam_submissions_answers table
const { data: answersData, error: answersError } = await supabase
  .from("exam_submissions_answers")
  .insert(answersPayload)
  .select();

if (answersError) {
  console.error("❌ Error saving answers:", answersError);
  alert("Failed to save answers: " + answersError.message);
  return;
}

console.log("✅ Saved answers to DB:", answersData);

    // Step 4: Update total_score in exam_submissions table
    await supabase
      .from("exam_submissions")
      .update({ total_score: totalScore })
      .eq("id", submissionId);

    // Step 5: Show score popup and navigate back to dashboard
    setUserScore(totalScore);
    setPopupMessage(`✅ Exam submitted! Your score is ${totalScore}.`);
    setShowPopup(true); 

    // Wait 3 seconds, then navigate back
    setTimeout(() => {
      navigate(`/student/courses/${userId}/${task.course_id}/exams`);
    }, 3000);
  },
  [task, answers, timeLeft]
);

  // Memoize and provide all values to child components
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
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

// Hook to access TaskContext easily in child components
export const useTask = () => useContext(TaskContext);
