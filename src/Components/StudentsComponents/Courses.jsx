import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/Courses.css";
import { UserContext } from "../../Context/userContext.jsx";

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrolledCourses");
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userData, fetchUserData } = useContext(UserContext);

  useEffect(() => {
    if (!userData && userId) fetchUserData(userId);
  }, [userId, userData, fetchUserData]);

  const userName = userData?.name || "User";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: allCoursesData, error: allCoursesError } = await supabase.from("courses").select("*");
        if (allCoursesError) {
          console.error("Error fetching all courses:", allCoursesError.message);
        } else {
          setAllCourses(allCoursesData);
        }

        const { data: enrolledCoursesData, error: enrolledCoursesError } = await supabase
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

  const handleEnroll = async (courseId) => {
    try {
      const alreadyEnrolled = enrolledCourses.some((c) => c.course_id === courseId);
      if (alreadyEnrolled) {
        alert("You are already enrolled in this course.");
        return;
      }

      const { error } = await supabase.from("student_courses").insert([
        {
          student_id: userId,
          course_id: courseId,
        },
      ]);

      if (error) {
        console.error("Enrollment error:", error.message);
        alert("Enrollment failed.");
      } else {
        alert("Enrolled successfully!");
        const { data } = await supabase
          .from("student_courses")
          .select("courses(*)")
          .eq("student_id", userId);
        setEnrolledCourses(data.map((e) => e.courses));
      }
    } catch (error) {
      console.error("Enrollment exception:", error);
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="text-center"><p>Loading...</p></div>
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
                      onClick={() => navigate(`/dashboard/courses/${course.course_id}/exams`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card h-100">
                        <div
                          className="card-header"
                          style={{
                            backgroundColor: `rgb(${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)})`,
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
                    <div
                      className="card h-100"
                      onClick={() => navigate(`/dashboard/courses/${course.course_id}/exams`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="card-header"
                        style={{
                          backgroundColor: `rgb(${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)})`,
                          color: "white",
                        }}
                      >
                        <h5 className="mb-0">{course.title}</h5>
                        <small>Course ID: {course.course_code}</small>
                      </div>
                      <div className="card-body">
                        <p className="card-text">{course.description}</p>
                        <button
                          className="btn btn-outline-primary btn-sm mt-2"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent card click
                            handleEnroll(course.course_id);
                          }}
                        >
                          Enroll
                        </button>
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
