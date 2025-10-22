import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReview } from "../../Context/ReviewContext";

/** ---------- Hardening helpers ---------- **/

// Always return a string that React can render
function safeText(v) {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

// Normalize essay answers (they can be plain strings or structured objects)
function normalizeEssayAnswer(raw) {
  if (!raw) return null;

  if (typeof raw === "string") {
    // Try JSON parse; otherwise treat as legacy plain text
    try {
      return normalizeEssayAnswer(JSON.parse(raw));
    } catch {
      return { type: "text", text: raw };
    }
  }

  if (typeof raw === "object") {
    const { type, text, imageUrl, imageMime } = raw;
    if (type === "text" || type === "chart" || type === "both") {
      return { type, text: text ?? "", imageUrl: imageUrl ?? "", imageMime: imageMime ?? "" };
    }
    // Best-effort guess
    if (raw.imageUrl && raw.text) return { type: "both", text: raw.text, imageUrl: raw.imageUrl, imageMime: raw.imageMime ?? "" };
    if (raw.imageUrl) return { type: "chart", text: "", imageUrl: raw.imageUrl, imageMime: raw.imageMime ?? "" };
    if (raw.text) return { type: "text", text: raw.text };
  }

  return null;
}

function renderEssayAnswer(normalized) {
  if (!normalized) return <em>Not answered</em>;

  const { type, text, imageUrl } = normalized;

  if (type === "text") {
    return <span>{safeText(text) || "No text provided"}</span>;
  }

  if (type === "chart") {
    return imageUrl ? (
      <img
        src={imageUrl}
        alt="Uploaded diagram"
        style={{ maxWidth: 320, maxHeight: 240, objectFit: "contain", border: "1px solid #ddd", borderRadius: 6 }}
      />
    ) : (
      <em>No image attached</em>
    );
  }

  if (type === "both") {
    return (
      <>
        {text ? <p className="mb-2">{safeText(text)}</p> : null}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded diagram"
            style={{ maxWidth: 320, maxHeight: 240, objectFit: "contain", border: "1px solid #ddd", borderRadius: 6 }}
          />
        ) : (
          <em>No image attached</em>
        )}
      </>
    );
  }

  return <em>Not answered</em>;
}

function renderAIFeedback(raw) {
  if (!raw) return "Pending AI feedback";
  if (typeof raw === "string") return raw;
  if (raw.comment) return safeText(raw.comment);
  return safeText(raw);
}

/** ---------- Component ---------- **/

const Review = () => {
  const { submissionId } = useParams();
  const { reviewData, fetchReviewData, loading, error } = useReview();

  useEffect(() => {
    if (submissionId) fetchReviewData(submissionId);
  }, [fetchReviewData, submissionId]);

  if (loading && !reviewData) return <p>Loading review...</p>;
  if (error) return <p className="text-red-500">Error: {safeText(error)}</p>;
  if (!Array.isArray(reviewData) || reviewData.length === 0) return <p>No review data found.</p>;

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
        const isMcq = !!entry?.mcq_questions;
        const isCode = !!entry?.code_questions;

        /** ---------- MCQ ---------- **/
        if (isMcq) {
          const q = entry.mcq_questions ?? {};
          const opts = Array.isArray(q.options) ? q.options : [];
          const corrects = Array.isArray(q.answers) ? q.answers : [];

          const studentAns = Array.isArray(entry.student_answer)
            ? entry.student_answer
            : entry.student_answer != null
            ? [entry.student_answer]
            : [];

          return (
            <div key={entry.id || entry.question_id || `mcq-${index}`} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">
                {index + 1}. {safeText(q.question_text ?? "Question")}
              </h3>

              <ul className="my-2 space-y-1">
                {opts.map((opt, i) => {
                  const selected = studentAns.includes(opt);
                  const correct = corrects.includes(opt);
                  const rowClass = selected ? (entry.is_correct ? "list-group-item-success" : "list-group-item-danger") : "";
                  return (
                    <li key={i} className={`list-group-item ${rowClass}`}>
                      {safeText(opt)}
                      {correct && <span className="badge bg-success ms-2">(Correct)</span>}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 space-y-1">
                <p>
                  <strong>Your Answer:</strong>{" "}
                  {studentAns.length ? safeText(studentAns.join(", ")) : "Not answered"}
                </p>
                <p><strong>Correct:</strong> {entry.is_correct ? "Yes" : "No"}</p>
                <p><strong>Score:</strong> {safeText(entry.score)}</p>
                <p><strong>AI Feedback:</strong> {renderAIFeedback(entry.ai_feedback)}</p>
              </div>
            </div>
          );
        }

        /** ---------- CODE ---------- **/
        if (isCode) {
          const q = entry.code_questions ?? {};
          return (
            <div key={entry.id || entry.question_id || `code-${index}`} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">Code Question {index + 1}</h3>
              <p><strong>Question:</strong> {safeText(q.question_description || "")}</p>

              {q.function_signature ? (
                <>
                  <p className="mt-2"><strong>Function Signature:</strong></p>
                  <pre className="bg-light p-2 rounded"><code>{safeText(q.function_signature)}</code></pre>
                </>
              ) : null}

              <p className="mt-2"><strong>Your Code:</strong></p>
              <pre className="bg-light p-2 rounded whitespace-pre-wrap">
                <code>{safeText(entry.student_answer)}</code>
              </pre>

              <div className="mt-2 space-y-1">
                <p><strong>Score:</strong> {safeText(entry.score)} / {safeText(q.points ?? 0)}</p>
                <p><strong>Passed All Tests:</strong> {entry.is_correct ? "Yes ✅" : "No ❌"}</p>
                <p className="mt-2"><strong>AI Feedback:</strong></p>
                <pre className="bg-light p-2 rounded whitespace-pre-wrap">
                  {renderAIFeedback(entry.ai_feedback)}
                </pre>
              </div>
            </div>
          );
        }

        /** ---------- ESSAY (text / chart / both / legacy string) ---------- **/
        const normalized = normalizeEssayAnswer(entry.student_answer);

        return (
          <div key={entry.id || entry.question_id || `essay-${index}`} className="p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold">Essay {index + 1}</h3>

            <div className="mt-2">
              <strong>Student Answer:</strong>
              <div className="mt-2">{renderEssayAnswer(normalized)}</div>
            </div>

            <div className="mt-2">
              <strong>AI Feedback:</strong>
              <div className="mt-1 whitespace-pre-wrap">{renderAIFeedback(entry.ai_feedback)}</div>
            </div>

            <p className="mt-2"><strong>Correct:</strong> {entry.is_correct ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Score:</strong> {safeText(entry.score)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Review;
