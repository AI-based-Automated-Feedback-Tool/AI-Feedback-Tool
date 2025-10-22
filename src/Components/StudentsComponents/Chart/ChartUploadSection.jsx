// src/Components/StudentsComponents/Chart/ChartUploadSection.jsx
import React, { useMemo, useRef, useState } from "react";
import { uploadImage } from "../Feedback/uploadImageService";
import { submitChartAnswer } from "../Feedback/generateChartAnalysisService";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function ChartUploadSection({
  question,   // { id, question_text|question_description, allowed_formats?, max_file_size_mb? }
  userId,
  onSubmitted, // optional callback({ ai_feedback })
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const [aiFeedback, setAiFeedback] = useState("");

  const fmts = question?.allowed_formats || ["png", "jpg", "jpeg", "svg", "webp"];
  const maxMb = question?.max_file_size_mb ?? 5;
  const acceptAttr = useMemo(() => fmts.map((f) => "." + f).join(","), [fmts]);

  function reset() {
    setFile(null);
    setPreview("");
    setAiFeedback("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > maxMb * 1024 * 1024) {
      alert(`File too large. Max ${maxMb} MB`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onConfirmSubmit() {
    if (!file) return;
    try {
      setBusy(true);

      // 1) Upload the image (to your backend upload route)
      const { url, mime } = await uploadImage(file, fmts);

      // 2) Submit as answer + trigger AI analysis
      const data = await submitChartAnswer({
        questionId: question.id || question.question_id,
        userId,
        imageUrl: url,
        imageMime: mime,
        questionText:
          question.question_text ||
          question.question_description ||
          "",
      });

      const feedback = data?.ai_feedback || "";
      setAiFeedback(feedback);
      onSubmitted?.(data);
      alert("Uploaded and submitted successfully.");
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to submit image answer");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3">
      <p className="mb-2"><strong>Upload your diagram/photo</strong></p>
      <input
        ref={inputRef}
        type="file"
        className="form-control"
        accept={acceptAttr}
        onChange={onPick}
        disabled={busy}
      />

      {preview && (
        <div className="mt-3 d-flex gap-3 align-items-start">
          <img
            src={preview}
            alt="diagram preview"
            style={{
              maxWidth: 280,
              maxHeight: 220,
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          />
          <div className="d-flex flex-column gap-2">
            <button
              className="btn btn-secondary btn-sm"
              onClick={reset}
              disabled={busy}
            >
              Choose another
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={onConfirmSubmit}
              disabled={busy}
            >
              {busy ? "Submitting..." : "Confirm & Submit"}
            </button>
            <small className="text-muted">
              Allowed: {fmts.join(", ")} • Max {maxMb}MB
            </small>
          </div>
        </div>
      )}

      {aiFeedback && (
        <div className="alert alert-info mt-3 mb-0" aria-live="polite">
          <strong>AI feedback:</strong>
          <div className="mt-1">{aiFeedback}</div>
        </div>
      )}
    </div>
  );
}
