import React, { useContext } from "react";
import { ReviewContext } from "../../Context/reviewContext";

const Review = () => {
  //get review data by destructuring
  const { reviewData, loading } = useContext(ReviewContext);

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
    {reviewData.length === 0 ? (
      <div className="alert alert-warning text-center" role="alert">
        No reviews available.
      </div>
    ) : (
      <div>
        {reviewData.map((review, index) => (
          <form key={review.id || review.exam_id || index} className="border p-4 mb-4 rounded shadow-sm">
            <div className="mb-3">
              <label className="form-label">ID</label>
              <input type="text" className="form-control" value={review.id || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Score</label>
              <input type="text" className="form-control" value={review.score || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">AI Feedback</label>
              <textarea className="form-control" value={review.ai_feedback || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Question ID</label>
              <input type="text" className="form-control" value={review.question_id || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Submission ID</label>
              <input type="text" className="form-control" value={review.submission_id || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Exam ID</label>
              <input type="text" className="form-control" value={review.exam_id || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Total Score</label>
              <input type="text" className="form-control" value={review.total_score || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Time Taken</label>
              <input type="text" className="form-control" value={review.time_take || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Focus Loss Count</label>
              <input type="text" className="form-control" value={review.focus_loss_count || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Feedback Summary</label>
              <textarea className="form-control" value={review.feedback_summery || ""} readOnly />
            </div>
          </form>
        ))}
      </div>
    )}
  </div>
);
};



export default Review;
