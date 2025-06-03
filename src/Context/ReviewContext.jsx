import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentId = async () => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions")
        .select("student_id")
        .limit(1);
      if (error) throw error;
      return data.length > 0 ? data[0].student_id : null;
    } catch (error) {
      console.error("Error fetching student ID:", error);
      return null;
    }
  };

  const fetchSubmissionDetails = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions")
        .select("*")
        .eq("student_id", studentId)
        .limit(1);
      if (error) throw error;
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error fetching submission details:", error);
      return null;
    }
  };

  const fetchReviewData = async (submissionId) => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions_answers")
        .select("*")
        .eq("submission_id", submissionId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching review data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const studentId = await fetchStudentId();
      if (!studentId) return setLoading(false);

      const submission = await fetchSubmissionDetails(studentId);
      if (!submission) return setLoading(false);

      const answers = await fetchReviewData(submission.id);

      // Enrich each answer with additional info from submission
      const enrichedData = answers.map((item) => ({
        ...item,
        total_score: submission.total_score || 0,
        time_taken: submission.time_taken || "Not recorded",
        focus_loss_count: submission.focus_loss_count || 0,
        feedback_summary: submission.feedback_summary || "",
      }));

      setReviewData(enrichedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <ReviewContext.Provider value={{ reviewData, loading }}>
      {children}
    </ReviewContext.Provider>
  );
};
