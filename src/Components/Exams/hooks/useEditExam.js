import {  useState, useEffect } from 'react';
import  useExamDetails  from './useExamDetails';
import { editExamDetails } from '../service/examDetailService'; 

const useEditExam = ({examId}) => {
    const { 
        examDetails, 
        loading, 
        error, 
        formatDateTime, 
        setError,
        setLoading,
        showEditExam,
        handleEditExam,     
        handleEditQuestion
    } = useExamDetails({ examId });

    const [type, setType] = useState(examDetails?.type);
    const [duration, setDuration] = useState(examDetails?.duration);
    const [startTime, setStartTime] = useState(examDetails?.start_time);
    const [endTime, setEndTime] = useState(examDetails?.end_time);
    const [instructions, setInstructions] = useState(examDetails?.instructions);
    const [aiAssessmentGuide, setAiAssessmentGuide] = useState(examDetails?.ai_assessment_guide);
    const [questionCount, setQuestionCount] = useState(examDetails?.questions.length || 0);

    const [questions, setQuestions] = useState(examDetails?.questions || []);
    

    const validate = () => {
        const newErrors = {};
        if (!type  || !['mcq', 'essay', 'code'].includes(type)) {
            newErrors.type = 'Please select a valid exam type.';
        }
        if (!duration || isNaN(duration) || duration <= 0) {
            newErrors.duration = 'Duration must be a positive number.';
        }
        if (!startTime) {
            newErrors.startTime = 'Start time is required.';
        }
        if (!endTime) {
            newErrors.endTime = 'End time is required.';
        }
        if (!questionCount || isNaN(questionCount) || questionCount <= 0) {
            newErrors.questionCount = 'Question count must be a positive number.';
        }
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return false;
        }
        //Clear error if everything is valid
        setError({});
        return true;
    }


    // Function to manage saving changes to the exam
    const manageSaveChangesToExam = async(updatedExam) => {
        try {
            const updatedExamDetails = await editExamDetails(updatedExam);
            setLoading(false);
            return updatedExamDetails;
        } catch (error) {
            setError({ message: error.message });
        } finally {
            setLoading(false);
        }

    };

    return {
        examDetails,
        loading,
        error,
        formatDateTime,
        showEditExam,
        type,
        setType,
        duration,
        setDuration,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        instructions,
        setInstructions,
        aiAssessmentGuide,
        setAiAssessmentGuide,
        questionCount,
        setQuestionCount,
        manageSaveChangesToExam,
        handleEditExam,
        setError,
        setLoading,
        validate,
        questions,
        setQuestions
    };
};

export default useEditExam;