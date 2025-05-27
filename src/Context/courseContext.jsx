import React, { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { supabase } from "../SupabaseAuth/supabaseClient";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  //to store all course
  const [allCourses, setAllCourses] = useState([]);
  //to store courses the user is enrolled in
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  //to track whether data is being loaded
  const [loading, setLoading] = useState(false);
  //to store any errors that occur during data fetching
  const [error, setError] = useState(null);

  //fetch all courses
  const fetchAllCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) {
        console.error("Error fetching all courses:", error.message);
        setError("Failed to fetch all courses.");
      } else {
        setAllCourses(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while fetching all courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  //fetch enrolled courses for a specific user
  const fetchEnrolledCourses = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("student_courses")
        .select("courses(*)")
        .eq("student_id", userId);
      if (error) {
        console.error("Error fetching enrolled courses:", error.message);
        setError("Failed to fetch enrolled courses.");
      } else {
        setEnrolledCourses(data?.map((e) => e.courses) || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while fetching enrolled courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  //effect to reset loading state when data changes
  useEffect(() => {
    if (!loading) {
      setError(null);
    }
  }, [allCourses, enrolledCourses]);

  return (
    <CourseContext.Provider
      value={{
        allCourses,
        enrolledCourses,
        fetchAllCourses,
        fetchEnrolledCourses,
        loading,
        error,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

//prop validation
CourseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
