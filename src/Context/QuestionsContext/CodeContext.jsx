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
          const response = await axios.get("http://localhost:3000/api/codequestions", {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log(response.data);
          setQuestions(response.data.questions || []);
        } catch (error) {
          console.error("Error fetching code questions:", error);
          setMessage("Failed to fetch questions");
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