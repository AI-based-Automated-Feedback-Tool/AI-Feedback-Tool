import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import { downloadAsTextFile } from '../../utils/downloadTextUtils';
import { Button } from 'react-bootstrap';
import { ApiCallCountContext } from "../../Context/ApiCallCountContext";
import HeaderWithApiCount from '../../Components/TeachersComponents/HeaderWithApiCount';


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
  const { incrementCount } = useContext(ApiCallCountContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examTitle, setExamTitle] = useState('');
  const [feedback, setFeedback] = useState(null);

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
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    incrementCount(); // Increment API call count
    return data;
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generateFeedback = async () => {
      try {
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
  }, [examId, location.state]);

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" />
      <p>Generating AI feedback...</p>
    </div>
  );

  if (error) return (
    <Container className="mt-4">
      <Alert variant="danger">
        <strong>Error:</strong> {error}
      </Alert>
    </Container>
  );

  return (
    <Container className="mt-4">
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
                    aiProvider: location.state?.aiProvider || 'cohere'
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
          {feedback ? (
            <>
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
            </>
          ) : (
            <p>No feedback generated.</p>
          )}
        </Card.Body>
      </Card>

      <Alert variant="info">
        <i className="bi bi-robot"></i> Feedback generated using custom AI analysis.
      </Alert>
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
