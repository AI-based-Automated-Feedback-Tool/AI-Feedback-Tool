// EssayContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

// Create a new Context for essay-related questions and answers
const EssayQuestionsContext = createContext();

// Provider component to wrap parts of the app that need essay-related state
export const EssayQuestionsProvider = ({ children }) => {
  // State to hold fetched essay questions
  const [essayQuestions, setEssayQuestions] = useState([]);
  // Object to store student's answers: { questionId: "answer text" }
  const [studentEssayAnswers, setStudentEssayAnswers] = useState({});
  //Optional message state for feedback or errors
  const [message, setMessage] = useState("");

  /**
   * - Fetch essay questions for a given exam ID
   * - Clears previous answers
   * - Handles error gracefully
   */

  const fetchEssayQuestions = useCallback(async (examId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/student-essay-questions/${examId}`);
      setEssayQuestions(res.data);
      setStudentEssayAnswers({});
      
    } catch (error) {
      console.error("Error fetching essay questions:", error);
      setEssayQuestions([]);
      setMessage("Failed to fetch essay questions.");
    }
  }, []);

   /**
   * - Called when student types an answer
   * - Updates the answer for the specific question
   */

  const handleEssayAnswerChange = (questionId, answerText) => {
    setStudentEssayAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

   /**
   * - Submits student's essay answers
   * - Creates a submission in the backend
   * - Sends the answer payload for storage
   * - Returns the generated submission ID (used for AI feedback)
   */

  const submitEssayAnswers = async ({ studentId, examId, answers }) => {
    try {
       // Step 1: Create a new submission and get submissionId
      const createSubmissionRes = await axios.post(
        "http://localhost:3000/api/student-essay-questions/create-submission",
        { student_id: studentId, exam_id: examId }
      );
      const submissionId = createSubmissionRes.data.submission_id;
      
       // Step 2: Construct payload with all answers
      const payload = {
        student_id: studentId,
        exam_id: examId,
        submission_id: submissionId,
        answers: Object.entries(answers).map(([questionId, answerText]) => ({
          question_id: questionId,
          student_answer: { text: answerText },
        })),
      };
      
      // Step 3: Submit the answers
      await axios.post("http://localhost:3000/api/student-essay-questions/submit", payload);
      
      // Step 4: Return submissionId for later use (e.g. to fetch feedback)
      setMessage("Essay answers submitted successfully.");
      return submissionId; // ✅ Return submissionId
    } catch (error) {
      console.error("Error submitting essay answers:", error);
      setMessage("Failed to submit essay answers.");
      return null;
    }
  };
  
   // Provide all values/functions to components via context
  return (
    <EssayQuestionsContext.Provider
      value={{
        fetchEssayQuestions,
        essayQuestions,
        studentEssayAnswers,
        handleEssayAnswerChange,
        submitEssayAnswers,
        message,
      }}
    >
      {children}
    </EssayQuestionsContext.Provider>
  );
};

// Custom hook for accessing essay context more easily in components
export const useEssayQuestions = () => useContext(EssayQuestionsContext);
