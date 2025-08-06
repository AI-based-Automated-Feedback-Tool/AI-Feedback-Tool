import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

// Create context
const ResultContext = createContext();

// Provider component
export const ResultProvider = ({ children, studentId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch results on studentId change
  useEffect(() => {
    if (!studentId) return;

    const fetchResults = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("exam_submissions")
        .select("*")
        .eq("student_id", studentId)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error fetching results:", error);
      } else {
        setResults(data);
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

// Custom hook for consuming context
export const useResults = () => useContext(ResultContext);
