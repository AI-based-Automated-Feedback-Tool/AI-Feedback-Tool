import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import { Alert } from "react-bootstrap";
import "../../css/pages/TeacherCourses.css";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Please login to view courses");
        }

        // Step 1: Get all exams created by this user
        const { data: exams, error: examsError } = await supabase
          .from('exams')
          .select('course_id')
          .eq('user_id', user.id)
          .not('course_id', 'is', null); 

        if (examsError) throw examsError;

        // Extract unique course_ids from exams
        const courseIds = [...new Set(exams.map(exam => exam.course_id))];
        
        if (courseIds.length === 0) {
          setCourses([]);
          return;
        }

        // Step 2: Get course details for these course_ids
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('course_id, course_code, title, description')
          .in('course_id', courseIds)
          .order('title', { ascending: true });

        if (coursesError) throw coursesError;

        setCourses(coursesData || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="courses-loading-container">
        <div className="courses-loading-spinner"></div>
        <div className="courses-loading-text">
          Loading your courses...
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-courses-page">
      {/* Hero Section */}
      <div className="courses-hero-section">
        <div className="container">
          <div className="courses-hero-content">
            <h1 className="courses-hero-title">
              <i className="fas fa-graduation-cap me-3"></i>
              Teacher Dashboard
            </h1>
            <p className="courses-hero-subtitle">
              Manage your courses and create exceptional learning experiences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container courses-content-container">
        {error && (
          <Alert variant="danger" className="courses-error-alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Courses Header */}
        <div className="courses-header-section">
          <h2 className="courses-header-title">
            <i className="fas fa-book courses-header-icon"></i>
            Your Courses
            {courses.length > 0 && (
              <span className="courses-count-badge">
                {courses.length} Course{courses.length !== 1 ? 's' : ''}
              </span>
            )}
          </h2>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map((course, index) => (
              <div
                key={course.course_id}
                className="course-card"
                onClick={() => navigate(`/teacher/courses/${course.course_id}/exams`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="course-card-header">
                  <h3 className="course-title">{course.title}</h3>
                </div>
                <div className="course-card-body">
                  <div>
                    <div className="course-code">
                      <i className="fas fa-tag me-2"></i>
                      {course.course_code}
                    </div>
                    <p className="course-description">
                      {course.description || "No description available for this course."}
                    </p>
                  </div>
                  <div className="course-stats">
                    <div className="course-stat">
                      <i className="fas fa-file-alt"></i>
                      <span>Exams</span>
                    </div>
                    <div className="course-stat">
                      <i className="fas fa-users"></i>
                      <span>Students</span>
                    </div>
                    <i className="fas fa-arrow-right course-action-icon"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="courses-empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <h3 className="empty-state-title">No Courses Found</h3>
            <p className="empty-state-description">
              You haven't created any exams yet. Start by creating your first exam to see courses appear here.
            </p>
            <button 
              className="empty-state-action"
              onClick={() => navigate('/teacher/configure-exam')}
            >
              <i className="fas fa-plus me-2"></i>
              Create Your First Exam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;