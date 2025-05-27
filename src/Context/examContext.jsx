import React, { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { supabase } from "../SupabaseAuth/supabaseClient";

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  //to store list of exams
  const [exams, setExams] = useState([]);
  //to track loading
  const [loading, setLoading] = useState(false);
  //to store error
  const [error, setError] = useState(null);

  //to fetch exams based on course id
  const fetchExams = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      //fetch exam and related mcq questions
      const { data, error } = await supabase
        .from("exams")
        .select("*, mcq_questions!inner(exam_id)")
        .eq("course_id", courseId);

      if (error) {
        console.error("Error loading exams:", error);
        setError("Failed to load exams.");
      } else {
        const examsWithQuestions = data.filter(
          (exam) => exam.mcq_questions.length > 0
        );
        //update exam state
        setExams(examsWithQuestions);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);
  //filter exam to get only pending exam
  const pendingExams = exams.filter((e) => !e.completed);
  //filter exam to get completed exam
  const completedExams = exams.filter((e) => e.completed);

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

//define prop type for examprovider component
ExamProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
