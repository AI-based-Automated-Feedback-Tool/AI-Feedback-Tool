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
  const [customPrompt, setCustomPrompt] = useState("");
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

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(feedback, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${examTitle || 'exam'}_code_feedback.txt`;
    a.click();
    URL.revokeObjectURL(url);
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

        const selectedPrompt = location.state?.prompt || defaultPrompts[0].prompt;

        const promptWithData = selectedPrompt
          .replace('[QUESTIONS]', JSON.stringify(questions))
          .replace('[SUBMISSIONS]', JSON.stringify(submissions));

        setCustomPrompt(promptWithData);

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
      <h2 className="text-xl font-semibold mb-2">AI Feedback – Code Questions</h2>
      <p className="mb-4">Exam: <strong>{examTitle}</strong></p>

      {showLimitModal && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          You have reached the maximum number of feedback generations for today ({MAX_API_CALLS_PER_DAY}).
        </div>
      )}

      {feedback && (
        <>
          {feedback.overallSummary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Overall Summary</h3>
              <p className="bg-gray-50 p-3 rounded whitespace-pre-wrap">{feedback.overallSummary}</p>
            </div>
          )}

          {feedback.studentFeedback && Array.isArray(feedback.studentFeedback) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Student Feedback</h3>
              <ul className="list-disc pl-5">
                {feedback.studentFeedback.map((fb, i) => (
                  <li key={i} className="mb-2">{fb}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleDownload}
            >
              Download Feedback (.txt)
            </button>

            <div className="text-sm text-gray-600 mt-2">
              API Usage: {apiCallCount}/{MAX_API_CALLS_PER_DAY}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIFeedbackPage_Code;
