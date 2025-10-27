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
    const [aiModel, setAiModel] = useState("cohere");

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
        setQuestions(prev => {
            if (prev.length >= parseInt(question_count)) {
            setWarning(`You can only add ${question_count} questions.`);
            return prev; 
            }
            const updated = [...prev, newQuestion];
            // Show warning if limit reached
            if (updated.length === parseInt(question_count)) {
            setWarning(`You have reached the limit of ${question_count} questions.`);
            } else {
            setWarning(null);
            }
            return updated;
        });
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
        const newErrors = {};
        if (questions.length != question_count) {
            newErrors.restriction = "Please add the exact number of questions required.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } 
        setErrors({});
        setLoading(true);
        
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
                    gradingDescription: gradingDescription,
                    aiModel: aiModel
                };
                const data = await generateCodeQuestion(params);
                    
                if(data.questions && data.questions.length > 0){
                    // Format test cases to ensure input/output are strings
                    const formattedQuestions = data.questions.map((q) => ({
                        ...q,
                        test_cases: q.test_cases?.map(tc => ({
                            input: typeof tc.input === "object" ? JSON.stringify(tc.input) : tc.input,
                            output: typeof tc.output === "object" ? JSON.stringify(tc.output) : tc.output
                        })) || []
                    }));
                    setGeneratedCodeQuestions(formattedQuestions);
                }
            } catch (error) {
                console.error("Error generating question:", error);
                //needed to show error to user in UI later
                const generateError = {};
                generateError.topic = "Failed to connect to server. Please check your connection and try again.";
                setErrors(generateError);
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

        // Clear previous saving error when user changes selection
        setErrors((prev) => {
            const { limit, ...rest } = prev || {};
            return rest;
        });
    }

    // Function to save checked questions
    const saveCheckedQuestions = () => {

        const selectedQuestions = generatedCodeQuestions.filter((q, index) => checkedAICodeQuestions[index]);
        setGeneratedAndSelectedQuestions(selectedQuestions);

        const newErrors = {};
        if (selectedQuestions.length === 0) {
            newErrors.limit = "Please select at least one question to add.";
            setErrors(newErrors);       
            return;
        } else if(questions.length + selectedQuestions.length > parseInt(question_count )) {      
            newErrors.limit = `Adding these questions exceeds the limit of ${question_count} questions. Please select fewer questions.`;
            setErrors(newErrors);
            return;
        }

        

        //add questions to main questions list
        selectedQuestions.forEach((q) => {
            const formattedQuestion = {
                question: q.question_description,
                functionSignature: q.function_signature,
                wrapperCode: q.wrapper_code,
                testCases: q.test_cases,    
                points: q.points,
                language: q.language || aiformSelectedLanguage
            }
            handleAddQuestion(formattedQuestion);
        })

        // Clear question generation form 
        setTopicDescription('');
        setAiformSelectedLanguage(null);
        setSubQuestionType(''); 
        setGuidance("");
        setKeyConcepts("");
        setDoNotInclude("");
        setQuestionNo(1);
        setExpectedFunctionSignature("");
        setGradingDescription("");
        setDifficulty('Easy');
        setAiModel("cohere");

        // Clear generated questions and selections
        setGeneratedCodeQuestions([]);
        setCheckedAICodeQuestions({});
        setGeneratedAndSelectedQuestions([]);
        setErrors({});
        setIsGenerating(false);
        
    }

    const hasReachedLimit = questions.length >= parseInt(question_count || 0);

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
        hasReachedLimit,
        aiModel,
        setAiModel
    };

} 