import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  //store review datya
  const [reviewData, setReviewData] = useState(null);
  //to track loading status
  const [loading, setLoading] = useState(false);
  //to store error messages
  const [error, setError] = useState(null);

  const getExamTypeForSubmission = async (submissionId) => {
  const { data, error } = await supabase
    .from("exam_submissions")
    .select("exam_id, exams(type)")
    .eq("id", submissionId)
    .single();

  if (error) {
    throw new Error("Could not determine exam type: " + error.message);
  }

  return data.exams.type;
};

  //fun to fetch review data based on submission ID
const fetchReviewData = useCallback(async (submissionId) => {
  if (!submissionId) {
    console.error("Invalid submissionId:", submissionId);
    setError("Invalid submission ID");
    return;
  }

  console.log("Fetching review data for submissionId:", submissionId);
  setLoading(true);
  setError(null);

  try {
    const type = await getExamTypeForSubmission(submissionId);
    let data;

    if (type === "essay") {
      const response = await fetch(
        `http://localhost:3000/api/essay-feedback/review/${submissionId}`
      );
      data = await response.json();
      if (!response.ok) throw new Error(data.error || "Essay review failed");
    } else {
      const { data: mcqData, error } = await supabase
        .from("exam_submissions_answers")
        .select(
          `
          *,
          mcq_questions (
            question_text,
            options,
            answers
          )
        `
        )
        .eq("submission_id", submissionId);

      if (error) throw new Error(error.message);
      data = mcqData;
    }

    setReviewData(data);
  } catch (err) {
    console.error("Error fetching review:", err.message);
    setError(err.message);
  } finally {
    setLoading(false);
  }
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
