// ✅ EssayContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const EssayQuestionsContext = createContext();

export const EssayQuestionsProvider = ({ children }) => {
  const [essayQuestions, setEssayQuestions] = useState([]);
  const [studentEssayAnswers, setStudentEssayAnswers] = useState({});
  const [message, setMessage] = useState("");

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

  const handleEssayAnswerChange = (questionId, answerText) => {
    setStudentEssayAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

  const submitEssayAnswers = async ({ studentId, examId, answers }) => {
    try {
      const createSubmissionRes = await axios.post(
        "http://localhost:3000/api/student-essay-questions/create-submission",
        { student_id: studentId, exam_id: examId }
      );
      const submissionId = createSubmissionRes.data.submission_id;

      const payload = {
        student_id: studentId,
        exam_id: examId,
        submission_id: submissionId,
        answers: Object.entries(answers).map(([questionId, answerText]) => ({
          question_id: questionId,
          student_answer: { text: answerText },
        })),
      };

      await axios.post("http://localhost:3000/api/student-essay-questions/submit", payload);

      setMessage("Essay answers submitted successfully.");
      return submissionId; // ✅ Return submissionId
    } catch (error) {
      console.error("Error submitting essay answers:", error);
      setMessage("Failed to submit essay answers.");
      return null;
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

export const useEssayQuestions = () => useContext(EssayQuestionsContext);
