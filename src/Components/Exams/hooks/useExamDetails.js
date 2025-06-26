import {  useState, useEffect } from 'react';
import { getExamDetails } from '../service/examDetailService';

const useExamDetails = ({examId}) => {
    const [examDetails, setExamDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return {
        examDetails,
        loading,
        error,
        formatDateTime
    };
};

export default useExamDetails;