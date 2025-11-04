import { Alert } from 'react-bootstrap';
import LoadingCard from '../TeacherReport/components/LoadingCard';
import { useEffect, useState } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import CreateCourseForm from './components/CreateCourseForm';
import useRegisterCourse from './components/hooks/useRegisterCourse';
import '../../css/registerCourse/RegisterCourse.css';

export default function RegisterCourseContent() {
    const [userId, setUserId] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const { 
        courseName, 
        setCourseName, 
        courseDescription, 
        setCourseDescription, 
        courseCode, 
        setCourseCode,
        loading,
        registerCourse,
        error,
        setError    
    } = useRegisterCourse();

    useEffect(() => {
                const getUserId = async () => {
                    setLoadingUser(true);
                    const { data, error } = await supabase.auth.getUser();
                    if (error || !data?.user?.id) {
                        setError("Failed to get user ID");
                    } else {
                        setUserId(data.user.id);
                    }
                    setLoadingUser(false);
                }
                getUserId();
            }, []);
    return (
        <div className="register-course-page">
            <div className="container">

                {/* Hero Header */}
                <div className="glass-card mb-5" style={{ animationDelay: '0.1s' }}>
                    <div className="gradient-header">
                        <h4>
                        <i className="fas fa-book-open icon"></i>
                        Register New Course
                        </h4>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-muted mb-0">
                            Create a new course and start building exams
                        </p>
                    </div>
                </div>

                {loadingUser ? (
                    <LoadingCard />
                ) : (
                    <div className="glass-card">
                        <div className="p-5">
                            {error && (
                                <Alert variant="danger" className="mb-4">
                                {error}
                                </Alert>
                            )}

                            <CreateCourseForm
                                formState={{
                                courseName, setCourseName,
                                courseDescription, setCourseDescription,
                                courseCode, setCourseCode,
                                userId,
                                loading, registerCourse
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
