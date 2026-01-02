import React, { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { supabase } from "../SupabaseAuth/supabaseClient";

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([]);
  const [pendingExams, setPendingExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // map: exam_id -> submission_id
  const [submissionIds, setSubmissionIds] = useState({});

  const fetchExams = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;
      console.log("✅ Logged-in user ID:", userId);

      if (!userId) {
        setError("User not authenticated.");
        return;
      }

      // Fetch all items (exams + assignments) for a course
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*, mcq_questions(*), code_questions(*)")
        .eq("course_id", courseId);

      if (examError || !examData) {
        console.error("Error fetching exams:", examError);
        setError("Failed to load exams/assignments.");
        return;
      }

      // Keep only valid items based on type
      const validItems = examData.filter((item) => {
        if (item.type === "mcq") return (item.mcq_questions?.length || 0) > 0;
        if (item.type === "code") return (item.code_questions?.length || 0) > 0;
        if (item.type === "essay") return true;
        return false;
      });

      console.log("📄 Valid exams/assignments:", validItems);

      // Fetch submissions for this student
      const { data: submissions, error: submissionError } = await supabase
        .from("exam_submissions")
        .select("exam_id, id")
        .eq("student_id", userId);

      if (submissionError) {
        console.error("Error fetching submissions:", submissionError);
        setError("Failed to load submissions.");
        return;
      }

      // Build completed set + mapping
      const completedIds = new Set(submissions.map((s) => s.exam_id));

      const examIdToSubmissionId = {};
      submissions.forEach((s) => {
        examIdToSubmissionId[s.exam_id] = s.id;
      });
      setSubmissionIds(examIdToSubmissionId);

      // Split items into pending and completed
      const pending = validItems.filter((item) => !completedIds.has(item.exam_id));
      const completed = validItems.filter((item) => completedIds.has(item.exam_id));

      setExams(validItems);
      setPendingExams(pending);
      setCompletedExams(completed);
    } catch (err) {
      console.error("Unexpected error in fetchExams:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ExamContext.Provider
      value={{
        exams,
        pendingExams,
        completedExams,
        fetchExams,
        loading,
        error,
        submissionIds,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

ExamProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
