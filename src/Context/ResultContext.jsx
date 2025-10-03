import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const ResultContext = createContext();

export const ResultProvider = ({ children, studentId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchResults = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("exam_submissions")
        .select(
          "id, exam_id, submitted_at, total_score, score_percent, time_taken, focus_loss_count, feedback_summary"
        )
        .eq("student_id", studentId)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error fetching results:", error);
        setResults([]);
      } else {
        const normalized = (data || []).map((r) => {
          // feedback_summary can be jsonb or string; normalize to an object with keys
          let fb = r.feedback_summary;
          if (typeof fb === "string") {
            try {
              fb = JSON.parse(fb);
            } catch {
              // treat plain strings as a one-line summary
              fb = fb ? { summary: fb } : null;
            }
          }

          // produce a short one-line summary for easy rendering
          const summaryText =
            fb?.summary ??
            fb?.mcq ??
            fb?.essay ??
            fb?.code ??
            "AI feedback is being generated…";

          const hasPercent =
            r.score_percent !== null &&
            r.score_percent !== undefined &&
            !Number.isNaN(r.score_percent);

          return {
            id: r.id,
            exam_id: r.exam_id,
            submitted_at: r.submitted_at,
            total_score: r.total_score,     // raw correct (kept if you need it elsewhere)
            score_percent: hasPercent ? Number(r.score_percent) : null,
            time_taken: r.time_taken,       // seconds
            focus_loss_count: r.focus_loss_count,
            feedback_obj: fb,               // full object (mcq/essay/code/summary)
            feedback_summary_text: summaryText,
            is_legacy: !hasPercent,         // no percent stored (old submissions)
          };
        });

        setResults(normalized);
      }

      setLoading(false);
    };

    fetchResults();
  }, [studentId]);

  return (
    <ResultContext.Provider value={{ results, loading }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResults = () => useContext(ResultContext);
