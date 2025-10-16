import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getExamTypeForSubmission = async (submissionId) => {
    const { data, error } = await supabase
      .from("exam_submissions")
      .select("exam_id, exams(type)")
      .eq("id", submissionId)
      .single();

    if (error) {
      console.error("[Review] getExamTypeForSubmission error:", error.message);
      throw new Error("Could not determine exam type: " + error.message);
    }
    console.log("[Review] type for submission", submissionId, "=>", data?.exams?.type);
    return data?.exams?.type; // "mcq" | "essay" | "code"
  };

  const fetchReviewData = useCallback(async (submissionId) => {
    if (!submissionId) {
      setError("Invalid submission ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const type = await getExamTypeForSubmission(submissionId);

      if (type === "essay") {
        const response = await fetch(
          `http://localhost:3000/api/essay-feedback/review/${submissionId}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Essay review failed");
        setReviewData(data);
        return;
      }

      if (type === "mcq") {
        const { data, error } = await supabase
          .from("exam_submissions_answers")
          .select(`
            id,
            submission_id,
            question_id,
            student_answer,
            is_correct,
            score,
            ai_feedback,
            model_answer_basic,
            model_answer_advanced,
            mcq_questions (
              question_text,
              options,
              answers,
              points
            )
          `)
          .eq("submission_id", submissionId);

        if (error) throw new Error(error.message);
        setReviewData(data || []);
        return;
      }

      if (type === "code") {
        const { data, error } = await supabase
          .from("code_submissions_answers")
          .select(`
            id,
            submission_id,
            question_id,
            student_answer,
            is_correct,
            score,
            ai_feedback,
            code_questions (
              question_description,
              function_signature,
              points
            )
          `)
          .eq("submission_id", submissionId);

        if (error) throw new Error(error.message);
        setReviewData(data || []);
        return;
      }

      throw new Error(`Unsupported exam type: ${type}`);
    } catch (err) {
      console.error("Error fetching review:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ReviewContext.Provider value={{ reviewData, fetchReviewData, loading, error }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => useContext(ReviewContext);
