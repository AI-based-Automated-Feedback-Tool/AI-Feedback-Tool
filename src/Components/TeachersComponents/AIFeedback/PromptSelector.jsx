import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert, Modal, Spinner } from 'react-bootstrap';
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
import { supabase } from '../../../SupabaseAuth/supabaseClient';
import DynamicPromptService from './services/DynamicPromptService.jsx';


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

const dynamicPromptOptions = [
  {
    id: 'easy-questions-analysis',
    label: 'Easy Questions Performance Analysis',
    description: 'Analyze questions that students consistently answer correctly to understand their strengths and mastered concepts'
  },
  {
    id: 'difficult-questions-insights',
    label: 'Difficult Questions Insights',
    description: 'Identify questions with low success rates to highlight learning gaps and common misconceptions'
  },
  {
    id: 'teaching-focus-recommendations',
    label: 'Teaching Focus Recommendations',
    description: 'Provide specific recommendations for curriculum emphasis and areas to focus on in future lessons'
  },
  {
    id: 'performance-patterns-analysis',
    label: 'Student Performance Patterns',
    description: 'Analyze overall performance trends and patterns to guide teaching strategies and student support'
  }
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
  const [showDynamicPromptModal, setShowDynamicPromptModal] = useState(false);
  const [selectedDynamicOptions, setSelectedDynamicOptions] = useState([]);
  const [dynamicOptions, setDynamicOptions] = useState(dynamicPromptOptions);
  const [loadingDynamicOptions, setLoadingDynamicOptions] = useState(false);
  const [dynamicOptionsError, setDynamicOptionsError] = useState(null);
  const { count, MAX_CALLS_PER_DAY, incrementCount } = useContext(ApiCallCountContext);
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

  const handleDynamicPromptGeneration = async () => {
    setShowDynamicPromptModal(true);
    setLoadingDynamicOptions(true);
    setDynamicOptionsError(null);

    try {
      // Check API limit before making call
      if (count >= MAX_CALLS_PER_DAY) {
        throw new Error(`You have reached your daily API usage limit (${MAX_CALLS_PER_DAY} calls).`);
      }

      // Fetch exam data and generate dynamic options
      const examData = await DynamicPromptService.fetchExamData(examId, supabase);
      const generatedOptions = await DynamicPromptService.generateDynamicOptions(
        examData, 
        selectedProvider
      );

      // Increment API call count
      incrementCount();

      setDynamicOptions(generatedOptions);
    } catch (error) {
      console.error('Error generating dynamic options:', error);
      setDynamicOptionsError(error.message);
      // Fall back to static options on error
      setDynamicOptions(dynamicPromptOptions);
    } finally {
      setLoadingDynamicOptions(false);
    }
  };

  const handleDynamicOptionChange = (optionId) => {
    setSelectedDynamicOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const generateDynamicPrompt = () => {
    if (selectedDynamicOptions.length === 0) {
      alert('Please select at least one option to generate a dynamic prompt.');
      return;
    }

    const selectedOptionsDetails = dynamicOptions.filter(option => 
      selectedDynamicOptions.includes(option.id)
    );

    // Create dynamic JSON structure based on selected options
    let jsonStructure = `{
  "overallSummary": "Brief 2-3 sentence summary of class performance with focus on the selected analysis areas",
  "keyStrengths": [
    "List 3-5 concepts students mastered well",
    "Include specific question numbers or short titles as evidence (avoid internal IDs or UUIDs)"
  ],`;

    // Add dynamic sections based on selected options
    selectedOptionsDetails.forEach((option, index) => {
      // Convert option label to a camelCase key for JSON
      const sectionKey = option.label
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .split(' ')
        .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');

      jsonStructure += `
  "${sectionKey}": [
    "Analysis and insights for: ${option.label}",
    "Specific findings related to: ${option.description}",
    "Actionable recommendations based on this focus area"
  ]`;
      
      // Add comma if not the last item
      if (index < selectedOptionsDetails.length - 1) {
        jsonStructure += ',';
      }
    });

    jsonStructure += `
}`;

    // Create the full prompt
    let dynamicPrompt = `Analyze these exam results and provide feedback in this exact JSON structure:

${jsonStructure}

ANALYSIS FOCUS AREAS:
Please provide detailed analysis for each of the following selected areas:

`;
    
    selectedOptionsDetails.forEach((option, index) => {
      dynamicPrompt += `${index + 1}. ${option.label}:\n   ${option.description}\n\n`;
    });

    dynamicPrompt += `Please analyze the provided data: [QUESTIONS], [SUBMISSIONS], and [ANSWERS] to deliver insights for each selected focus area above.`;

    setCustomPrompt(dynamicPrompt);
    setIsCustomPrompt(true);
    setSelectedLabel('Dynamic Generated Prompt');
    setShowDynamicPromptModal(false);
    setSelectedDynamicOptions([]); // Reset selections
  };

  const closeDynamicModal = () => {
    setShowDynamicPromptModal(false);
    setSelectedDynamicOptions([]); // Reset selections when closing
    setDynamicOptionsError(null);
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
              disabled={isLimitReached}
            >
              🤖 AI-Powered Prompt Options
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

      {/* Dynamic Prompt Generation Modal */}
      <Modal show={showDynamicPromptModal} onHide={closeDynamicModal} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>🤖 Dynamic Prompt Generation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDynamicOptions ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">
                Analyzing exam data to generate personalized prompt options...
              </p>
              <small className="text-muted">
                This may take a few moments as we analyze your exam questions, student submissions, and performance patterns.
              </small>
            </div>
          ) : dynamicOptionsError ? (
            <Alert variant="warning">
              <Alert.Heading>Unable to Generate Dynamic Options</Alert.Heading>
              <p>{dynamicOptionsError}</p>
              <p>Using fallback options below. You can still select from these general analysis areas:</p>
            </Alert>
          ) : (
            <div className="mb-3">
              <Alert variant="info">
                <div className="d-flex align-items-center">
                  <i className="fas fa-info-circle me-2"></i>
                  <div>
                    <strong>AI-Generated Options:</strong> These focus areas have been specifically tailored to your exam based on question types, student performance patterns, and submission data.
                    <br />
                    <small className="text-muted">Note: This feature uses 1 API call to analyze your exam data.</small>
                  </div>
                </div>
              </Alert>
              <p className="text-muted">
                Select one or more focus areas for your AI feedback analysis. The system will generate a customized prompt based on your selections.
              </p>
            </div>
          )}
          
          {!loadingDynamicOptions && (
            <>
              <Form>
                {dynamicOptions.map((option) => (
                  <Card key={option.id} className={`mb-3 ${selectedDynamicOptions.includes(option.id) ? 'border-primary' : ''}`}>
                    <Card.Body>
                      <Form.Check
                        type="checkbox"
                        id={`dynamic-option-${option.id}`}
                        checked={selectedDynamicOptions.includes(option.id)}
                        onChange={() => handleDynamicOptionChange(option.id)}
                        label={
                          <div>
                            <strong>{option.label}</strong>
                            <br />
                            <small className="text-muted">{option.description}</small>
                          </div>
                        }
                        className="h-100"
                      />
                    </Card.Body>
                  </Card>
                ))}
              </Form>

              {selectedDynamicOptions.length > 0 && (
                <Alert variant="success">
                  <strong>Selected Options:</strong> {selectedDynamicOptions.length} of {dynamicOptions.length}
                </Alert>
              )}

              {dynamicOptions.length === 0 && !loadingDynamicOptions && (
                <Alert variant="warning">
                  No options could be generated. Please try again or contact support if the issue persists.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDynamicModal}>
            Cancel
          </Button>
          {!loadingDynamicOptions && (
            <Button 
              variant="primary" 
              onClick={generateDynamicPrompt}
              disabled={selectedDynamicOptions.length === 0}
            >
              Generate Prompt ({selectedDynamicOptions.length} selected)
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PromptSelector;
