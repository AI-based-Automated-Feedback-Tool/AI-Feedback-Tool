// AIFeedbackPage_Code.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from '../../../SupabaseAuth/supabaseClient';
import { ApiCallCountContext } from "../../context/ApiCallCountContext";

const defaultPrompts = [
  {
    label: 'Code Feedback',
    prompt: `You are a programming education AI assistant...
[QUESTIONS]
[SUBMISSIONS]`
  }
];

const AIFeedbackPage_Code = () => {
  const { examId } = useParams();
  const location = useLocation();
  const [examTitle, setExamTitle] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const hasFetched = useRef(false);

  const { apiCallCount, incrementApiCallCount, MAX_API_CALLS_PER_DAY } = useContext(ApiCallCountContext);

  const callAIAPI = async (promptWithData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptWithData,
        provider: location.state?.aiProvider || 'cohere'
      })
    });

    if (!response.ok) throw new Error('Failed to fetch AI feedback');

    const data = await response.json();
    return data;
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generateFeedback = async () => {
      try {
        if (apiCallCount >= MAX_API_CALLS_PER_DAY) {
          setShowLimitModal(true);
          return;
        }

        const { data: exam } = await supabase
          .from("exams")
          .select("title")
          .eq("exam_id", examId)
          .single();
        setExamTitle(exam.title);

        const { data: questions } = await supabase
          .from("code_questions")
          .select("question_id, question_description, function_signature, wrapper_code, test_cases, points")
          .eq("exam_id", examId);

        const questionIds = questions.map(q => q.question_id);

        const { data: submissions } = await supabase
          .from("code_submissions_answers")
          .select("student_answer, is_correct, score, question_id")
          .in("question_id", questionIds);

        const customPrompt = location.state?.prompt || defaultPrompts[0].prompt;

        const promptWithData = customPrompt
          .replace('[QUESTIONS]', JSON.stringify(questions))
          .replace('[SUBMISSIONS]', JSON.stringify(submissions));

        const aiResult = await callAIAPI(promptWithData);

        let parsed;
        try {
          parsed = JSON.parse(aiResult.result);
        } catch {
          parsed = { overallSummary: aiResult.result };
        }

        setFeedback(parsed);
        incrementApiCallCount();
      } catch (err) {
        console.error("AI Feedback error:", err.message);
      }
    };

    generateFeedback();
  }, [examId, location.state, apiCallCount, MAX_API_CALLS_PER_DAY, incrementApiCallCount]);

  return (
    <div className="p-4">
      <h2>AI Feedback – Code</h2>
      <p>Exam: <strong>{examTitle}</strong></p>

      {showLimitModal && (
        <div className="bg-red-100 text-red-800 p-4 rounded mt-4">
          You have reached the maximum number of feedback generations for today ({MAX_API_CALLS_PER_DAY}).
        </div>
      )}

      <div className="mt-4">
        <h4>AI Feedback:</h4>
        <pre className="bg-gray-100 p-3 rounded">
          {feedback ? JSON.stringify(feedback, null, 2) : "Generating..."}
        </pre>
      </div>
    </div>
  );
};

export default AIFeedbackPage_Code;
