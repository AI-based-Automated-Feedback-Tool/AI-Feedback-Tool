import { useState, useEffect } from "react";
import { saveMcqQuestion } from "./mcqQuestionService";
import { supabase } from "../../SupabaseAuth/supabaseClient"; 

export const useMcqQuestion = (examId, question_count) => {
    // State to manage sidebar visibility
    const [userId, setUserId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [editQuestionIndex, setEditQuestionIndex] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null)


    useEffect(() => {
        const getUserId = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                setError("Failed to get user ID");
            } else {
                setUserId(data.user.id);
            }
        }
        getUserId();
    }, []);

    // Add question from child form
    const addQuestion = (newQuestion) => {
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

    // Delete question
    const deleteQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);

        //clear warning message
        updated.length < parseInt(question_count) && setWarning(null)
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
        if(!userId){
            setError("User not authenticated");
            return;
        }
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
    // Clear all questions of table
    const clearQuestions = () => {
        setQuestions([]);
    };

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
        clearQuestions,
        error,
        loading,
        userId,
        warning
    }
}