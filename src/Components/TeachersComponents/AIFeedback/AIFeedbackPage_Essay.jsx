import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderWithApiCount from './HeaderWithApiCount';
import { supabase } from '../../../SupabaseAuth/supabaseClient';

const AIFeedbackPage_Essay = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [essayQuestion, setEssayQuestion] = useState(null);
  const [essaySubmission, setEssaySubmission] = useState(null);
  const [promptData, setPromptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchEssayData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch essay question by exam ID
        const { data: question, error: questionError } = await supabase
          .from('essay_questions')
          .select('*')
          .eq('exam_id', examId)
          .single();

        if (questionError) throw questionError;

        setEssayQuestion(question);

        // 2. Fetch student's essay submission for the question (optional: latest submission or based on user context)
        const { data: submission, error: submissionError } = await supabase
          .from('essay_submissions_answers')
          .select('*')
          .eq('question_id', question.question_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (submissionError && submissionError.code !== 'PGRST116') throw submissionError;

        setEssaySubmission(submission || null);

        // 3. Fetch stored AI prompt for essay type (if exists)
        const { data: prompt, error: promptError } = await supabase
          .from('prompts')
          .select('*')
          .eq('exam_id', examId)
          .eq('question_type', 'essay')
          .single();

        if (promptError && promptError.code !== 'PGRST116') throw promptError;

        setPromptData(prompt || null);

      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchEssayData();
  }, [examId]);

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
