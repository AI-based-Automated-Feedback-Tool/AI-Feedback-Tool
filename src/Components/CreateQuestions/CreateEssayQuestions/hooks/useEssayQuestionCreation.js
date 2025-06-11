import React from 'react'
import { useState, useEffect } from 'react';

export default function useEssayQuestionCreation(examId, question_count) {
    const [questionText, setQuestionText] = useState("");
    const [attachments, setAttachments] = useState(null);
    const [wordLimit, setWordLimit] = useState("");
    const [points, setPoints] = useState("");
    const [gradingNotes, setGradingNotes] = useState("");

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
        setGradingNotes 
    };
}
