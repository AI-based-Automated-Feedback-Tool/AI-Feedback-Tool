import React, { useMemo, useRef, useState, useEffect } from "react";
import { uploadImage } from "../Feedback/uploadImageService";
// import { submitChartAnswer } from "../Feedback/generateChartAnalysisService"; // ❌ not used in attach mode

export default function ChartUploadSection({
  question,
  userId,
  mode = "attach",          // "attach" (defer AI) or "immediate"
  onAttached,               // called when attachment is ready
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(""); // kept for "immediate" mode only
  const inputRef = useRef(null);

  const fmts = question?.allowed_formats || ["png", "jpg", "jpeg", "svg", "webp"];
  const maxMb = question?.max_file_size_mb ?? 5;
  const acceptAttr = useMemo(() => fmts.map(f => "." + f).join(","), [fmts]);

  function reset() {
    setFile(null);
    setPreview("");
    setAiFeedback("");
    if (inputRef.current) inputRef.current.value = "";
  }

  // ✅ reset when question changes (extra safety in addition to key)
  useEffect(() => { reset(); }, [question?.id]);

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

  async function onAttach() {
    if (!file) return;

    try {
      setBusy(true);

      // Option A (recommended): upload now, store URL (more reliable if page reloads)
      const { url, mime } = await uploadImage(file, fmts);
      onAttached?.({ imageUrl: url, imageMime: mime });

      // Option B (if you prefer): store File in memory and upload later
      // onAttached?.({ file });

      alert("Image attached for this question.");
      reset(); // optional; remove if you want to keep the preview
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to attach image");
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
              maxWidth: 280, maxHeight: 220, objectFit: "contain",
              border: "1px solid #ddd", borderRadius: 6,
            }}
          />
          <div className="d-flex flex-column gap-2">
            <button className="btn btn-secondary btn-sm" onClick={reset} disabled={busy}>
              Choose another
            </button>

            {/* Attach only (no AI yet) */}
            <button className="btn btn-success btn-sm" onClick={onAttach} disabled={busy}>
              {busy ? "Attaching..." : "Confirm & Attach"}
            </button>

            <small className="text-muted">
              Allowed: {fmts.join(", ")} • Max {maxMb}MB
            </small>
          </div>
        </div>
      )}

      {/* Only used if you switch to "immediate" mode; hidden in "attach" mode */}
      {mode === "immediate" && aiFeedback && (
        <div className="alert alert-info mt-3 mb-0" aria-live="polite">
          <strong>AI feedback:</strong>
          <div className="mt-1">{aiFeedback}</div>
        </div>
      )}
    </div>
  );
}
