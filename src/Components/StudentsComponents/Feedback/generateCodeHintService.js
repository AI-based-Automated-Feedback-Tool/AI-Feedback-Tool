// src/Components/Feedback/generateCodeHintService.js
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/** Request an AI hint for a coding question (no full solution). */
export async function generateCodeHint({
  examId,
  questionId,
  promptText,        // problem statement
  language,          // e.g., "javascript", "python"
  starterCode = "",
  studentCode = "",
  testCases = [],    // optional array (strings or objects)
  hintTier = "Nudge" // "Nudge" | "Scaffold" | "Targeted"
}) {
  const res = await fetch(`${API}/api/hints/code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      examId,
      questionId,
      promptText,
      language,
      starterCode,
      studentCode,
      testCases,
      hintTier,
    }),
  });

  if (!res.ok) {
    let msg = "Failed to get code hint";
    try { msg = (await res.json())?.error || msg; } catch {}
    throw new Error(msg);
  }

  const data = await res.json(); // { hintText, cooldownSeconds, remainingHints? }
  return {
    hintText: data?.hintText ?? "",
    cooldownSeconds: data?.cooldownSeconds ?? 0,
    remainingHints: data?.remainingHints ?? null,
  };
}
