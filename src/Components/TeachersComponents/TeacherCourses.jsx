import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import { Spinner, Alert } from "react-bootstrap";
import "../../css/Courses.css";

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

  return (
    <div className="container mt-3">
      <h4 className="mb-4">Welcome to Teacher Dashboard</h4>

      {error ? (
        <Alert variant="danger">
          {error}
        </Alert>
      ) : loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading your courses...</p>
        </div>
      ) : (
        <div className="card shadow p-4">
          <div className="card-header d-flex align-items-center">
            <i className="fas fa-book fa-2x me-3 text-primary"></i>
            <h2 className="mb-0">Your Courses</h2>
          </div>
          <div className="card-body">
            <div className="row mt-3">
              {courses.map((course) => (
                <div
                  key={course.course_id}
                  className="col-md-4 col-sm-6 col-12 mb-4"
                  onClick={() => navigate(`/teacher/courses/${course.course_id}/exams`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow">
                    <div
                      className="card-header text-white text-center"
                      style={{
                        backgroundColor: "#007bff",
                        height: "60px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {course.title}
                    </div>
                    <div className="card-body">
                      <h6 className="text-muted" style={{ fontSize: "0.85rem" }}>
                        Course Code: {course.course_code}
                      </h6>
                      <p className="card-text mt-2">{course.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <Alert variant="info" className="text-center">
                  You haven't created any exams yet. Create an exam to see courses here.
                </Alert>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;