import { useState, useEffect } from "react";
import { createCodeQuestion } from "../service/createCodeQuestionService";

export default function useCodeQuestionForm( examId, initialQuestion = null  ) {
    const [questionDescription, setQuestionDescription] = useState("");
    const [functionSignature, setFunctionSignature] = useState("");
    const [wrapperCode, setWrapperCode] = useState("");
    const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);   
    const [points, setPoints] = useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [editQuestionIndex, setEditQuestionIndex] = useState(null);
    
    console.log("Attempting to save questions for exam:", examId);
    useEffect(() => {
        if (initialQuestion) {
            setQuestionDescription(initialQuestion.question);
            setFunctionSignature(initialQuestion.functionSignature);
            setWrapperCode(initialQuestion.wrapperCode);
            setTestCases(initialQuestion.testCases);
            setSelectedLanguage(initialQuestion.language);
            setPoints(initialQuestion.points);
        }
    }, [initialQuestion]);
    
    const addTestCase = () => {
        setTestCases([...testCases, { input: "", output: "" }]);
    };

    const validate = () => {
        const newErrors = {};
        if (!questionDescription.trim()) {
            newErrors.question = "Question description is required.";;
        }
        if (!functionSignature.trim()) {
            newErrors.functionSignature = "Function signature is required.";
        }
        if (!wrapperCode.trim()) {
            newErrors.wrapperCode = "Wrapper code is required.";
        }
        if (testCases.length === 0){
            newErrors.testCases = "At least one test case is required.";
        }
        if (testCases.some(testCase => !testCase.input.trim() || !testCase.output.trim())) {
            newErrors.testCases = "All test cases must have both input and output.";
        }
        if (!selectedLanguage) {
            newErrors.language = "Please select a programming language.";
        }
        if (points <= 0) {
            newErrors.points = "Points must be greater than 0.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        //Clear error if everything is valid
        setErrors({});
        return true;
    }

    const resetForm = () => {
        setQuestionDescription("");
        setFunctionSignature("");
        setWrapperCode("");
        setTestCases([{ input: "", output: "" }]);
        setSelectedLanguage(null);
        setPoints(0);
        setErrors({});
    }

    // Function to handle adding a new question
  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };
  
  // Function to handle deleting a question
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  }

  // Function to handle editing a question
  const handleEditQuestion = (index) => {
    setEditQuestionIndex(index);
    setShowEditQuestion(true);
  }

  // Function to save changes after editing a question
  const handleSaveChanges = (updatedQuestion) => {
    const updatedQuestions = [...questions]
    updatedQuestions[editQuestionIndex] = updatedQuestion
    setQuestions(updatedQuestions);
    setShowEditQuestion(false);
    setEditQuestionIndex(null);
}

    const saveAllQuestions = async () => {
        setLoading(true);
        setErrors(null)
        try{
            for (const question of questions) {
                const payload = {
                    question_description: question.question,
                    function_signature: question.functionSignature,
                    wrapper_code: question.wrapperCode,
                    test_cases: question.testCases,
                    language_id: question.selectedLanguage,
                    points: question.points,
                    exam_id: examId,
                };
                await createCodeQuestion(payload);
                console.log("Attempting to save questions for exam:", examId);
            }
            setQuestions([]);
            resetForm();
            alert("All questions saved successfully!");
        } catch (error) {
            console.log("Attempting to save questions for exam:", examId);
            console.error("Error saving questions:", error);
            setErrors("Failed to save questions. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    
    return {
        testCases,
        selectedLanguage,
        questionDescription,
        functionSignature,
        wrapperCode,
        points,
        setTestCases,
        setSelectedLanguage,
        setQuestionDescription,
        setFunctionSignature,
        setWrapperCode,
        setPoints,
        addTestCase,
        setErrors,
        errors,
        validate,
        resetForm,
        loading,
        setLoading, 
        questions,
        setQuestions,
        showEditQuestion,
        setShowEditQuestion,
        editQuestionIndex,
        setEditQuestionIndex,
        handleSaveChanges,
        handleAddQuestion,
        handleDeleteQuestion,   
        handleEditQuestion,
        saveAllQuestions
    };

} 