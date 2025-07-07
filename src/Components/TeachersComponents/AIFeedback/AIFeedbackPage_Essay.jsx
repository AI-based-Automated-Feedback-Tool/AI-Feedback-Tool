import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Modal, Button } from 'react-bootstrap';
import { supabase } from '../../../SupabaseAuth/supabaseClient';
import { downloadAsTextFile } from '../../../utils/downloadTextUtils';
import { ApiCallCountContext } from "../../../Context/ApiCallCountContext";
import HeaderWithApiCount from './HeaderWithApiCount';

const defaultPrompts = [
  {
    label: 'Essay Feedback',
    prompt: `You are an educational AI assistant providing feedback on essay-based exams.
Evaluate the following essay questions, student answers, and grading guidelines.
Generate a comprehensive feedback summary including overall performance, strengths, weaknesses, and actionable recommendations.

[QUESTIONS]
[ANSWERS]
[GUIDELINES]`
  }
];

const AIFeedbackPage_Essay = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { incrementCount, count, MAX_CALLS_PER_DAY } = useContext(ApiCallCountContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examTitle, setExamTitle] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const hasFetched = useRef(false);

  const fetchExamMetadata = async () => {
    const { data, error } = await supabase
      .from('exams')
      .select('title, ai_assessment_guide')
      .eq('exam_id', examId)
      .single();

    if (error) throw new Error('Failed to fetch exam metadata');
    return {
      title: data?.title || 'Unknown Exam',
      guide: data?.ai_assessment_guide || ''
    };
  };

  const fetchEssayQuestions = async () => {
    const { data, error } = await supabase
      .from('essay_questions')
      .select('question_id, question_text, points')
      .eq('exam_id', examId);

    if (error) throw new Error('Failed to fetch essay questions');
    return data;
  };

  const fetchEssayAnswers = async (questions) => {
    const questionIds = questions.map(q => q.question_id);

    const { data, error } = await supabase
      .from('essay_exam_submissions_answers')
      .select('student_answer, score, question_id')
      .in('question_id', questionIds);

    if (error) throw new Error('Failed to fetch essay submissions');
    return data;
  };

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

    if (!response.ok) {
      let errorMsg = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMsg = `API error: ${errorData.error}`;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    incrementCount();
    return data;
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generateFeedback = async () => {
      try {
        if (count >= MAX_CALLS_PER_DAY) {
          setShowLimitModal(true);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const customPrompt = location.state?.prompt || defaultPrompts[0].prompt;

        const { title, guide } = await fetchExamMetadata();
        setExamTitle(title);

        const questions = await fetchEssayQuestions();
        const answers = await fetchEssayAnswers(questions);

        const promptWithData = customPrompt
          .replace('[QUESTIONS]', JSON.stringify(questions))
          .replace('[ANSWERS]', JSON.stringify(answers))
          .replace('[GUIDELINES]', guide);

        const data = await callAIAPI(promptWithData);

        let parsedFeedback;
        try {
          parsedFeedback = JSON.parse(data.result);
        } catch {
          parsedFeedback = {
            overallSummary: data.result,
            keyStrengths: [],
            mostMissedQuestions: [],
            teachingSuggestions: [],
            nextSteps: []
          };
        }

        setFeedback(parsedFeedback);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    generateFeedback();
  }, [examId, location.state, count, MAX_CALLS_PER_DAY]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Generating AI feedback...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">AI-Generated Feedback for Essay Exam</h4>
            <span className="small">Exam ID: {examId}</span>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="light"
                size="sm"
              onClick={() => navigate(`/teacher/exams/${examId}/prompt-selector`, {
                state: { questionType: 'essay' }
              })}
              >
                🔄 Modify Prompt
              </Button>
              <HeaderWithApiCount />
            </div>
          </Card.Header>

          <Card.Body>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading essay question, submission, and prompt...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              <strong>Error:</strong> {error}
            </Alert>
          ) : (
            <>
              <h5>Essay Question:</h5>
              <p>{essayQuestion?.question_description || 'No question found.'}</p>

              <h6>Student Answer:</h6>
              <p>{essaySubmission?.student_answer || 'No student submission found.'}</p>

              <h6>AI Feedback:</h6>
              <p>{essaySubmission?.ai_feedback || 'AI feedback not generated yet.'}</p>

              <h6>Prompt Used:</h6>
              <p>{promptData?.prompt_text || 'No prompt selected for this exam.'}</p>

              {aiError && (
                <Alert variant="danger" className="mt-3">
                  <strong>Error:</strong> {aiError}
                </Alert>
              )}

              <div className="mt-3 d-flex justify-content-start gap-2">
                <Button
                  variant="primary"
                  disabled={aiLoading || !essaySubmission || !promptData}
                  onClick={callAIForEssayFeedback}
                >
                  {aiLoading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Generating Feedback...
                    </>
                  ) : (
                    '✨ Generate AI Feedback'
                  )}
                </Button>
              </div>
            </>
            )}
          </Card.Body>
        </Card>
    </Container>
  );
};

export default AIFeedbackPage_Essay;
