import { createContext, useContext, useState } from "react";
import axios from "axios";

//create context for code questions
const CodeQuestionsContext = createContext();

export const CodeQuestionsProvider = ({ children }) => {
    //to store message for user feedback
    const [message, setMessage] = useState("");
    //to store list of code questions
    const [questions, setQuestions] = useState([]);
  
    //function to fetch all code questions
    const fetchCodeQuestions = async () => {
        try {
          const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
          console.log("API_BASE_URL:", API_BASE_URL);
          const response = await axios.get(`${API_BASE_URL}/api/createCodeQuestion`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log(response.data);
          setQuestions(response.data.questions || []);
        } catch (error) {
          console.error("Error fetching code questions:", error);
          if (error.response) {
            setMessage(error.response.data.message || "Failed to fetch questions");
          } else {
            setMessage("An error occurred while fetching the questions");
          }
        }
    };
    
  
    return (
      <CodeQuestionsContext.Provider value={{ fetchCodeQuestions, questions, message }}>
        {children}
      </CodeQuestionsContext.Provider>
    );
  };
  
  //custom hook to use code questions context
  export const useCodeQuestions = () => useContext(CodeQuestionsContext);