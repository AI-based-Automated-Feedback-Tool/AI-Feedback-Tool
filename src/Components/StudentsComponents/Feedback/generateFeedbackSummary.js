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

    // Extract plain feedback text
    const extractPlain = (entries) =>
      entries
        .map((entry) =>
          typeof entry.ai_feedback === "object"
            ? JSON.stringify(entry.ai_feedback)
            : entry.ai_feedback
        )
        .filter(Boolean)
        .join("\n\n");

    const mcqFeedback = extractPlain(mcq || []);
    const essayFeedback = extractPlain(essay || []);
    const codeFeedback = extractPlain(code || []);

    // 4. Update exam_submissions.feedback_summary
    const { error: updateError } = await supabase
      .from("exam_submissions")
      .update({
        feedback_summary: {
          mcq: mcqFeedback || null,
          essay: essayFeedback || null,
          code: codeFeedback || null,
        },
      })
      .eq("id", submissionId);

    if (updateError) throw updateError;

    console.log(`Feedback summary saved for ${submissionId}`);
  } catch (err) {
    console.error(" Error generating feedback summary:", err.message);
  }
};
