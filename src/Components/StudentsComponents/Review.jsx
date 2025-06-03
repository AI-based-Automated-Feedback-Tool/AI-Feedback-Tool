import React, { useContext } from "react";
import { ReviewContext } from "../../Context/reviewContext";

const Review = () => {
   // Consume review data and loading state from context
  const { reviewData, loading } = useContext(ReviewContext);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Exam Review</h1>

     {/* Display message if no review data is available */}
      {reviewData.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          No reviews available.
        </div>
      ) : (
        reviewData.map((review, index) => (
          <form
            key={review.id || review.exam_id || index}
            className="border p-4 mb-4 rounded shadow-sm"
          >
             {/* Answer ID */}
            <div className="mb-3">
              <label className="form-label">ID</label>
              <input
                type="text"
                className="form-control"
                value={review.id || ""}
                readOnly
              />
            </div>
             {/* Score for the specific answer */}
            <div className="mb-3">
              <label className="form-label">Score</label>
              <input
                type="text"
                className="form-control"
                value={review.score || ""}
                readOnly
              />
            </div>
             {/*  */}
            <div className="mb-3">
              <label className="form-label">AI Feedback</label>
              <textarea
                className="form-control"
                value={review.ai_feedback || ""}
                readOnly
              />
            </div>
            {/* Question ID (linked to exam_submissions table) */}
            <div className="mb-3">
              <label className="form-label">Question ID</label>
              <input
                type="text"
                className="form-control"
                value={review.question_id || ""}
                readOnly
              />
            </div>
            {/* Submission ID (linked to exam_submissions table) */}
            <div className="mb-3">
              <label className="form-label">Submission ID</label>
              <input
                type="text"
                className="form-control"
                value={review.submission_id || ""}
                readOnly
              />
            </div>
             {/* Exam ID from entire exam submission */}
            <div className="mb-3">
              <label className="form-label">Exam ID</label>
              <input
                type="text"
                className="form-control"
                value={review.exam_id || ""}
                readOnly
              />
            </div>

            {/* Total score for the entire exam submission */}

            <div className="mb-3">
              <label className="form-label">Total Score</label>
              <input
                type="text"
                className="form-control"
                value={review.total_score ?? ""}
                readOnly
              />   
            </div>
              {/* Total time taken for exam */}
            <div className="mb-3">
              <label className="form-label">Time Taken (seconds)</label>
              <input
                type="text"
                className="form-control"
                value={review.time_taken ?? ""}
                readOnly
              />
            </div>

            {/* Focus loss count during exam */}

            <div className="mb-3">
              <label className="form-label">Focus Loss Count</label>
              <input
                type="text"
                className="form-control"
                value={review.focus_loss_count ?? ""}
                readOnly
              />
            </div>

            {/* Feedback summary for the entire exam submission */}

            <div className="mb-3">
              <label className="form-label">Feedback Summary</label>
              <textarea
                className="form-control"
                value={
                  typeof review.feedback_summary === "object"
                    ? JSON.stringify(review.feedback_summary, null, 2)
                    : review.feedback_summary || ""
                }
                rows={3}
                readOnly
              />
            </div>
          </form>
        ))
      )}
    </div>
  );
};

export default Review;
