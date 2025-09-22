import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { supabase } from '../../../SupabaseAuth/supabaseClient';
import { downloadAsTextFile } from '../../../utils/downloadTextUtils';
import { Button } from 'react-bootstrap';
import { ApiCallCountContext } from "../../../Context/ApiCallCountContext";
import HeaderWithApiCount from './HeaderWithApiCount';


// Default prompt templates for AI feedback generation
const defaultPrompts = [
  {
    label: 'Standard Feedback',
    prompt: `You are an educational AI assistant...`
  }
];

const AIFeedbackPage = () => {
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

  // Fetch exam title from Supabase
  const fetchExamTitle = async () => {
    const { data, error } = await supabase
      .from('exams')
      .select('title')
      .eq('exam_id', examId)
      .single();

    if (error) throw new Error('Failed to fetch exam title');
    return data?.title || 'Unknown Exam';
  };

  // Fetch exam questions
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('mcq_questions')
      .select('question_id, question_text, options, answers')
      .eq('exam_id', examId);

    if (error) throw new Error('Failed to fetch questions');
    return data;
  };

  // Fetch exam submissions
  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('exam_submissions')
      .select('student_id, exam_id, total_score, time_taken, id')
      .eq('exam_id', examId);

    if (error) throw new Error('Failed to fetch submissions');
    return data;
  };

  // Fetch submission answers by submission IDs
  const fetchAnswers = async (submissionIds) => {
    if (submissionIds.length === 0) return [];
    const { data, error } = await supabase
      .from('exam_submissions_answers')
      .select('student_answer, is_correct, score, question_id')
      .in('submission_id', submissionIds);


    if (error) throw new Error('Failed to fetch submission answers');
    return data;
  };

  // Call AI API to generate feedback
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
      } catch { }
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

        // Fetch necessary data
        const title = await fetchExamTitle();
        setExamTitle(title);

        const questions = await fetchQuestions();
        const submissions = await fetchSubmissions();
        const submissionIds = submissions.map((sub) => sub.id);
        const answers = await fetchAnswers(submissionIds);

        // Replace placeholders in prompt
        const promptWithData = customPrompt
          .replace('[QUESTIONS]', JSON.stringify(questions))
          .replace('[SUBMISSIONS]', JSON.stringify(submissions))
          .replace('[ANSWERS]', JSON.stringify(answers));

        // Call AI API
        const data = await callAIAPI(promptWithData);

        // Parse feedback
        let parsedFeedback;
        try {
          // Clean result to remove markdown code fences if present
          let cleanResult = data.result
            .replace(/```json\s*/g, '')  // remove ```json
            .replace(/```/g, '')         // remove closing ```
            .trim();

          parsedFeedback = JSON.parse(cleanResult);
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

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" />
      <p>Generating AI feedback...</p>
    </div>
  );

  return (
    <Container className="mt-4">
      {/* Modal for API limit reached */}
      <Modal show={showLimitModal} onHide={() => navigate('/teacher/dashboard')} centered>
        <Modal.Header closeButton>
          <Modal.Title>Daily Limit Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You've reached your daily limit of feedback generations.</p>
          <p>Please try again tomorrow. This limit helps us keep things running smoothly for everyone 😊</p>
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
              <h4 className="mb-0">AI-Generated Teaching Feedback</h4>
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
                      questionType: 'mcq'
                    }
                  })
                }
              >
                🔄 Modify Prompt
              </Button>

              <Button
                variant="light"
                size="sm"
                onClick={() => downloadAsTextFile(feedback)}
              >
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

// Reusable section component for displaying feedback categories
const Section = ({ title, items = [], text = '' }) => (
  <div className="mb-4">
    <h5 className="text-secondary">{title}</h5>
    {items.length > 0 ? (
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p>{text}</p>
    )}
  </div>
);

export default AIFeedbackPage;
