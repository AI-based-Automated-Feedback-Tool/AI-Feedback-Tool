import React from 'react'
import { useState, useEffect } from 'react';

export default function useEssayQuestionCreation(examId, question_count) {
    const [questionText, setQuestionText] = useState("");
    const [attachments, setAttachments] = useState(null);
    const [wordLimit, setWordLimit] = useState("");
    const [points, setPoints] = useState("");
    const [gradingNotes, setGradingNotes] = useState("");
    const [error, setError] = useState({});

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

    return {
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
        error 
    };
}
