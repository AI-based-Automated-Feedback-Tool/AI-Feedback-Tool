import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

//create context for code questions
const CodeQuestionsContext = createContext();

export const CodeQuestionsProvider = ({ children }) => {
  //to store message for user feedback
  const [message, setMessage] = useState("");
  //to store list of code questions
  const [questions, setQuestions] = useState([]);
  //to store answer
  const [studentAnswers, setStudentAnswers] = useState({});

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
      console.error("Error fetching code questions:", error.response?.data || error.message);
      setMessage("Failed to fetch questions");
      setQuestions([]);
    }
  }, []);

  const handleCodeChange = (questionId, code) => {
    setStudentAnswers((prev) => ({ ...prev, [questionId]: code }));
  };

  const submitAllAnswers = async ({ userId, timeTaken, focusLossCount = 0 }) => {
    try {
      // Prepare the answers array with questionId and corresponding code
      const answers = questions.map((q) => ({
        questionId: q.question_id,
        code: studentAnswers[q.id] || "",
      }));
  
      // Extract exam_id from the first question (assuming all belong to the same exam)
      const exam_id = questions[0]?.exam_id;
      console.log("Submitting answers:", { userId, exam_id, answers, timeTaken, focusLossCount });
  
      // Validate payload before submission
      if (!userId || !exam_id || answers.length === 0) {
        console.error("Invalid submission payload:", { userId, exam_id, answers });
        setMessage("Submission failed due to invalid data.");
        return;
      }
  
      // Log the payload for debugging
      const payload = {
        userId,
        exam_id,
        answers,
        timeTaken,
        focusLossCount,
      };
      console.log("Submitting payload:", payload);
  
      // Submit the answers to the backend
      const res = await axios.post("http://localhost:3000/api/code-submission", payload);
  
      // Handle backend response
      if (res.data.success) {
        setMessage(`Submission successful! Score: ${res.data.totalScore}`);
      } else {
        console.error("Submission failed response:", res.data);
        setMessage("Submission failed.");
      }
    } catch (err) {
      // Handle request errors
      console.error("Error submitting answers:", err.response?.data || err.message);
      setMessage("An error occurred while submitting.");
    }
  };
  

  return (
    <CodeQuestionsContext.Provider value={{ fetchCodeQuestions, questions, message, handleCodeChange, submitAllAnswers, studentAnswers }}>
      {children}
    </CodeQuestionsContext.Provider>
  );
};

//custom hook to use code questions context
export const useCodeQuestions = () => useContext(CodeQuestionsContext);