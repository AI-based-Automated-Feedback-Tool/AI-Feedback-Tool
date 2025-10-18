import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Modal, Button } from 'react-bootstrap';
import { supabase } from '../../../SupabaseAuth/supabaseClient';
import { downloadAsTextFile } from '../../../utils/downloadTextUtils';
import { ApiCallCountContext } from "../../../Context/ApiCallCountContext";
import HeaderWithApiCount from './HeaderWithApiCount';
import '../../../css/pages/AIFeedbackPage.css';

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

// Helper function to convert camelCase keys to readable titles with icons
const getDynamicSectionTitle = (key) => {
  // Define icon mapping for common concepts (essay-specific)
  const iconMap = {
    'easy': '✅',
    'difficult': '⚠️',
    'focus': '🎯',
    'teaching': '💡',
    'guidance': '🧭',
    'areas': '📍',
    'questions': '❓',
    'time': '⏱️',
    'management': '⏰',
    'performance': '📊',
    'analysis': '🔍',
    'patterns': '📈',
    'strategies': '💭',
    'recommendations': '🚀',
    'insights': '💎',
    'suggestions': '💡',
    'next': '➡️',
    'steps': '🚀',
    'improvement': '⬆️',
    'strengths': '💪',
    'weaknesses': '🔴',
    'missed': '❌',
    'correct': '✔️',
    'essay': '📝',
    'writing': '✍️',
    'content': '📜',
    'structure': '🏢',
    'grammar': '📚',
    'style': '🎨',
    'argument': '💬',
    'evidence': '🔍',
    'critical': '🧠',
    'thinking': '🧠',
    'creativity': '🎨',
    'clarity': '🔎',
    'coherence': '🔗',
    'organization': '🗂'
  };

  // Convert camelCase to space-separated words
  const words = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(' ');
  
  // Capitalize first letter of each word
  const title = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // Find appropriate icon based on keywords
  let icon = '📝'; // default icon for essays
  for (const [keyword, emoji] of Object.entries(iconMap)) {
    if (words.some(word => word.includes(keyword))) {
      icon = emoji;
      break;
    }
  }
  
  return `${icon} ${title}`;
};

// Helper function to check if feedback has dynamic sections
const hasDynamicSections = (feedback) => {
  const standardKeys = ['overallSummary', 'keyStrengths', 'mostMissedQuestions', 'teachingSuggestions', 'nextSteps'];
  return Object.keys(feedback).some(key => !standardKeys.includes(key) && feedback[key] && 
    (Array.isArray(feedback[key]) ? feedback[key].length > 0 : true));
};

