// src/Components/StudentsComponents/Review.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReview } from "../../Context/ReviewContext";

/* ---------- tiny helpers (render-proof) ---------- */

const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    // Allow arrays to show as joined lines instead of [..]
    if (Array.isArray(v)) return v.map((x) => safeText(x)).join("\n");
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

const normalizeEssayAnswer = (raw) => {
  if (!raw) return null;

  // If DB stored JSON as a string, parse it:
  if (typeof raw === "string") {
    try {
      return normalizeEssayAnswer(JSON.parse(raw));
    } catch {
      return { type: "text", text: raw };
    }
  }

  // Already an object
  if (typeof raw === "object") {
    const { type, text, imageUrl, imageMime, file } = raw;

    if (type === "text" || type === "chart" || type === "both") {
      return {
        type,
        text: text ?? "",
        imageUrl: imageUrl ?? "",
        imageMime: imageMime ?? "",
        file: file ?? null,
      };
    }

    // Heuristics for older shapes
    if (raw.imageUrl && raw.text)
      return { type: "both", text: raw.text, imageUrl: raw.imageUrl, imageMime: raw.imageMime ?? "" };
    if (raw.imageUrl) return { type: "chart", text: "", imageUrl: raw.imageUrl, imageMime: raw.imageMime ?? "" };
    if (raw.text) return { type: "text", text: raw.text };
  }
  return null;
};

