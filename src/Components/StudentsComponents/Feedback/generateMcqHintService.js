/**
 * Ask backend for an AI-generated *hint* for an MCQ (no answer leakage).
 * Uses same-origin /api path via Vite proxy.
 */
export async function generateMcqHint({
  examId,
  questionId,
  questionText,
  choices,
  studentAnswer = "",
  hintTier = 1,
}) {
  const res = await fetch("/api/hints/mcq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      examId,
      questionId,
      questionText,
      choices,
      studentAnswer,
      hintTier,
    }),
  });

  if (!res.ok) {
    let msg = "Failed to get hint";
    try {
      msg = (await res.json())?.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  const data = await res.json(); // { hintText, cooldownSeconds, remainingHints }
  return {
    hintText: data?.hintText ?? "",
    cooldownSeconds: data?.cooldownSeconds ?? 0,
    remainingHints: data?.remainingHints ?? null,
  };
}
