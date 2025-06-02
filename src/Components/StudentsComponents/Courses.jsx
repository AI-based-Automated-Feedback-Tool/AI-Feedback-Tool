import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useParams } from "react-router-dom";
import "../../css/Courses.css";
import { UserContext } from "../../Context/userContext.jsx";
import { CourseContext } from "../../Context/courseContext.jsx";

const Courses = () => {
  const navigate = useNavigate();
  //my courses or all courses
  const [activeTab, setActiveTab] = useState("enrolledCourses");
  //state for search query
  const [searchQuery, setSearchQuery] = useState("");

  const { userId } = useParams();
  const { userData, fetchUserData } = useContext(UserContext);
  const {
    allCourses,
    enrolledCourses,
    fetchAllCourses,
    fetchEnrolledCourses,
    loading,
    enrollInCourse,
  } = useContext(CourseContext);

  //fetch user data if not already available
  useEffect(() => {
    if (!userData && userId) {
      fetchUserData(userId);
    }
  }, [userId, userData, fetchUserData]);

  //fetch courses using context
  useEffect(() => {
    if (userId) {
      fetchAllCourses();
      fetchEnrolledCourses(userId);
    }
  }, [userId, fetchAllCourses, fetchEnrolledCourses]);

  //fallback to "User"
  const userName = userData?.name || "User";

  console.log("User ID from URL:", userId);
  console.log("User Name from context:", userName);

  //filter courses based on search query
  const filteredEnrolledCourses = enrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredAllCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = (courseId) => {
    if (userId) {
      enrollInCourse(userId, courseId)
        .then(() => {
          console.log("Enrollment successful!");
        })
        .catch((error) => {
          console.error("Enrollment failed:", error);
        });
    } else {
      console.error("User ID is required to enroll in a course.");
    }
  };

  //donot show the exam content for non enrolled course
  const allCoursesClick = (courseId) => {
    const isEnrolled = enrolledCourses.some(
      (enrolledCourse) => enrolledCourse.course_id === courseId
    );
  
    if (isEnrolled) {
      alert("You can view the content in enrolled courses.");
    } else {
      alert("You need to enroll to display course content.");
    }
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
                  {filteredEnrolledCourses.map((course, index) => (
                    <div
                      key={`${course.course_id}-${index}`}
                      className="col-md-4 mb-4"
                      onClick={() =>
                        navigate(`/student/courses/${userId}/${course.course_id}/exams`)
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
                    onClick={() => allCoursesClick(course.course_id)}
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
                        {enrolledCourses.some(
                          (enrolledCourse) =>
                            enrolledCourse.course_id === course.course_id
                        ) ? (
                          <button
                            className="btn btn-secondary"
                            disabled
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(
                                "You have already enrolled in this course."
                              );
                            }}
                          >
                            Already Enrolled
                          </button>
                        ) : (
                          <button
                            className="btn btn-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnroll(course.course_id);
                            }}
                          >
                            Enroll to Course
                          </button>
                        )}
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