const renderEssayAnswer = (n) => {
  if (!n) return <em>Not answered</em>;

  if (n.type === "text") {
    return <span>{safeText(n.text) || "No text provided"}</span>;
  }

  if (n.type === "chart") {
    return n.imageUrl ? (
      <img
        src={n.imageUrl}
        alt="Uploaded diagram"
        style={{
          maxWidth: 320,
          maxHeight: 240,
          objectFit: "contain",
          border: "1px solid #ddd",
          borderRadius: 6,
        }}
      />
    ) : (
      <em>No image attached</em>
    );
  }

  if (n.type === "both") {
    return (
      <>
        {n.text ? <p className="mb-2">{safeText(n.text)}</p> : null}
        {n.imageUrl ? (
          <img
            src={n.imageUrl}
            alt="Uploaded diagram"
            style={{
              maxWidth: 320,
              maxHeight: 240,
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          />
        ) : (
          <em>No image attached</em>
        )}
      </>
    );
  }

  return <em>Not answered</em>;
};

/* ------------------------------------------------ */

const Review = () => {
  const { submissionId } = useParams();
  const { reviewData, fetchReviewData, loading, error } = useReview();

  useEffect(() => {
    if (submissionId) fetchReviewData(submissionId);
  }, [fetchReviewData, submissionId]);

  if (loading && !reviewData) return <p>Loading review...</p>;
  if (error) return <p className="text-red-500">Error: {safeText(error)}</p>;
  if (!reviewData || reviewData.length === 0) return <p>No review data found.</p>;

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
        try {
          const isMcq = !!entry.mcq_questions;
          const isCode = !!entry.code_questions;

          /* ---------------- MCQ ---------------- */
          if (isMcq) {
            const q = entry.mcq_questions || {};
            const options = Array.isArray(q.options) ? q.options : [];
            const correctAnswers = Array.isArray(q.answers) ? q.answers : [];
            const studentAns = Array.isArray(entry.student_answer)
              ? entry.student_answer
              : [entry.student_answer].filter(Boolean);

            return (
              <div key={entry.id || entry.question_id || `mcq-${index}`} className="p-4 border rounded-lg shadow">
                <h3 className="text-lg font-semibold">
                  {index + 1}. {q.question_text || "MCQ Question"}
                </h3>

                <ul className="my-2 space-y-1">
                  {options.map((opt, i) => {
                    const picked = studentAns.includes(opt);
                    const correct = correctAnswers.includes(opt);
                    const cls = picked ? (entry.is_correct ? "list-group-item-success" : "list-group-item-danger") : "";
                    return (
                      <li key={i} className={`list-group-item ${cls}`}>
                        {opt}
                        {correct && <span className="badge bg-success ms-2">(Correct)</span>}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Your Answer:</strong> {studentAns.length ? studentAns.join(", ") : "—"}
                  </p>
                  <p>
                    <strong>Correct:</strong> {entry.is_correct ? "Yes ✅" : "No ❌"}
                  </p>
                  <p>
                    <strong>Score:</strong> {safeText(entry.score)}
                  </p>
                  <p>
                    <strong>AI Feedback:</strong>{" "}
                    {entry.ai_feedback ? safeText(entry.ai_feedback) : "Pending AI feedback generation"}
                  </p>
                </div>
              </div>
            );
          }

          /* ---------------- CODE ---------------- */
          if (isCode) {
            const q = entry.code_questions || {};
            return (
              <div key={entry.id || entry.question_id || `code-${index}`} className="p-4 border rounded-lg shadow">
                <h3 className="text-lg font-semibold">Code Question {index + 1}</h3>

                {/* Show question prompt if available */}
                {(q.question_description || q.prompt || q.title) && (
                  <p>
                    <strong>Question:</strong>{" "}
                    {safeText(q.question_description || q.prompt || q.title)}
                  </p>
                )}

                {q.function_signature ? (
                  <>
                    <p className="mt-2">
                      <strong>Function Signature:</strong>
                    </p>
                    <pre className="bg-light p-2 rounded">
                      <code>{safeText(q.function_signature)}</code>
                    </pre>
                  </>
                ) : null}

                <p className="mt-2">
                  <strong>Your Code:</strong>
                </p>
                <pre className="bg-light p-2 rounded whitespace-pre-wrap">
                  <code>{safeText(entry.student_answer)}</code>
                </pre>

                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Score:</strong> {safeText(entry.score)} / {safeText(q.points ?? 0)}
                  </p>
                  <p>
                    <strong>Passed All Tests:</strong> {entry.is_correct ? "Yes ✅" : "No ❌"}
                  </p>
                  <p className="mt-2">
                    <strong>AI Feedback:</strong>
                  </p>
                  <pre className="bg-light p-2 rounded whitespace-pre-wrap">
                    {entry.ai_feedback ? safeText(entry.ai_feedback) : "Pending AI feedback generation"}
                  </pre>
                </div>
              </div>
            );
          }

          /* ---------------- ESSAY (text / chart / both) ---------------- */
          const normalized = normalizeEssayAnswer(entry.student_answer);

          // Try to show the essay question prompt if the API returns it
          const essayQ =
            entry.essay_questions ||
            entry.question ||
            entry.question_text ||
            entry.prompt ||
            null;

          return (
            <div key={entry.id || entry.question_id || `essay-${index}`} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">Essay {index + 1}</h3>

              {essayQ ? (
                <p className="mt-1">
                  <strong>Question:</strong>{" "}
                  {safeText(
                    essayQ.question_text ||
                      essayQ.prompt ||
                      essayQ.title ||
                      essayQ
                  )}
                </p>
              ) : null}

              <div className="mt-3">
                <strong>Student Answer:</strong>
                <div className="mt-2">{renderEssayAnswer(normalized)}</div>
              </div>

              <div className="mt-3">
                <strong>AI Feedback:</strong>
                <div className="mt-1 whitespace-pre-wrap">
                  {entry.ai_feedback?.comment
                    ? safeText(entry.ai_feedback.comment)
                    : entry.ai_feedback
                    ? safeText(entry.ai_feedback)
                    : "Pending AI feedback"}
                </div>
              </div>

              <p className="mt-3">
                <strong>Correct:</strong> {entry.is_correct ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>Score:</strong> {safeText(entry.score)}
              </p>
            </div>
          );
        } catch (e) {
          // Never crash the page if a single entry is malformed
          console.error("Render error at index", index, entry, e);
          return (
            <div key={`bad-${index}`} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">Couldn’t render this item</h3>
              <pre className="bg-light p-2 rounded whitespace-pre-wrap">{safeText(entry)}</pre>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Review;
