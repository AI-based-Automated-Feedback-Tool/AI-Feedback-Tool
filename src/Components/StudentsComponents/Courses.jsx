import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useParams } from "react-router-dom";
import "../../css/Courses.css";

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //hook for accessing location state
  const location = useLocation();
  //my courses or all courses
  const [activeTab, setActiveTab] = useState("allCourses");

  const { userId } = useParams();
  //extracting userName from the location state, with a fallback to user
  const userName = location.state?.userName || "User";
  console.log("User ID from URL:", userId);
  console.log("User Name from state:", userName);

  //fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        //fetch all courses
        const { data: allCoursesData, error: allCoursesError } = await supabase
          .from("courses")
          .select("*");
        if (allCoursesError) {
          console.error("Error fetching all courses:", allCoursesError.message);
        } else {
          setAllCourses(allCoursesData);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
                className={`nav-link ${
                  activeTab === "allCourses" ? "active" : ""
                }`}
                onClick={() => setActiveTab("allCourses")}
              >
                All Courses
              </button>
            </li>
          </ul>
          {activeTab === "allCourses" && (
            <div>
              <h2>All Courses</h2>
              <div className="row">
                {allCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="col-md-4 mb-4"
                    onClick={() =>
                      navigate(`/dashboard/courses/${course.course_code}/exams`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card h-100">
                      <div
                        className="card-header text-white"
                        style={{
                          backgroundColor: `#${Math.floor(
                            Math.random() * 16777215
                          ).toString(16)}`,
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