// Helper function to check if a key is a standard static prompt key
const isStandardKey = (key) => {
  const standardKeys = ['overallSummary', 'keyStrengths', 'mostMissedQuestions', 'teachingSuggestions', 'nextSteps'];
  return standardKeys.includes(key);
};

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

  if (loading) {
    return (
      <div className="feedback-loading-container">
        <div className="feedback-loading-spinner"></div>
        <div className="feedback-loading-text">Generating Essay Analysis</div>
        <div className="feedback-loading-subtext">
          📝 Analyzing essay submissions and creating detailed writing feedback...
        </div>
      </div>
    );
  }

  return (
    <div className="ai-feedback-page">
      {/* Hero Section */}
      <div className="feedback-hero-section">
        <Container>
          <div className="feedback-hero-content">
            <h1 className="feedback-hero-title">
              📝 Essay Writing Insights
            </h1>
            <p className="feedback-hero-subtitle">
              Advanced writing assessment and comprehensive feedback for enhanced learning
            </p>
            {examTitle && (
              <div className="feedback-exam-badge">
                ✍️ {examTitle}
              </div>
            )}
          </div>
        </Container>
      </div>

      <div className="feedback-content-container">
        <Container>
          {/* Modal for API limit reached */}
          <Modal 
            show={showLimitModal} 
            onHide={() => navigate('/teacher')} 
            centered
            className="feedback-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>⚠️ Daily Limit Reached</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-3">You've reached your daily limit of feedback generations.</p>
              <p className="mb-0">Please try again tomorrow. This limit helps us keep things running smoothly for everyone 😊</p>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="primary" 
                onClick={() => navigate('/teacher')}
                className="btn-primary"
              >
                Back to Dashboard
              </Button>
            </Modal.Footer>
          </Modal>

          {error && !showLimitModal && (
            <Alert className="feedback-error-alert">
              <strong>⚠️ Error:</strong> {error}
            </Alert>
          )}

          {feedback && !showLimitModal && (
            <Card className="feedback-main-card">
              <Card.Header className="feedback-card-header">
                <div className="feedback-header-content">
                  <div className="feedback-header-title">
                    📝 AI-Generated Essay Assessment
                  </div>
                  <div className="feedback-header-subtitle">
                    Comprehensive writing analysis and improvement recommendations
                  </div>
                  
                  <div className="feedback-actions">
                    <Button
                      variant="light"
                      size="sm"
                      className="feedback-action-btn"
                      onClick={() =>
                        navigate(`/teacher/exams/${examId}/prompt-selector`, {
                          state: {
                            prompt: location.state?.prompt || '',
                            aiProvider: location.state?.aiProvider || 'cohere',
                            questionType: 'essay'
                          }
                        })
                      }
                    >
                      🔄 Modify Prompt
                    </Button>
                    
                    <Button 
                      variant="light" 
                      size="sm" 
                      className="feedback-action-btn"
                      onClick={() => downloadAsTextFile(feedback)}
                    >
                      📄 Download Report
                    </Button>
                    
                    <HeaderWithApiCount />
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body className="feedback-card-body">
                {feedback.overallSummary && (
                  <Section title="📊 Overall Summary" text={feedback.overallSummary} />
                )}
                {feedback.keyStrengths?.length > 0 && (
                  <Section title="✅ Key Strengths" items={feedback.keyStrengths} />
                )}
                
                {/* Check if we have dynamic sections (non-standard keys) */}
                {hasDynamicSections(feedback) ? (
                  /* Render dynamic sections */
                  Object.keys(feedback).map(key => {
                    // Skip the standard sections we've already rendered
                    if (['overallSummary', 'keyStrengths'].includes(key)) return null;
                    
                    // Skip standard static keys (they should not appear in dynamic prompts)
                    if (isStandardKey(key)) return null;
                    
                    // Skip empty arrays or undefined values
                    if (!feedback[key] || (Array.isArray(feedback[key]) && feedback[key].length === 0)) return null;
                    
                    // Convert camelCase keys back to readable titles with appropriate icons
                    const title = getDynamicSectionTitle(key);
                    
                    return (
                      <Section 
                        key={key}
                        title={title} 
                        items={Array.isArray(feedback[key]) ? feedback[key] : []}
                        text={typeof feedback[key] === 'string' ? feedback[key] : ''}
                      />
                    );
                  })
                ) : (
                  /* Render standard static prompt sections */
                  <>
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
                )}
              </Card.Body>
            </Card>
          )}

          {!showLimitModal && (
            <Alert className="feedback-info-alert">
              <div className="feedback-robot-icon">🤖</div>
              <div>
                <strong>Essay Analysis Complete</strong><br />
                Writing feedback generated using advanced AI analysis for comprehensive assessment.
              </div>
            </Alert>
          )}
        </Container>
      </div>
    </div>
  );
};

const Section = ({ title, items = [], text = '' }) => (
  <div className="feedback-section">
    <h5 className="feedback-section-title">{title}</h5>
    <div className="feedback-section-content">
      {items.length > 0 ? (
        <ul className="feedback-section-list">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{text}</p>
      )}
    </div>
  </div>
);

export default AIFeedbackPage_Essay;  
