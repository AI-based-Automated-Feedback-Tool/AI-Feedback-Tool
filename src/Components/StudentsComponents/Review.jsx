import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReview } from "../../Context/reviewContext";
import React, { useEffect, useState } from "react";


const Review = () => {
  //extracting submission id from url parameter
  const { submissionId } = useParams();
  //destructuring review related data and functions from the review context
  const { reviewData, fetchReviewData, loading, error } = useReview();

  const [autoRefreshing, setAutoRefreshing] = useState(false);

  //fetch review data when submission id changes
  useEffect(() => {
  setAutoRefreshing(true);
  const interval = setInterval(() => {
    console.log("Auto-refreshing review data...");
    fetchReviewData(submissionId);
  }, 5000); // 5 sec

  return () => {
    clearInterval(interval);
    setAutoRefreshing(false);
  };
}, [fetchReviewData, submissionId]);
  

  if (loading) return <p>Loading review...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!reviewData) return <p>No review data found.</p>;

  //render review data
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Exam Review</h2>
    <button
     onClick={() => fetchReviewData(submissionId)}
     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
    >
     Refresh AI Feedback
    </button>

      {reviewData.map((entry, index) => {
        const q = entry.mcq_questions;
        return (
          <div key={entry.id} className="p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold">{index + 1}. {q.question_text}</h3>

            <ul className="my-2 space-y-1">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={`list-group-item ${
                    entry.student_answer?.includes(opt)
                      ? entry.is_correct
                        ? "list-group-item-success"
                          : "list-group-item-danger"
                      : ""
                  }`}
                >
                  {opt}
                  {q.answers.includes(opt) && (
                    <span className="badge bg-success ms-2">(Correct)</span>
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
              <p><strong>AI Feedback:</strong> {entry.ai_feedback?.feedback || "Pending AI feedback generation"}</p>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Review;
