import { useState } from "react";
import { saveMcqQuestion } from "./mcqQuestionService";

export const useMcqQuestion = (examId,userId) => {
    // State to manage sidebar visibility
    const [questions, setQuestions] = useState([]);
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [editQuestionIndex, setEditQuestionIndex] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Add question from child form
    const addQuestion = (newQuestion) => {
        setQuestions(prev => [...prev, newQuestion]);
    };
    // Delete question
    const deleteQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    };
    // Edit question
    const editQuestion = (index) => {
        setEditQuestionIndex(index);
        setShowEditQuestion(true);  
    }
    // Save edited question
    const saveEditedQuestion = (updatedQuestion) => {
        const updatedQuestions = [...questions];
        updatedQuestions[editQuestionIndex] = updatedQuestion;
        setQuestions(updatedQuestions);
        setShowEditQuestion(false);
    }
    // Save all questions to the database
    const saveAllQuestions = async () => {
        setLoading(true);
        setError(null);
        try{
            for (const question of questions) {
                const payload = {
                    exam_id: examId,
                    question_text: question.question,
                    options:question.answers,
                    answers: question.correctAnswers,
                    no_of_correct_answers: question.numOfAnswers,
                    points: question.points,
                    user_id:userId
                }
                await saveMcqQuestion(payload);
            }  
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
                     
    }
    return {
        questions,
        showEditQuestion,
        editQuestionIndex,
        addQuestion,
        deleteQuestion,
        editQuestion,
        saveEditedQuestion,
        saveAllQuestions,
        setShowEditQuestion,
        error,
        loading
    }
}