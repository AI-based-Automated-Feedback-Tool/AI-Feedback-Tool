import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useParams } from "react-router-dom";
import "../../css/Courses.css";
import { UserContext } from "../../Context/userContext.jsx";

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("enrolledCourses");

  const { userId } = useParams();
  const { userData, fetchUserData } = useContext(UserContext);

  useEffect(() => {
    if (!userData && userId) {
      fetchUserData(userId);
    }
  }, [userId, userData, fetchUserData]);

  const userName = userData?.name || "User";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: allCoursesData, error: allCoursesError } = await supabase
          .from("courses")
          .select("*");

        if (allCoursesError) {
          console.error("Error fetching all courses:", allCoursesError.message);
        } else {
          setAllCourses(allCoursesData);
        }

        const { data: enrolledCoursesData, error: enrolledCoursesError } =
          await supabase
            .from("student_courses")
            .select("courses(*)")
            .eq("student_id", userId);

        if (enrolledCoursesError) {
          console.error("Error fetching enrolled courses:", enrolledCoursesError.message);
        } else {
          setEnrolledCourses(enrolledCoursesData.map((e) => e.courses));
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleEnroll = async (course_id) => {
    try {
      // Check if already enrolled
      const { data: existing, error: checkError } = await supabase
        .from("student_courses")
        .select("*")
        .eq("student_id", userId)
        .eq("course_id", course_id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking enrollment:", checkError.message);
        return;
      }

      if (existing) {
        alert("You're already enrolled in this course.");
        return;
      }

      const { error } = await supabase.from("student_courses").insert({
        student_id: userId,
        course_id,
      });

      if (error) {
        console.error("Error enrolling:", error.message);
        alert("Enrollment failed. Try again.");
      } else {
        alert("Successfully enrolled!");
        // Refresh enrolled courses
        const { data: updatedCourses } = await supabase
          .from("student_courses")
          .select("courses(*)")
          .eq("student_id", userId);
        setEnrolledCourses(updatedCourses.map((e) => e.courses));
      }
    } catch (err) {
      console.error("Unexpected error during enrollment:", err);
    }
  };

  const generateDarkColor = () => {
    const r = Math.floor(Math.random() * 128);
    const g = Math.floor(Math.random() * 128);
    const b = Math.floor(Math.random() * 128);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <h1 className="text-center mb-4">Welcome, {userName}!</h1>
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "enrolledCourses" ? "active" : ""}`}
                onClick={() => setActiveTab("enrolledCourses")}
              >
                Enrolled Courses
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "allCourses" ? "active" : ""}`}
                onClick={() => setActiveTab("allCourses")}
              >
                All Courses
              </button>
            </li>
          </ul>

          {activeTab === "enrolledCourses" && (
            <div>
              <h2>Enrolled Courses</h2>
              {enrolledCourses.length > 0 ? (
                <div className="row">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.course_id}
                      className="col-md-4 mb-4"
                      onClick={() =>
                        navigate(`/dashboard/courses/${course.course_id}/exams`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card h-100">
                        <div
                          className="card-header"
                          style={{
                            backgroundColor: generateDarkColor(),
                            color: "white",
                          }}
                        >
                          <h5 className="mb-0">{course.title}</h5>
                          <small>Course ID: {course.course_code}</small>
                        </div>
                        <div className="card-body">
                          <p className="card-text">{course.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No enrolled courses found.</p>
              )}
            </div>
          )}

          {activeTab === "allCourses" && (
            <div>
              <h2>All Courses</h2>
              <div className="row">
                {allCourses.map((course) => (
                  <div key={course.course_id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div
                        className="card-header"
                        style={{
                          backgroundColor: generateDarkColor(),
                          color: "white",
                        }}
                      >
                        <h5 className="mb-0">{course.title}</h5>
                        <small>Course ID: {course.course_code}</small>
                      </div>
                      <div className="card-body">
                        <p className="card-text">{course.description}</p>
                        <button
                          className="btn btn-outline-primary mt-2"
                          onClick={() => handleEnroll(course.course_id)}
                        >
                          Enroll
                        </button>
                      </div>
                      <div
                        className="card-footer text-muted"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/dashboard/courses/${course.course_id}/exams`)
                        }
                      >
                        View Exams
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
