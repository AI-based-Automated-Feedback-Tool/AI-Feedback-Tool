import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviewData = useCallback(async (submissionId) => {
    if (!submissionId) {
      console.error("Invalid submissionId:", submissionId);
      setError("Invalid submission ID");
      return;
    }
  
    console.log("Fetching review data for submissionId:", submissionId);
    setLoading(true);
    setError(null);
  
    const { data, error } = await supabase
      .from("exam_submissions_answers")
      .select(`
        *,
        mcq_questions (
          question_text,
          options,
          answers
        )
      `)
      .eq("submission_id", submissionId);
  
    console.log("Data:", data, "Error:", error);
  
    if (error) {
      setError(error.message || "Something went wrong");
      setLoading(false);
      return;
    }
  
    setReviewData(data);
    setLoading(false);
  }, []);

  return (
    <ReviewContext.Provider
      value={{ reviewData, fetchReviewData, loading, error }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => useContext(ReviewContext);
