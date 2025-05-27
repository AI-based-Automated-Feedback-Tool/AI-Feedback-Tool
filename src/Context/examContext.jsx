import React, { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { supabase } from "../SupabaseAuth/supabaseClient";

// Create a React context for managing exam data
export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {

   // Full list of exams for a course (with at least 1 MCQ)
  const [exams, setExams] = useState([]);

  // Exams that the current user has NOT submitted
  const [pendingExams, setPendingExams] = useState([]);

   // Exams that the user has submitted (based on submission table)
  const [completedExams, setCompletedExams] = useState([]);

  // Tracks loading state for async operations
  const [loading, setLoading] = useState(false);

   // Tracks any error messages
  const [error, setError] = useState(null);
  
   /**
   * Fetch all exams for a course, filter them based on
   * whether the current user has completed them.
   */
  const fetchExams = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;
      console.log(" Logged-in user ID:", userId);

      if (!userId) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      // 2. Fetch all exams and related questions
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*, mcq_questions!inner(exam_id)")
        .eq("course_id", courseId);

      if (examError || !examData) {
        console.error("Error fetching exams:", examError);
        setError("Failed to load exams.");
        setLoading(false);
        return;
      }

       // Filter to only exams that actually have MCQ questions
      const examsWithQuestions = examData.filter(
        (exam) => exam.mcq_questions.length > 0
      );
      console.log("📄 Exams with questions:", examsWithQuestions);

      // 3. Fetch user's submitted exam IDs
      const { data: submissions, error: submissionError } = await supabase
        .from("exam_submission")
        .select("exam_id")
        .eq("user_id", userId);

      if (submissionError) {
        console.error("Error fetching submissions:", submissionError);
        setError("Failed to load submissions.");
        setLoading(false);
        return;
      }

      console.log(" Submissions found:", submissions);

        // Extract completed exam IDs
      const completedExamIds = new Set(submissions.map((s) => s.exam_id));
      console.log("Completed exam IDs (Set):", [...completedExamIds]);

      // 4. Split exams into pending and completed (per user)
      const pending = examsWithQuestions.filter(
        (exam) => !completedExamIds.has(exam.exam_id)
      );
      const completed = examsWithQuestions.filter((exam) =>
        completedExamIds.has(exam.exam_id)
      );

      console.log(" Pending exams:", pending);
      console.log(" Completed exams:", completed);

      // 5. Set states
      setExams(examsWithQuestions);
      setPendingExams(pending);
      setCompletedExams(completed);
    } catch (err) {
      console.error(" Unexpected error in fetchExams:", err);
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

// Ensure children prop is passed correctly
ExamProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
