import { useState, useEffect } from "react";

export default function useCodeQuestionForm(initialQuestion = null) {
    const [questionDescription, setQuestionDescription] = useState("");
    const [functionSignature, setFunctionSignature] = useState("");
    const [wrapperCode, setWrapperCode] = useState("");
    const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);   
    const [points, setPoints] = useState(0);
    const [errors, setErrors] = useState({});
    
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
        setPoints(1);
        setErrors({});
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
        resetForm
    };

} 