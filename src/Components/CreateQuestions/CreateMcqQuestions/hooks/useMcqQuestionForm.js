import { useState, useEffect } from "react"; 
import { generateMcqQuestion } from "../service/aiQuestionGenerationService"; 

const useMcqQuestionForm = (onSave, questionCount, noOfQuestions) => {
    const [questionText, setQuestionText] = useState("");
    const [answerOptions, setAnswerOptions] = useState(["","","",""])
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [numOfAnswers, setNumOfAnswers] = useState(1);
    const [points, setPoints] = useState("");
    const [errors, setErrors] = useState({});
    const [questionTopic, setQuestionTopic] = useState("");
    const [questionNo, setQuestionNo] = useState("");
    const [questionDifficulty, setQuestionDifficulty] = useState("Easy");
    const [guidance, setGuidance] = useState("");
    const [keyConcepts, setKeyConcepts] = useState("");
    const [doNotInclude, setDoNotInclude] = useState("");
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    // State to track which questions are checked
    const [checkedAIQuestions, setCheckedAIQuestions] = useState([]);
    // State to track the generated questions
    const [generatedAndSelectedQuestions, setGeneratedAndSelectedQuestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiModel, setAiModel] = useState("cohere");

    // Set answer options
    const handleAnswerOptionsChange = (e, index) => {
        const latestAnswerOptions = [...answerOptions];
        latestAnswerOptions[index] = e.target.value;
        setAnswerOptions(latestAnswerOptions)
    };

    // Toggle checkbox for correct answers and remove if already selected
    const handleCheckboxChange = (value) => {
        if (correctAnswers.includes(value)) {
            setCorrectAnswers(correctAnswers.filter(ans => ans !== value));
        } else {
            setCorrectAnswers([...correctAnswers, value]);
        }
    };

    //Set number of answers
    const handleNumOfAnswersChange = (e) => {
        const enteredValue = parseInt(e.target.value);
        setNumOfAnswers(enteredValue);
    };

    // Form validation before submission
    const handleAddQuestion = () => {
        const trimmedAnswers = answerOptions.map(opt => opt.trim());
        const newErrors = {};

        if (!questionText.trim()) newErrors.question = "Question is required.";
        if (trimmedAnswers.includes("")) {
            newErrors.answers = "All answer options must be filled.";
        }
        if (!points || isNaN(points) || parseInt(points) < 1) {
            newErrors.points = "Points must be at least 1.";
        }
        if (correctAnswers.length !== parseInt(numOfAnswers)) {
            newErrors.correct = `Select exactly ${numOfAnswers} correct answer(s).`;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0){
            const newQuestion = {
                question: questionText,
                answers: trimmedAnswers,
                numOfAnswers: numOfAnswers,
                correctAnswers: correctAnswers,
                points: points
            }
            const success = onSave( newQuestion);

            // Reset form fields
            if(success){
                setQuestionText("");
                setAnswerOptions(["", "", "", ""]);
                setCorrectAnswers([]);
                setNumOfAnswers(1);
                setPoints("");
                setErrors({});
            }   
        }
    }

    // Function to generate questions using AI
    const generateQuestion = async () => {
        setGeneratedQuestions([]);
        setCheckedAIQuestions([]);
        setGeneratedAndSelectedQuestions([]);
        // Basic validation
        const newErrors = {};
        if (!questionTopic.trim())
            newErrors.questionTopic = "Question topic is required.";
        if (!questionNo || isNaN(questionNo) || parseInt(questionNo) < 1)
            newErrors.questionNo = "Enter a valid number of questions.";
        if (!guidance.trim())
            newErrors.guidance = "Guidance is required.";   
        setErrors(newErrors);   

        if (Object.keys(newErrors).length === 0) {
            setIsGenerating(true);
            try {
                const params = {
                    topic: questionTopic,
                    numQuestions: questionNo,
                    difficulty: questionDifficulty,
                    guidance: guidance,
                    keyConcepts: keyConcepts,
                    doNotInclude: doNotInclude,
                    questionType: "multiple choice",
                    aiModel: aiModel
                };
                const data = await generateMcqQuestion(params);
                
                if(data.questions && data.questions.length > 0){
                    setGeneratedQuestions(data.questions);
                }
            } catch (error) {
                console.error("Error generating question:", error);
                //needed to show error to user in UI later
                setErrors(prev => ({
                    ...prev,
                    generation: "Failed to generate questions. Please try again.",
                }));
            } finally {
                setIsGenerating(false);
            }
            setIsGenerating(false);
        }
    }

    // Handle checkbox change
    const handleCheckboxChangeAIQ = (index) => {
        setCheckedAIQuestions((prev) => ({
        ...prev,
        [index]: !prev[index],
        }));
    }

    // Function to save checked questions
    const saveCheckedQuestions = () => {
        //check if user has selected more than required number of questions
        const newErrors = {};
        setErrors(newErrors);

        const selectedCount = Object.values(checkedAIQuestions).filter(Boolean).length;

        if (selectedCount > questionCount - noOfQuestions) {
            newErrors.aiQuestionsCount = `You can't select more than ${questionCount - noOfQuestions} question(s).`;
            setErrors(newErrors);
            return;
        } else if (selectedCount === 0) {
            newErrors.aiQuestionsCount = "Select at least one question to add.";
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        const selectedQuestions = generatedQuestions.filter((q, index) => checkedAIQuestions[index]);
        setGeneratedAndSelectedQuestions(selectedQuestions);

        //add questions to main questions list
        selectedQuestions.forEach((q) => {
            const formattedQuestion = {
                question: q.question,
                answers: q.choices,
                numOfAnswers: 1,
                correctAnswers: [q.correct_answer],
                points: 1 //default points
            }
            onSave(formattedQuestion);
        })

        // Clear question generation form 
        setQuestionTopic("");
        setQuestionNo("");
        setQuestionDifficulty("Easy");
        setGuidance("");
        setKeyConcepts("");
        setDoNotInclude("");
        setAiModel("cohere");

        // Clear generated questions and selections
        setGeneratedQuestions([]);
        setCheckedAIQuestions([]);
        setGeneratedAndSelectedQuestions([]);
        setErrors({});
        
    }
    
    return {
        questionText, setQuestionText,
        answerOptions, setAnswerOptions,
        correctAnswers, setCorrectAnswers,
        numOfAnswers, setNumOfAnswers,
        points, setPoints,
        errors, setErrors,
        handleAddQuestion,
        handleAnswerOptionsChange,
        handleCheckboxChange,
        handleNumOfAnswersChange,
        questionTopic, 
        setQuestionTopic,
        questionNo, 
        setQuestionNo,
        questionDifficulty, 
        setQuestionDifficulty,
        guidance, 
        setGuidance,
        keyConcepts, 
        setKeyConcepts,
        doNotInclude, 
        setDoNotInclude,
        generateQuestion,
        generatedQuestions,
        checkedAIQuestions,
        handleCheckboxChangeAIQ,
        saveCheckedQuestions,
        generatedAndSelectedQuestions,
        isGenerating,
        setAiModel,
        aiModel
    }
}

export default useMcqQuestionForm;