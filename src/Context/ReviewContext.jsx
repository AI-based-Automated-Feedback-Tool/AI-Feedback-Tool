import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the most recent student ID from exam_submissions
  const fetchStudentId = async () => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions")
        .select("student_id")
        .order("submitted_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data.length > 0 ? data[0].student_id : null;
    } catch (error) {
      console.error("Error fetching student ID:", error);
      return null;
    }
  };

  // Fetch the latest submission ID for that student
  const fetchSubmissionId = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions")
        .select("id")
        .eq("student_id", studentId)
        .order("submitted_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data.length > 0 ? data[0].id : null;
    } catch (error) {
      console.error("Error fetching submission ID:", error);
      return null;
    }
  };

  // Fetch review data with JOIN from exam_submissions
  const fetchReviewData = async (submissionId) => {
    try {
      const { data, error } = await supabase
        .from("exam_submissions_answers")
        .select(`
          *,
          exam_submissions (
            total_score,
            time_taken,
            focus_loss_count,
            feedback_summery
          )
        `)
        .eq("submission_id", submissionId);

      if (error) throw error;

      // Merge nested exam_submissions fields into each review record
      const combinedData = data.map((item) => ({
        ...item,
        total_score: item.exam_submissions?.total_score ?? null,
        time_taken: item.exam_submissions?.time_taken ?? null,
        focus_loss_count: item.exam_submissions?.focus_loss_count ?? null,
        feedback_summary: item.exam_submissions?.feedback_summery ?? null,
      }));

      setReviewData(combinedData);
    } catch (error) {
      console.error("Error fetching review data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const studentId = await fetchStudentId();
      if (studentId) {
        const submissionId = await fetchSubmissionId(studentId);
        if (submissionId) {
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
