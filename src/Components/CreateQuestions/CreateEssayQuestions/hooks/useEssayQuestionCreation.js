import { useState, useEffect } from 'react';
import { uploadAttachment } from "../service/createEssayQuestionService"; // Adjust the import path as necessary
import { useRef } from 'react';

export default function useEssayQuestionCreation(examId, question_count) {
    const [question, setQuestion] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [attachments, setAttachments] = useState(null);
    const [wordLimit, setWordLimit] = useState("");
    const [points, setPoints] = useState("");
    const [gradingNotes, setGradingNotes] = useState("");
    const [error, setError] = useState({});
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [editQuestionIndex, setEditQuestionIndex] = useState(null);

    const fileInputRef = useRef(null);

    //To check allowed file type attached
    const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'video/mp4', 'audio/mpeg'];

    // Validate the question text
    const validate = () => {
        const newError = {}
        if (!questionText.trim()) {
            newError.questionText = "Question is required.";
        }
        if(!points || isNaN(points) || points <= 0) {
            newError.points = "Points are required and must be a positive number.";
        }
        if(!gradingNotes.trim()) {
            newError.gradingNotes = "Grading notes are required.";
        }
        if(isNaN(wordLimit) || wordLimit <= 0) {
            newError.wordLimit = "Word limit must be a positive number.";
        }
        if (attachments && !allowedFileTypes.includes(attachments.type)) {
            newError.attachments = "Invalid file type. Please upload a valid file.";
        }
        if (Object.keys(newError).length > 0){
            setError(newError);
            return false;
        }
        // Clear errors if everything is valid
        setError({});
        return true;
    }
    // Reset the form fields
    const resetForm = () => {
        setQuestionText("");
        setAttachments(null);
        setWordLimit("");
        setPoints("");
        setGradingNotes("");
        setError({});
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    }

    // Function to handle saving the question
    const onSaveQuestion = async() => {
        const isValid = validate();
        if (!isValid) {
            return; // Don't proceed if there are validation errors
        }
        let uploadedUrl = null;
        if(attachments) {
            try {
                const result = await uploadAttachment(attachments);

                if (result?.url?.publicUrl) {
                    uploadedUrl = result.url.publicUrl;
                } else {
                    throw new Error(result.message || "Invalid upload response");
                }

            } catch (err) {
                setError(prevError => ({
                    ...prevError,
                    attachments: "Failed to upload attachment. Please try again."
                }));
                return;
            }            
        }
        
        const newQuestion = {
            question_text: questionText,
            attachment_url: uploadedUrl,
            word_limit: wordLimit,
            points: points,
            grading_note: gradingNotes,
        }
        
        setQuestion(prevQuestions => [...prevQuestions, newQuestion]);
        resetForm();
    }

    // Function to handle deleting a question
    const handleDeleteQuestion = (index) => {
        const updatedQuestions = [...question];
        updatedQuestions.splice(index, 1);
        setQuestion(updatedQuestions);
    };

    // Function to handle editing a question
    const handleEditQuestion = (index) => {
        setEditQuestionIndex(index);
        setShowEditQuestion(true);
    };
    // Function to save changes after editing a question
    // Function to save changes after editing a question
    const handleSaveChanges = (updatedQuestion) => {
        const updatedQuestions = [...question];
        updatedQuestions[editQuestionIndex] = updatedQuestion;
        setQuestion(updatedQuestions);
        setShowEditQuestion(false);
        setEditQuestionIndex(null);
    };

    return {
        question,
        examId,
        questionText,
        attachments,
        wordLimit,
        points,
        gradingNotes,
        setQuestionText,
        setAttachments, 
        setWordLimit,
        setPoints,
        setGradingNotes,
        error,
        onSaveQuestion ,
        fileInputRef,
        handleDeleteQuestion,
        handleEditQuestion,
        editQuestionIndex,
        showEditQuestion,
        setShowEditQuestion,
        handleSaveChanges
    };
}
