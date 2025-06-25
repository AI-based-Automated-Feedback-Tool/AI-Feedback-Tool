import {  useState, useEffect } from 'react';
import { saveCourse } from '../service/registerCourseService';

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
        const courseData = {
            title: courseName,
            description: courseDescription,
            course_code: courseCode,
            user_id: userId,
        }
        try {
            const result = await saveCourse(courseData);
            if (result) {
                setCourseName('');
                setCourseDescription('');
                setCourseCode('');
                alert('Course registered successfully');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
        
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