import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from Supabase
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
    <div className="container mt-5">
      <h1>Welcome to Student Dashboard</h1>
      <h2>Courses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length > 0 ? (
        <ul className="list-group">
          {courses.map((course) => (
            <li key={course.id} className="list-group-item">
              {course.name} - {course.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default Courses;
