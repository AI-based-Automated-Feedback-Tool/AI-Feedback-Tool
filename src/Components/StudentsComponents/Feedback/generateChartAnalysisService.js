// src/Components/StudentsComponents/Feedback/generateChartAnalysisService.js
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Submit a chart/diagram answer for a question and run AI analysis.
 * Backend responds with { ok: true, ai_feedback }
 */
export async function submitChartAnswer({
  questionId,
  userId,
  imageUrl,
  imageMime,
  questionText,
}) {
  const res = await fetch(`${API}/api/chart-tasks/${questionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      imageUrl,
      imageMime,
      questionText, // optional; backend can fetch from DB
    }),
  });

  if (!res.ok) {
    let msg = "Submit failed";
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}
