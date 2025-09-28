import { useState, useEffect } from "react";    

const useMcqQuestionForm = (onSave) => {
    const [questionText, setQuestionText] = useState("");
    const [answerOptions, setAnswerOptions] = useState(["","","",""])
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [numOfAnswers, setNumOfAnswers] = useState(1);
    const [points, setPoints] = useState("");
    const [errors, setErrors] = useState({});

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
        handleNumOfAnswersChange
    }
}

export default useMcqQuestionForm;