import React, { useContext } from "react";
import { ReviewContext } from "../../Context/reviewContext";

const Review = () => {
  //get review data by destructuring
  const { reviewData, loading } = useContext(ReviewContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Student Review</h1>
      {reviewData.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Exam ID</th>
              <th>Total Score</th>
              <th>Time Taken</th>
              <th>Focus Loss Count</th>
              <th>Feedback Summary</th>
            </tr>
          </thead>
          <tbody>
            {reviewData.map((review, index) => (
              <tr key={review.id || review.exam_id || index}>
                <td>{review.exam_id}</td>
                <td>{review.total_score}</td>
                <td>{review.time_taken}</td>
                <td>{review.focus_loss_count}</td>
                <td>{review.feedback_summery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Review;
