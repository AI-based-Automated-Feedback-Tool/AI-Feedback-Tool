import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

//create context for code questions
const CodeQuestionsContext = createContext();

export const CodeQuestionsProvider = ({ children }) => {
  //to store message for user feedback
  const [message, setMessage] = useState("");
  //to store list of code questions
  const [questions, setQuestions] = useState([]);

  /**
   * Fetch code questions for a specific exam or course.
   * Accepts either examId or courseId to filter questions.
   */
  const fetchCodeQuestions = useCallback(async ({ examId, courseId }) => {
    try {
      let url = "http://localhost:3000/api/codequestions";

      // Add query params if examId or courseId provided
      const params = new URLSearchParams();
      if (examId) params.append("exam_id", examId);
      if (courseId) params.append("course_id", courseId);

      if ([...params].length > 0) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Fetched code questions:", response.data);
      setQuestions(response.data.questions || []);
      setMessage("");
    } catch (error) {
      console.error("Error fetching code questions:", error);
      setMessage("Failed to fetch questions");
      setQuestions([]);
    }
  }, []);

  return (
    <CodeQuestionsContext.Provider value={{ fetchCodeQuestions, questions, message }}>
      {children}
    </CodeQuestionsContext.Provider>
  );
};

//custom hook to use code questions context
export const useCodeQuestions = () => useContext(CodeQuestionsContext);
