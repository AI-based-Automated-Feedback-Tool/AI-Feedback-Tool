import { useState, useEffect } from "react"; 
import { generateMcqQuestion } from "../service/aiQuestionGenerationService"; 

const useMcqQuestionForm = (onSave) => {
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
        try {
            const params = {
                topic: questionTopic,
                numQuestions: questionNo,
                difficulty: questionDifficulty,
                guidance: guidance,
                keyConcepts: keyConcepts,
                doNotInclude: doNotInclude,
                questionType: "multiple choice"
            };
            const data = await generateMcqQuestion(params);
            
            //for just now print questions in console
            if(data.questions && data.questions.length > 0){
                setGeneratedQuestions(data.questions);
                console.log("Generated MCQ Questions:", data.questions);
            }
        } catch (error) {
            console.error("Error generating question:", error);
            //needed to show error to user in UI later
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
        const selectedQuestions = questions.filter((q, index) => checkedAIQuestions[index]);
        setGeneratedAndSelectedQuestions(selectedQuestions);
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
        generatedAndSelectedQuestions
    }
}

export default useMcqQuestionForm;