// Same imports as before + add `useLocation` and defaultPrompts
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from '../../../SupabaseAuth/supabaseClient';

const defaultPrompts = [
  {
    label: 'Code Feedback',
    prompt: `You are a programming education AI assistant...
[QUESTIONS]
[SUBMISSIONS]
[ANSWERS]`
  }
];

const AIFeedbackPage_Code = () => {
  const { examId } = useParams();
  const location = useLocation();
  const [examTitle, setExamTitle] = useState("");
  const [feedbackPrompt, setFeedbackPrompt] = useState("");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const { data: exam, error: examError } = await supabase
          .from("exams")
          .select("title")
          .eq("exam_id", examId)
          .single();
        if (examError) throw examError;
        setExamTitle(exam.title);

        const { data: questions, error: questionError } = await supabase
          .from("code_questions")
          .select("question_id, question_description, function_signature, wrapper_code, test_cases, points")
          .eq("exam_id", examId);
        if (questionError) throw questionError;

        const questionIds = questions.map(q => q.question_id);

        const { data: submissions, error: answerError } = await supabase
          .from("code_submissions_answers")
          .select("student_answer, is_correct, score, question_id")
          .in("question_id", questionIds);
        if (answerError) throw answerError;

        const customPrompt = location.state?.prompt || defaultPrompts[0].prompt;

        const promptWithData = customPrompt
          .replace('[QUESTIONS]', JSON.stringify(questions))
          .replace('[SUBMISSIONS]', JSON.stringify(submissions));

        setFeedbackPrompt(promptWithData);
      } catch (error) {
        console.error("Error preparing prompt:", error.message);
      }
    };

    if (examId) fetchData();
  }, [examId, location.state]);

  return (
    <div className="p-4">
      <h2>AI Feedback – Code Questions</h2>
      <p>Exam: <strong>{examTitle}</strong></p>
      <pre className="text-sm mt-3 bg-gray-100 p-2 rounded">
        {feedbackPrompt.slice(0, 1000)}...
      </pre>
    </div>
  );
};

export default AIFeedbackPage_Code;
