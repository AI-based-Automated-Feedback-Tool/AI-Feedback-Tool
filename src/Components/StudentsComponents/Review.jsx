import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReview } from "../../Context/ReviewContext";

const Review = () => {
  const { submissionId } = useParams();
  const { reviewData, fetchReviewData, loading, error } = useReview();

  useEffect(() => {
    if (submissionId) fetchReviewData(submissionId);
  }, [fetchReviewData, submissionId]);

  if (loading) return <p>Loading review...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!reviewData) return <p>No review data found.</p>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Exam Review</h2>

      <button
        onClick={() => fetchReviewData(submissionId)}
        disabled={loading}
        className={`${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded mb-4`}
      >
        {loading ? "Refreshing..." : "Refresh AI Feedback"}
      </button>

      {reviewData.map((entry, index) => {
        const isMcq = !!entry.mcq_questions;
        const isCode = !!entry.code_questions;

        if (isMcq) {
          const q = entry.mcq_questions;
          return (
            <div key={entry.id || entry.question_id} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">
                {index + 1}. {q.question_text}
              </h3>

              <ul className="my-2 space-y-1">
                {q.options?.map((opt, i) => (
                  <li
                    key={i}
                    className={`list-group-item ${
                      entry.student_answer?.includes?.(opt)
                        ? entry.is_correct
                          ? "list-group-item-success"
                          : "list-group-item-danger"
                        : ""
                    }`}
                  >
                    {opt}
                    {q.answers?.includes?.(opt) && (
                      <span className="badge bg-success ms-2">(Correct)</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-2 space-y-1">
                <p><strong>Your Answer:</strong> {entry.student_answer?.join?.(", ") || entry.selected_option}</p>
                <p><strong>Correct:</strong> {entry.is_correct ? "Yes" : "No"}</p>
                <p><strong>Score:</strong> {entry.score}</p>
                <p><strong>AI Feedback:</strong> {entry.ai_feedback || "Pending AI feedback generation"}</p>
              </div>
            </div>
          );
        }

        if (isCode) {
          const q = entry.code_questions;
          return (
            <div key={entry.id || entry.question_id} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">Code Question {index + 1}</h3>
              <p><strong>Question:</strong> {q?.question_description || ""}</p>

              {q?.function_signature && (
                <>
                  <p className="mt-2"><strong>Function Signature:</strong></p>
                  <pre className="bg-light p-2 rounded"><code>{q.function_signature}</code></pre>
                </>
              )}

              <p className="mt-2"><strong>Your Code:</strong></p>
              <pre className="bg-light p-2 rounded"><code>{entry.student_answer}</code></pre>

              <div className="mt-2 space-y-1">
                <p><strong>Score:</strong> {entry.score} / {q?.points ?? 0}</p>
                <p><strong>Passed All Tests:</strong> {entry.is_correct ? "Yes ✅" : "No ❌"}</p>
                <p className="mt-2"><strong>AI Feedback:</strong></p>
                <pre className="bg-light p-2 rounded whitespace-pre-wrap">
                  {entry.ai_feedback || "Pending AI feedback generation"}
                </pre>
              </div>
            </div>
          );
        }

        // Fallback (essay or unknown)
        const parsedAnswer =
          typeof entry.student_answer === "string"
            ? (() => { try { return JSON.parse(entry.student_answer); } catch { return { text: entry.student_answer }; } })()
            : entry.student_answer;

        return (
          <div key={entry.id || index} className="p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold">Essay {index + 1}</h3>
            <p><strong>Student Answer:</strong> {parsedAnswer?.text || "No answer submitted"}</p>
            <p><strong>AI Feedback:</strong> {entry.ai_feedback?.comment || "Pending AI feedback"}</p>
            <p><strong>Correct:</strong> {entry.is_correct ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Score:</strong> {entry.score}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Review;
