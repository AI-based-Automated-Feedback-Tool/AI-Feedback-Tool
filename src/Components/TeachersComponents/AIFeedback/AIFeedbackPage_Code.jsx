import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Modal, Button } from 'react-bootstrap';
import { supabase } from '../../../SupabaseAuth/supabaseClient';
import { downloadAsTextFile } from '../../../utils/downloadTextUtils';
import { ApiCallCountContext } from "../../../Context/ApiCallCountContext";
import HeaderWithApiCount from './HeaderWithApiCount';

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

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('code_questions')
      .select('question_id, question_description, function_signature, wrapper_code, test_cases, points')
      .eq('exam_id', examId);

    if (error) throw new Error('Failed to fetch code questions');
    return data;
  };

  const fetchSubmissions = async (questions) => {
    const questionIds = questions.map(q => q.question_id);

    const { data, error } = await supabase
      .from('code_submissions_answers')
      .select('student_answer, is_correct, score, question_id')
      .in('question_id', questionIds);

    if (error) throw new Error('Failed to fetch code submissions');
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

        const questions = await fetchQuestions();
        const submissions = await fetchSubmissions(questions);

        const promptWithData = customPrompt
          .replace('[QUESTIONS]', JSON.stringify(questions))
          .replace('[SUBMISSIONS]', JSON.stringify(submissions))
          .replace('[ANSWERS]', '') 
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
      <Modal show={showLimitModal} onHide={() => navigate('/teacher/dashboard')} centered>
        <Modal.Header closeButton>
          <Modal.Title>Daily Limit Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You've reached your daily limit of feedback generations.</p>
          <p>Please try again tomorrow.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate('/teacher/dashboard')}>
            Back to Dashboard
          </Button>
        </Modal.Footer>
      </Modal>

      {error && !showLimitModal && (
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {feedback && !showLimitModal && (
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">AI-Generated Feedback for Code Exam</h4>
              <span className="small">Exam Name: {examTitle}</span>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="light"
                size="sm"
                onClick={() =>
                  navigate(`/teacher/exams/${examId}/prompt-selector`, {
                    state: {
                      prompt: location.state?.prompt || '',
                      aiProvider: location.state?.aiProvider || 'cohere',
                      questionType: 'code'
                    }
                  })
                }
              >
                🔄 Modify Prompt
              </Button>
              <Button variant="light" size="sm" onClick={() => downloadAsTextFile(feedback)}>
                📄 Download .TXT
              </Button>
              <HeaderWithApiCount />
            </div>
          </Card.Header>
          <Card.Body>
            {feedback.overallSummary && (
              <Section title="📊 Overall Summary" text={feedback.overallSummary} />
            )}
            {feedback.keyStrengths?.length > 0 && (
              <Section title="✅ Key Strengths" items={feedback.keyStrengths} />
            )}
            {feedback.mostMissedQuestions?.length > 0 && (
              <Section title="⚠️ Most Missed Questions" items={feedback.mostMissedQuestions} />
            )}
            {feedback.teachingSuggestions?.length > 0 && (
              <Section title="💡 Teaching Suggestions" items={feedback.teachingSuggestions} />
            )}
            {feedback.nextSteps?.length > 0 && (
              <Section title="🚀 Actionable Next Steps" items={feedback.nextSteps} />
            )}
          </Card.Body>
        </Card>
      )}

      {!showLimitModal && (
        <Alert variant="info">
          <i className="bi bi-robot"></i> Feedback generated using custom AI analysis.
        </Alert>
      )}
    </Container>
  );
};

const Section = ({ title, items = [], text = '' }) => (
  <div className="mb-4">
    <h5 className="text-secondary">{title}</h5>
    {items.length > 0 ? (
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    ) : (
      <p>{text}</p>
    )}
  </div>
);

export default AIFeedbackPage_Code;
