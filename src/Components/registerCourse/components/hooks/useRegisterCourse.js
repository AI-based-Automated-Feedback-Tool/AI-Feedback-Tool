import {  useState, useEffect } from 'react';

const useRegisterCourse = () => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!courseName || !courseDescription || !courseCode) {
            setError('All fields are required');
            return false;
        }
        setError(null);
        return true;
    };

    const registerCourse = async (userId) => {
        if (!validateForm()) return;

        setLoading(true);
        
    }
    

    return {
        courseName,
        setCourseName,
        courseDescription,
        setCourseDescription,
        courseCode,
        setCourseCode,
        error,
        setError,
        loading,
        registerCourse,
    };
}
export default useRegisterCourse;