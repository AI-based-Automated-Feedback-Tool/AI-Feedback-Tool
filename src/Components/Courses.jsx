import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";
import StudentSideBar from "./StudentSideBar";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  //array to add bg colour
  const bgColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#DAF7A6"];

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
      <StudentSideBar />

      {/*main contents */}
      <div className="container mt-5">
        <h1>Welcome to Student Dashboard</h1>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="row mt-5">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="col-md-4 mb-4"
                onClick={() => alert(`You clicked on ${course.name}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow">
                  {/* img part with bg color */}
                  <div
                    className="card-header text-white text-center"
                    style={{
                      backgroundColor: bgColors[index % bgColors.length],
                      padding: "50px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {course.name}
                  </div>
                  <div className="card-body">
                    <p className="card-text">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;