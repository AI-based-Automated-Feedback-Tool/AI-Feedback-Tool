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

     let pollingInterval; 
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
        //  Check if any submission has pending feedback
      const hasPending = data.some((r) =>
        JSON.stringify(r.feedback_summary || "").includes("Pending AI feedback")
      );

      //  If there is pending feedback, poll every 5 seconds
      if (hasPending) {
        if (!pollingInterval) {
          pollingInterval = setInterval(fetchResults, 5000);
        }
      } else {
        //  Stop polling once all feedback is ready
        clearInterval(pollingInterval);
      }
    }
    setLoading(false);
  };


    fetchResults();
    //  Clear interval when component unmounts or studentId changes
  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
  }, [studentId]);

  return (
    <ResultContext.Provider value={{ results, loading }}>
      {children}
    </ResultContext.Provider>
  );
};

//custom hook for consuming context
export const useResults = () => useContext(ResultContext);
