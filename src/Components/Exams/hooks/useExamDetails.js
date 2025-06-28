import {  useState, useEffect } from 'react';
import { getExamDetails } from '../service/examDetailService';

const useExamDetails = ({examId}) => {
    const [examDetails, setExamDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});
    

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const details = await getExamDetails(examId);
                setExamDetails(details);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            fetchExamDetails();
        }
    }, [examId]);

    //function to format date and time
    const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    //function to handle edit question
    const handleEditQuestion = (questionId, questionType) => {
        console.log(`Edit question with ID: ${questionId} and Type: ${questionType}`);
    };

    return {
        examDetails,
        setExamDetails,
        loading,
        setLoading,
        error,
        formatDateTime,
        setError,
        handleEditQuestion,
        
    };
};

export default useExamDetails;