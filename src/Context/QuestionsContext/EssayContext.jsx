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
