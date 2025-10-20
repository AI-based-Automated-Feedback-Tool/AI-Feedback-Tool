// src/Components/CodeHintSection.jsx
import React, { useEffect, useState } from "react";
import { generateCodeHint } from "./Feedback/generateCodeHintService";

export default function CodeHintSection({
  examId,
  question,     // { id, prompt|question, language, starterCode, testCases?[] }
  value,        // student's current code (optional; if given, we won’t show our own textarea)
  onChange,     // setter for student's code (optional)
}) {
  const [tier, setTier] = useState(1);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [localCode, setLocalCode] = useState("");

  const code = value ?? localCode;
  const setCode = onChange ?? setLocalCode;

  const tierLabels = { 1: "Nudge", 2: "Scaffold", 3: "Targeted" };

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function onGetHint() {
    setLoading(true);
    setError("");
    setHint("");

    try {
      const res = await generateCodeHint({
        examId,
        questionId: question.id,
        promptText: question.prompt ?? question.question ?? "",
        language: question.language || "javascript",
        starterCode: question.starterCode || "",
        studentCode: code || "",
        testCases: question.testCases || [],
        hintTier: tierLabels[tier],
      });
      setHint(res.hintText);
      setCooldown(res.cooldownSeconds || 0);
    } catch (e) {
      setError(e.message || "Couldn't get a hint");
      setHint("Add small logs and trace values around the suspected lines; compare expected vs actual for one failing case.");
      setCooldown(10);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 border-top pt-3">
      <div className="d-flex gap-2 align-items-center flex-wrap">
        <label className="fw-semibold mb-0">Hint tier</label>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 140 }}
          value={tier}
          onChange={(e) => setTier(Number(e.target.value))}
          disabled={loading || cooldown > 0}
        >
          <option value={1}>Nudge</option>
          <option value={2}>Scaffold</option>
          <option value={3}>Targeted</option>
        </select>

        <button
          className="btn btn-info btn-sm"
          onClick={onGetHint}
          disabled={loading || cooldown > 0}
        >
          {loading ? "Getting hint..." : "Get Hint"}
        </button>

        {cooldown > 0 && <small className="text-muted">Cooldown: {cooldown}s</small>}
      </div>

      {/* Only render local textarea if parent didn't pass controlled editor */}
      {onChange == null && (
        <div className="mt-2">
          <label className="form-label">Your code</label>
          <textarea
            className="form-control"
            rows={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}

      {error && <div className="text-danger small mt-2">{error}</div>}
      {hint && (
        <div className="alert alert-info mt-2 mb-0" role="status" aria-live="polite">
          {hint}
        </div>
      )}
    </div>
  );
}
