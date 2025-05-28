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
  const fetchSubmissionId = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions_answers")
        .select("submission_id")
        .eq("submission_id", studentId) 
        .limit(1);

      if (error) {
        throw error;
      }
      return data.length > 0 ? data[0].submission_id : null;
    } catch (error) {
      console.error("Error fetching submission ID:", error);
      return null;
    }
  };

  const fetchReviewData = async (submissionId) => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions_answers")
        .select("*")
        .eq("submission_id", submissionId);

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
        //fetch submission ID dynamically
        const submissionId = await fetchSubmissionId(studentId); 
        if (submissionId) {
           //pass the fetched submission ID
          await fetchReviewData(submissionId);
        } else {
          console.error("No submission ID found.");
          setLoading(false);
        }
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
