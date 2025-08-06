import { supabase } from "../../../SupabaseAuth/supabaseClient";

export const generateFeedbackSummary = async (submissionId) => {
  try {
    // 1. Fetch MCQ feedback
    const { data: mcq } = await supabase
      .from("exam_submissions_answers")
      .select("ai_feedback")
      .eq("submission_id", submissionId);

    // 2. Fetch Essay feedback
    const { data: essay } = await supabase
      .from("essay_exam_submissions_answers")
      .select("ai_feedback")
      .eq("submission_id", submissionId);

    // 3. Fetch Code feedback
    const { data: code } = await supabase
      .from("code_submissions_answers")
      .select("ai_feedback")
      .eq("submission_id", submissionId);

    // 4. Helper to extract feedback strings
    const extractFeedback = (entries, label) =>
      entries
        .map((entry) =>
          typeof entry.ai_feedback === "object"
            ? JSON.stringify(entry.ai_feedback)
            : entry.ai_feedback
        )
        .filter(Boolean)
        .map((fb) => `🔹 ${label}: ${fb}`);

    const allFeedbacks = [
      ...extractFeedback(mcq || [], "MCQ Feedback"),
      ...extractFeedback(essay || [], "Essay Feedback"),
      ...extractFeedback(code || [], "Code Feedback"),
    ];

    const summary = allFeedbacks.length
      ? allFeedbacks.join("\n\n")
      : "No AI feedback generated yet.";

    // 5. Update exam_submissions.feedback_summary
    const { error: updateError } = await supabase
      .from("exam_submissions")
      .update({ feedback_summary: summary })
      .eq("id", submissionId);

    if (updateError) throw updateError;

    console.log(`✅ Feedback summary saved for ${submissionId}`);
  } catch (err) {
    console.error("❌ Error generating feedback summary:", err.message);
  }
};
