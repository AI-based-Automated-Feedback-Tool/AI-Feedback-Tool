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
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Please login to view courses");
        }

        // Fetch ALL courses (simplified approach)
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("course_id, course_code, title, description")
          .order("created_at", { ascending: false });

        if (courseError) throw courseError;
        
        setCourses(courseData || []);
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
          <p className="mt-2">Loading courses...</p>
        </div>
      ) : (
        <div className="card shadow p-4">
          <div className="card-header d-flex align-items-center">
            <i className="fas fa-book fa-2x me-3 text-primary"></i>
            <h2 className="mb-0">All Courses</h2>
          </div>
          <div className="card-body">
            <div className="row mt-3">
              {courses.map((course) => (
                <div
                  key={course.course_id}
                  className="col-md-4 col-sm-6 col-12 mb-4"
                  onClick={() =>
                    navigate(`/teacher/courses/${course.course_id}/exams`) // Using course_id now
                  }
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
                <p className="text-center text-muted">No courses available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;