import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import StudentSideBar from "./StudentSideBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useParams } from "react-router-dom";
import "../../css/Courses.css"

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //hook for accessing location state
  const location = useLocation();
  //for toogling navbar
  const [showSidebar, setShowSidebar] = useState(false);


  const { userId } = useParams();
  //extracting userName from the location state, with a fallback to user
  const userName = location.state?.userName || "User";
  console.log("User ID from URL:", userId);
  console.log("User Name from state:", userName);

  //array to add bg colour
  const bgColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FFC300",
    "#DAF7A6",
  ];

  //fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase.from("courses").select("*");
        if (error) {
          console.error("Error fetching courses:", error.message);
        } else {
          setCourses(data);
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
    <div className="d-flex">
  {/*fixed Icon to toggle sidebar*/}
 

    <div className="container mt-2">
      <h5>Welcome to Student Dashboard</h5>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="card shadow p-4">
          <div className="card-header d-flex align-items-center">
            <i className="fas fa-book fa-2x me-3"></i>
            <h2 className="mb-0">Courses</h2>
          </div>
          <div className="card-body">
            <div className="row mt-3">
              {courses.map((course, index) => (
                <div
                  key={course.id || index}
                  className="col-md-4 col-12 col-sm-6 mb-4"
                  onClick={() =>
                    navigate(`/dashboard/courses/${course.course_code}/exams`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow">
                    <div
                      className="card-header text-white text-center"
                      style={{
                        backgroundColor: bgColors[index % bgColors.length],
                        height: "150px",
                        width: "100%",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {course.title}
                    </div>
                    <div className="card-body">
                      <h6
                        className="card-subtitle mb-2 text-muted"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Course code: {course.course_code}
                      </h6>
                      <p className="card-text mt-3">{course.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Courses;
