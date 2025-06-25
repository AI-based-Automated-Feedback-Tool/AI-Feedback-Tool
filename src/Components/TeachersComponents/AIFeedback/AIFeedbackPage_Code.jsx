// AIFeedbackPage_Code.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '../../../SupabaseAuth/supabaseClient';

const AIFeedbackPage_Code = () => {
  const { examId } = useParams();
  const [examTitle, setExamTitle] = useState("");
  const [codeData, setCodeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get exam title
        const { data: exam, error: examError } = await supabase
          .from("exams")
          .select("title")
          .eq("exam_id", examId)
          .single();
        if (examError) throw examError;
        setExamTitle(exam.title);

        // 2. Get code questions for this exam
        const { data: questions, error: questionError } = await supabase
          .from("code_questions")
          .select("*")
          .eq("exam_id", examId);
        if (questionError) throw questionError;

        const questionIds = questions.map(q => q.id);

        // 3. Get student answers for those questions
        const { data: answers, error: answerError } = await supabase
          .from("code_submissions_answers")
          .select("*")
          .in("question_id", questionIds);
        if (answerError) throw answerError;

        // 4. Merge questions with answers
        const merged = answers.map(answer => {
          const question = questions.find(q => q.id === answer.question_id);
          return {
            ...answer,
            question_description: question?.question_description || "",
            function_signature: question?.function_signature || "",
            wrapper_code: question?.wrapper_code || "",
            test_cases: question?.test_cases || "",
            points: question?.points || 0,
          };
        });

        setCodeData(merged);
        console.log("Merged Code Data:", merged);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (examId) fetchData();
  }, [examId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">AI Feedback – Code Questions</h2>
      <p className="mb-6">Exam: <strong>{examTitle}</strong></p>
      <p>Fetched <strong>{codeData.length}</strong> code answers from the database.</p>
    </div>
  );
};

export default AIFeedbackPage_Code;
