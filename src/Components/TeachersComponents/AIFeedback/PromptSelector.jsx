import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import HeaderWithApiCount from './HeaderWithApiCount';
import StandardAnalysis from './Prompts/StandardAnalysis';
import QuickInsights from './Prompts/QuickInsights';
import DetailedReport from './Prompts/DetailedReport';
import CustomPrompt from './Prompts/CustomPrompt';
import CodeErrorAnalysis from './Prompts/CodeErrorAnalysis';
import CodeOptimizationTips from './Prompts/CodeOptimizationTips';
import CodeStyleReview from './Prompts/CodeStyleReview';
import CodeCustomPrompt from './Prompts/CodeCustomPrompt';
import EssayContentPrompt from './Prompts/EssayContentPrompt';
import EssayGeneralPrompt from './Prompts/EssayGeneralPrompt';
import EssayCustomPrompt from './Prompts/EssayCustomPrompt';
import EssayTechnicalPrompt from './Prompts/EssayTechnicalPrompt';
import { ApiCallCountContext } from '../../../Context/ApiCallCountContext';


const MCQpredefinedPrompts = [
  StandardAnalysis,
  QuickInsights,
  DetailedReport,
  CustomPrompt,
];

const codePredefinedPrompts = [
  CodeErrorAnalysis,
  CodeOptimizationTips,
  CodeStyleReview,
  CodeCustomPrompt,
];

const essayPredefinedPrompts = [
  EssayContentPrompt,
  EssayGeneralPrompt,
  EssayCustomPrompt,
  EssayTechnicalPrompt,
];

const aiProviders = [
  { id: 'cohere', name: 'Cohere AI', model: 'command' },
  { id: 'openrouter', name: 'OpenRouter AI', model: 'openrouter-chat' }
];

const PromptSelector = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [questionTypes, setQuestionTypes] = useState(() => {
    const qt = location.state?.questionTypes || location.state?.questionType;
    return Array.isArray(qt) ? qt : qt ? [qt] : [];
  });

  const [promptsList, setPromptsList] = useState(() => {
    if (questionTypes.includes('code')) return codePredefinedPrompts;
    if (questionTypes.includes('essay')) return essayPredefinedPrompts;
    return MCQpredefinedPrompts;
  });

  const [selectedPrompt, setSelectedPrompt] = useState(promptsList[0]?.prompt || '');
  const [selectedLabel, setSelectedLabel] = useState(promptsList[0]?.label || '');

  useEffect(() => {
    const qt = location.state?.questionTypes || location.state?.questionType;
    const types = Array.isArray(qt) ? qt : qt ? [qt] : [];
    setQuestionTypes(types);

    let newPrompts = MCQpredefinedPrompts;
    if (types.includes('code')) newPrompts = codePredefinedPrompts;
    else if (types.includes('essay')) newPrompts = essayPredefinedPrompts;

    setPromptsList(newPrompts);
    setSelectedPrompt(newPrompts[0]?.prompt || '');
    setSelectedLabel(newPrompts[0]?.label || '');
  }, [location.state]);

  const [selectedProvider, setSelectedProvider] = useState(aiProviders[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const { count, MAX_CALLS_PER_DAY } = useContext(ApiCallCountContext);
  const isLimitReached = count >= MAX_CALLS_PER_DAY;

  const handleSubmit = () => {
  if (isLimitReached) return;

  const finalPrompt = isCustomPrompt ? customPrompt : selectedPrompt;

  // Check question type and route accordingly
  if (questionTypes.includes('code')) {
    navigate(`/teacher/exams/${examId}/ai-feedback-code`, {
      state: {
        prompt: finalPrompt,
        aiProvider: selectedProvider,
        questionTypes,
      },
    });
  } else if (questionTypes.includes('essay')) {
    navigate(`/teacher/exams/${examId}/ai-feedback-essay`, {
      state: {
        prompt: finalPrompt,
        aiProvider: selectedProvider,
        questionTypes,
      },
    });
  } else {
    // default to MCQ feedback
    navigate(`/teacher/exams/${examId}/ai-feedback`, {
      state: {
        prompt: finalPrompt,
        aiProvider: selectedProvider,
        questionTypes,
      },
    });
  }
};



  const handlePromptChange = (label) => {
    if (label === 'Custom Prompt') {
      setIsCustomPrompt(true);
      const promptObj = promptsList.find((p) => p.label === label);
      if (promptObj) setCustomPrompt(promptObj.prompt);
    } else {
      setIsCustomPrompt(false);
      const promptObj = promptsList.find((p) => p.label === label);
      if (promptObj) {
        setSelectedPrompt(promptObj.prompt);
        setSelectedLabel(label);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">AI Feedback Generator</h4>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              size="sm"
              onClick={handleDynamicPromptGeneration}
            >
              🤖 Dynamic Prompt Generation
            </Button>
            <HeaderWithApiCount />
          </div>
        </Card.Header>
        <Card.Body>
          {isLimitReached && (
            <Alert variant="danger" className="text-center">
              You have reached your daily API usage limit ({MAX_CALLS_PER_DAY} calls).
            </Alert>
          )}

          <Alert variant="info" className="text-center">
            This exam contains: <strong>{questionTypes.join(', ').toUpperCase()}</strong> questions.
          </Alert>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>AI Feedback Provider</Form.Label>
                <Form.Select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
                  {aiProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Feedback Style</Form.Label>
                <Form.Select value={selectedLabel} onChange={(e) => handlePromptChange(e.target.value)}>
                  {promptsList.map((p, idx) => (
                    <option key={idx} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Prompt {isCustomPrompt ? 'Editor' : 'Preview'}</Form.Label>
            {isCustomPrompt ? (
              <Form.Control
                as="textarea"
                rows={10}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="font-monospace"
              />
            ) : (
              <Card body className="bg-light">
                <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedPrompt}</pre>
              </Card>
            )}
            {isCustomPrompt && (
              <Form.Text className="text-muted">
                Tip: Use [QUESTIONS], [SUBMISSIONS], and [ANSWERS] placeholders to reference exam data
              </Form.Text>
            )}
          </Form.Group>

          <div className="d-grid">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={(isCustomPrompt && !customPrompt.trim()) || isLimitReached}
            >
              Generate Feedback
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PromptSelector;
