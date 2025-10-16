import { useState, useEffect } from "react";
import { createCodeQuestion } from "../service/createCodeQuestionService";
import { supabase } from "../../../../SupabaseAuth/supabaseClient"; 
import { useNavigate } from 'react-router-dom';
import { generateCodeQuestion } from "../service/createCodeQuestionService";    
import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";

export default function useCodeQuestionForm( examId, question_count, initialQuestion = null  ) {
    const [userId, setUserId] = useState(null);
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
    const [warning, setWarning] = useState(null)

    //for ai code question generation
    const [aiformSelectedLanguage, setAiformSelectedLanguage] = useState(null);
    const [difficulty, setDifficulty] = useState('Easy');
    const [subQuestionType, setSubQuestionType] = useState(''); // 'Coding', 'Debugging', 'Algorithm Design'
    const [guidance, setGuidance] = useState("");
    const [keyConcepts, setKeyConcepts] = useState("");
    const [doNotInclude, setDoNotInclude] = useState("");
    const [questionNo, setQuestionNo] = useState(1);
    const [expectedFunctionSignature, setExpectedFunctionSignature] = useState("");
    const [gradingDescription, setGradingDescription] = useState("");    
    const [topicDescription, setTopicDescription] = useState('');
    const [generatedCodeQuestions, setGeneratedCodeQuestions] = useState([]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [checkedAICodeQuestions, setCheckedAICodeQuestions] = useState([]);
    const [generatedAndSelectedQuestions, setGeneratedAndSelectedQuestions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
            const getUserId = async () => {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    setErrors("Failed to get user ID");
                } else {
                    setUserId(data.user.id);
                }
            }
            getUserId();
        }, []);
    
    
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
        if (questions.length >= parseInt(question_count)) {
            setWarning(`You can only add ${question_count} questions.`);
            return false;
        }
        const newQuestionsList = [...questions, newQuestion]
        setQuestions(newQuestionsList);

        // Show warning if limit reached now
        if (newQuestionsList.length === parseInt(question_count)) {
            setWarning(`You have reached the limit of ${question_count} questions.`);
        } else {
            setWarning(null);
        }
        return true;
    };
  
    // Function to handle deleting a question
    const handleDeleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    // Function to handle editing a question
    const handleEditQuestion = (index) => {
        setEditQuestionIndex(index);
        setShowEditQuestion(true);
    };

    // Function to save changes after editing a question
    const handleSaveChanges = (updatedQuestion) => {
        const updatedQuestions = [...questions];
        updatedQuestions[editQuestionIndex] = updatedQuestion;
        setQuestions(updatedQuestions);
        setShowEditQuestion(false);
        setEditQuestionIndex(null);
    };

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
                    language_id: question.language.id,
                    points: question.points,
                    exam_id: examId,
                    user_id: userId
                };
                await createCodeQuestion(payload);
            }
            setQuestions([]);
            resetForm();
            setWarning("");
            alert("All questions saved successfully!");
            navigate("/teacher"); // Redirect to teacher dashboard
        } catch (error) {
            console.error("Error saving questions:", error);
            setErrors(
                {message: "Failed to connect to server. Please check your connection and try again."}
            );
        } finally {
            setLoading(false);
        }
    }

    // Function to handle AI question generation 
    const handleGenerateQuestions = async () => {
        // Basic validation
        const newErrors = {};
        if (!topicDescription.trim())
            newErrors.topicDescription = "Topic description is required.";
        if (!aiformSelectedLanguage)
            newErrors.aiformSelectedLanguage = "Please select a programming language.";
        if (!subQuestionType)
            newErrors.subQuestionType = "Please select a sub-question type.";
        if (!guidance.trim())
            newErrors.guidance = "Guidance is required.";
        if (!questionNo || isNaN(questionNo) || parseInt(questionNo) < 1)
            newErrors.questionNo = "Enter a valid number of questions.";
        if (!gradingDescription.trim())
            newErrors.gradingDescription = "Grading description is required.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsGenerating(true);
            try {
                const params = {
                    topicDescription: topicDescription,
                    aiformSelectedLanguageName: aiformSelectedLanguage ? aiformSelectedLanguage.name : "",
                    aiformSelectedLanguageID: aiformSelectedLanguage ? aiformSelectedLanguage.id : null,
                    subQuestionType: subQuestionType,
                    guidance: guidance,
                    keyConcepts: keyConcepts,
                    doNotInclude: doNotInclude,
                    questionNo: questionNo,
                    expectedFunctionSignature: expectedFunctionSignature,
                    gradingDescription: gradingDescription
                };
                const data = await generateCodeQuestion(params);
                    
                if(data.questions && data.questions.length > 0){
                    setGeneratedCodeQuestions(data.questions);
                }
            } catch (error) {
                console.error("Error generating question:", error);
                //needed to show error to user in UI later
            }
            setIsGenerating(false);
        }
    }

    // Handle checkbox change
    const handleCheckboxChangeCode = (index) => {
        setCheckedAICodeQuestions((prev) => ({
        ...prev,
        [index]: !prev[index],
        }));
    }

    // Function to save checked questions
    const saveCheckedQuestions = () => {

        const selectedQuestions = generatedCodeQuestions.filter((q, index) => checkedAICodeQuestions[index]);
        setGeneratedAndSelectedQuestions(selectedQuestions);
        console.log("Selected Questions:", selectedQuestions);

        if (selectedQuestions.length === 0) {
            alert("Please select at least one question to add.");
            return;
        }

        //add questions to main questions list
        selectedQuestions.forEach((q) => {
            console.log("Adding question:", q);
            const formattedQuestion = {
                question: q.question,
                functionSignature: q.functionSignature,
                wrapperCode: q.wrapperCode,
                testCases: q.testCases,
                language: q.language,
                points: q.points
            }
            handleAddQuestion(formattedQuestion);
        })
        
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
        saveAllQuestions,
        warning,
        aiformSelectedLanguage,
        setAiformSelectedLanguage,
        difficulty,
        setDifficulty,
        subQuestionType,
        setSubQuestionType,
        guidance,
        setGuidance,
        keyConcepts,
        setKeyConcepts,
        doNotInclude,
        setDoNotInclude,
        questionNo,
        setQuestionNo,
        expectedFunctionSignature,
        setExpectedFunctionSignature,
        gradingDescription,
        setGradingDescription,
        topicDescription,
        setTopicDescription,
        handleGenerateQuestions,
        generatedCodeQuestions,
        setGeneratedCodeQuestions,
        isGenerating,
        setIsGenerating,
        checkedAICodeQuestions,
        handleCheckboxChangeCode,
        saveCheckedQuestions,
    };

} 