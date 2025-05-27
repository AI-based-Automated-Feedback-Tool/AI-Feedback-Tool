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

  const fetchExams = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      // 2. Fetch all exams and related questions
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*, mcq_questions!inner(exam_id)")
        .eq("course_id", courseId);

      if (examError || !examData) {
        setError("Failed to load exams.");
        setLoading(false);
        return;
      }

      const examsWithQuestions = examData.filter(
        (exam) => exam.mcq_questions.length > 0
      );

      // 3. Fetch user's submitted exam IDs
      const { data: submissions, error: submissionError } = await supabase
        .from("exam_submission")
        .select("exam_id")
        .eq("user_id", userId);

      if (submissionError) {
        setError("Failed to load submissions.");
        setLoading(false);
        return;
      }

      const completedExamIds = new Set(submissions.map((s) => s.exam_id));

      // 4. Split exams into pending and completed (per user)
      const pending = examsWithQuestions.filter(
        (exam) => !completedExamIds.has(exam.exam_id)
      );
      const completed = examsWithQuestions.filter((exam) =>
        completedExamIds.has(exam.exam_id)
      );

      // 5. Set states
      setExams(examsWithQuestions);
      setPendingExams(pending);
      setCompletedExams(completed);
    } catch (err) {
      console.error("Unexpected error:", err);
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
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

// Prop validation
ExamProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
