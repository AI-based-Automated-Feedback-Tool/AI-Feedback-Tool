import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';

// Default prompt templates for AI feedback generation
const defaultPrompts = [
    {
        label: 'Standard Feedback',
        prompt: `You are an educational AI assistant...` // Default prompt template
    }
];

const AIFeedbackPage = () => {
    // State management for component
    const { examId } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [examTitle, setExamTitle] = useState('');
    const [feedback, setFeedback] = useState(null);
    const hasFetched = useRef(false); // Prevents duplicate API calls

    // Main effect for generating feedback
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const generateFeedback = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get prompt from location state or use default
                const customPrompt = location.state?.prompt || defaultPrompts[0].prompt;

                // Fetch exam title from database
                const { data: examData, error: examError } = await supabase
                    .from('exams')
                    .select('title')
                    .eq('exam_id', examId)
                    .single();

                if (examError) throw new Error('Failed to fetch exam title');
                setExamTitle(examData?.title || 'Unknown Exam');

                // Fetch all questions for this exam
                const { data: questions, error: questionsError } = await supabase
                    .from('mcq_questions')
                    .select('*')
                    .eq('exam_id', examId);

                if (questionsError) throw new Error('Failed to fetch questions');

                // Fetch all submissions for this exam
                const { data: submissions, error: submissionsError } = await supabase
                    .from('exam_submissions')
                    .select('*')
                    .eq('exam_id', examId);

                if (submissionsError) throw new Error('Failed to fetch submissions');

                // Get submission IDs to fetch corresponding answers
                const submissionIds = submissions.map(sub => sub.id);

                // Fetch all answers for these submissions
                const { data: answers, error: answersError } = await supabase
                    .from('exam_submissions_answers')
                    .select('*')
                    .in('submission_id', submissionIds);

                if (answersError) throw new Error('Failed to fetch submission answers');

                // Replace placeholders in prompt with actual data
                const promptWithData = customPrompt
                    .replace('[QUESTIONS]', JSON.stringify(questions))
                    .replace('[SUBMISSIONS]', JSON.stringify(submissions))
                    .replace('[ANSWERS]', JSON.stringify(answers));

                // Call AI API to generate feedback
                const response = await fetch('http://localhost:5000/api/cohere/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: promptWithData })
                });

                if (!response.ok) throw new Error('AI API call failed');

                // Process API response
                const data = await response.json();
                let parsedFeedback;

                try {
                    parsedFeedback = JSON.parse(data.result);
                } catch {
                    // Fallback for non-JSON responses
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

    // Loading state UI
    if (loading) return (
        <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Generating AI feedback...</p>
        </div>
    );

    // Error state UI
    if (error) return (
        <Container className="mt-4">
            <Alert variant="danger">
                <strong>Error:</strong> {error}
            </Alert>
        </Container>
    );

    // Main component render
    return (
        <Container className="mt-4">
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white">
                    <h4>AI-Generated Teaching Feedback</h4>
                    <span className="small">Exam Name: {examTitle}</span>
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