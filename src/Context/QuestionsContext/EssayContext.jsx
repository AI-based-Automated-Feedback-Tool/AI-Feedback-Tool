import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const EssayQuestionsContext = createContext();

export const EssayQuestionsProvider = ({ children }) => {
  const [essayQuestions, setEssayQuestions] = useState([]);
  const [studentEssayAnswers, setStudentEssayAnswers] = useState({});
  const [message, setMessage] = useState("");

  /**
   * Fetch essay questions by examId
   */
  const fetchEssayQuestions = useCallback(async (examId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/student-essay-questions/${examId}`);
      console.log("Fetched essay questions:", res.data);
      setEssayQuestions(res.data);
    } catch (error) {
      console.error("Error fetching essay questions:", error);
      setEssayQuestions([]);
      setMessage("Failed to fetch essay questions.");
    }
  }, []);

  /**
   * Update student's essay answer for a question
   */
  const handleEssayAnswerChange = (questionId, answerText) => {
    setStudentEssayAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

  /**
   * Submit all essay answers to backend
   */
  const submitEssayAnswers = async ({ studentId, examId, answers }) => {
    try {
      // Step 1: Create a new submission and get submission_id
      const createSubmissionRes = await axios.post(
        "http://localhost:3000/api/student-essay-questions/create-submission",
        {
          student_id: studentId,
          exam_id: examId,
        }
      );

      const submissionId = createSubmissionRes.data.submission_id;

      // Step 2: Submit answers using the new submission_id
      const payload = {
        student_id: studentId,
        exam_id: examId,
        submission_id: submissionId,
        answers: Object.entries(answers).map(([questionId, answerText]) => ({
          question_id: questionId,
          student_answer: { text: answerText },
        })),
      };

      console.log("Submitting essay answers:", payload);

      const res = await axios.post(
        "http://localhost:3000/api/student-essay-questions/submit",
        payload
      );

      console.log("Essay submission response:", res.data);
      setMessage("Essay answers submitted successfully.");
    } catch (error) {
      console.error("Error submitting essay answers:", error);
      setMessage("Failed to submit essay answers.");
    }
  };

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

// Custom hook
export const useEssayQuestions = () => useContext(EssayQuestionsContext);
