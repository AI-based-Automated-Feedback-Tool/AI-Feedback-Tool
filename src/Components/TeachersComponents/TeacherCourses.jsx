// TeacherCourses.js – Step 2: Fetch all courses

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import "../../css/Courses.css";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase.from("courses").select("*");
        if (error) throw error;
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mt-3">
      <h4 className="mb-4">Welcome to Teacher Dashboard</h4>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="card shadow p-4">
          <div className="card-header d-flex align-items-center">
            <i className="fas fa-book fa-2x me-3 text-primary"></i>
            <h2 className="mb-0">Courses</h2>
          </div>
          <div className="card-body">
            <div className="row mt-3">
              {courses.map((course, index) => (
                <div
                  key={course.id || index}
                  className="col-md-4 col-sm-6 col-12 mb-4"
                  onClick={() =>
                    navigate(`/teacher/courses/${course.course_code}/exams`)
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
