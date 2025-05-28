import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  //to store review data fetched
  const [reviewData, setReviewData] = useState([]);
  //to manage loading status
  const [loading, setLoading] = useState(true);

  //to fetch the student ID from the 'exam_submissions' table
  const fetchStudentId = async () => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions")
        .select("student_id")
        .limit(1);

      if (error) {
        throw error;
      }
      //return the student ID if data exists, otherwise return null
      return data.length > 0 ? data[0].student_id : null;
    } catch (error) {
      console.error("Error fetching student ID:", error);
      return null;
    }
  };

  //to fetch review data for a specific student ID
  const fetchReviewData = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions")
        .select(
          "exam_id, total_score, time_taken, focus_loss_count, feedback_summery"
        )
        .eq("student_id", studentId);

      if (error) {
        throw error;
      }

      setReviewData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching review data:", error);
      setLoading(false);
    }
  };
  //hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const studentId = await fetchStudentId();
      if (studentId) {
        await fetchReviewData(studentId);
      } else {
        console.error("No student ID found.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ReviewContext.Provider value={{ reviewData, loading }}>
      {children}
    </ReviewContext.Provider>
  );
};
