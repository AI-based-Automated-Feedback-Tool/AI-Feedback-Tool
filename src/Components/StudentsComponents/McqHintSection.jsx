import React, { useState, useEffect } from "react";
import { generateMcqHint } from "./Feedback/generateMcqHintService";

export default function McqHintSection({ examId, question, selectedAnswer }) {
  const [tier, setTier] = useState(1);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  // Cooldown timer
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
      const res = await generateMcqHint({
        examId,
        questionId: question.id,
        questionText: question.question,
        choices: question.options,
        studentAnswer: selectedAnswer || "",
        hintTier: tier,
      });
      setHint(res.hintText);
      setCooldown(res.cooldownSeconds || 0);
    } catch (e) {
      setError(e.message || "Couldn't get a hint");
      setHint("Try focusing on the key concept and eliminate clearly wrong options.");
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

        {cooldown > 0 && (
          <small className="text-muted">Cooldown: {cooldown}s</small>
        )}
      </div>

      {error && <div className="text-danger small mt-2">{error}</div>}

      {hint && (
        <div className="alert alert-info mt-2 mb-0" role="status" aria-live="polite">
          {hint}
        </div>
      )}
    </div>
  );
}
