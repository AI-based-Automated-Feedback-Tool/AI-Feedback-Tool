import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

//create context
const ResultContext = createContext();

//provider component
export const ResultProvider = ({ children, studentId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  //to fetch results whenever studentId changes
  useEffect(() => {
    if (!studentId) return;
    //fetch results from the Supabase databas
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

//custom hook for consuming context
export const useResults = () => useContext(ResultContext);
