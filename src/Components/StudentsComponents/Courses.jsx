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
  //my courses or all courses
  const [activeTab, setActiveTab] = useState("enrolledCourses");
    //state for search query
    const [searchQuery, setSearchQuery] = useState("");

  const { userId } = useParams();
  const { userData, fetchUserData } = useContext(UserContext);

  //fetch user data if not already available
  useEffect(() => {
    if (!userData && userId) {
      fetchUserData(userId);
    }
  }, [userId, userData, fetchUserData]);

  //fallback to "User"
  const userName = userData?.name || "User";

  console.log("User ID from URL:", userId);
  console.log("User Name from context:", userName);

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
         //fetch enrolled courses using studentid
      const { data: enrolledCoursesData, error: enrolledCoursesError } =
      await supabase
        .from("student_courses")
        .select("courses(*)")
        .eq("student_id", userId)
    if (enrolledCoursesError) {
      console.error(
        "Error fetching enrolled courses:",
        enrolledCoursesError.message
      );
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
}, [userId])

 //filter courses based on search query
 const filteredEnrolledCourses = enrolledCourses.filter((course) =>
  course.title.toLowerCase().includes(searchQuery.toLowerCase())
);
const filteredAllCourses = allCourses.filter((course) =>
  course.title.toLowerCase().includes(searchQuery.toLowerCase())
);

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
                  activeTab === "enrolledCourses" ? "active" : ""
                }`}
                onClick={() => setActiveTab("enrolledCourses")}
              >
                Enrolled Courses
              </button>
            </li>

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
           {/* search bar */}
           <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === "enrolledCourses" && (
            <div>
              <h2>Enrolled Courses</h2>
              {filteredEnrolledCourses.length > 0 ? (
                <div className="row">
                  {filteredEnrolledCourses.map((course) => (
                    <div
                      key={course.course_id}
                      className="col-md-4 mb-4"
                      onClick={() =>
                        navigate(
                          `/dashboard/courses/${course.course_code}/exams`
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card h-100">
                        <div
                          className="card-header"
                          style={{
                            backgroundColor: (() => {
                              //generate a random dark color
                              const randomDarkColor = () => {
                                const r = Math.floor(Math.random() * 128); 
                                const g = Math.floor(Math.random() * 128); 
                                const b = Math.floor(Math.random() * 128);
                                return `rgb(${r}, ${g}, ${b})`;
                              };
                              return randomDarkColor();
                            })(),
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
                {filteredAllCourses.map((course, index) => (
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
                          backgroundColor: (() => {
                            //generate a random dark color
                            const randomDarkColor = () => {
                              const r = Math.floor(Math.random() * 128); 
                              const g = Math.floor(Math.random() * 128); 
                              const b = Math.floor(Math.random() * 128); 
                              return `rgb(${r}, ${g}, ${b})`;
                            };
                            return randomDarkColor();
                          })(),
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
