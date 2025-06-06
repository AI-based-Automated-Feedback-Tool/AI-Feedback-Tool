import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReview } from "../../Context/ReviewContext";

const Review = () => {
  const { submissionId } = useParams();
  const { reviewData, fetchReviewData, loading, error } = useReview();

  useEffect(() => {
    if (submissionId) {
      fetchReviewData(submissionId);
    }
  }, [fetchReviewData, submissionId]);

  if (loading) return <p>Loading review...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!reviewData) return <p>No review data found.</p>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Exam Review</h2>
      {reviewData.map((entry, index) => {
        const q = entry.mcq_questions;
        return (
          <div key={entry.id} className="p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold">{index + 1}. {q.question_text}</h3>

            <ul className="my-2 space-y-1">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={`p-2 rounded ${
                    entry.student_answer?.includes(opt)
                      ? entry.is_correct
                        ? "bg-green-100"
                        : "bg-red-100"
                      : ""
                  }`}
                >
                  {opt}
                  {q.answers.includes(opt) && (
                    <span className="ml-2 text-green-600 font-semibold">(Correct)</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-2 space-y-1">
              <p><strong>Your Answer:</strong> {entry.student_answer?.join(", ")}</p>
              <p><strong>Correct:</strong> {entry.is_correct ? "Yes" : "No"}</p>
              <p><strong>Score:</strong> {entry.score}</p>
              <p><strong>Model Answer (Basic):</strong> {entry.model_answer_basic || "N/A"}</p>
              <p><strong>Model Answer (Advanced):</strong> {entry.model_answer_advance || "N/A"}</p>
              <p><strong>AI Feedback:</strong> {entry.ai_feedback || "N/A"}</p>
              <p><strong>Reflection Notes:</strong> {entry.reflection_notes || "N/A"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Review;
