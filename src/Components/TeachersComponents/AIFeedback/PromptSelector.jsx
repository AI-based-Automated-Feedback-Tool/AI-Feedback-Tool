import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert, Modal, Spinner, Badge } from 'react-bootstrap';
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
import './PromptSelector.css'; // We'll create this CSS file


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
      dynamicPrompt += `${index + 1}. **${option.label}:**\n   ${option.description}\n\n`;
    });

    dynamicPrompt += `
IMPORTANT INSTRUCTIONS:
- Use question numbers (e.g. Q1, Q2) or short titles from the Questions array for references.
- DO NOT use internal IDs or UUIDs in the response.
- Return ONLY valid JSON with the exact keys shown in the structure above.
- For "overallSummary" and "keyStrengths": Provide general analysis as usual.
- For the custom sections (${selectedOptionsDetails.map(o => `"${o.label}"`).join(', ')}): Provide specific analysis for each selected focus area.
- Each custom section should contain 2-4 relevant insights, findings, or recommendations.
- Make sure each custom section directly addresses its corresponding focus area.

Questions: [QUESTIONS]
Submissions: [SUBMISSIONS]
Answers: [ANSWERS]`;

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
    <Container className="my-5">
      {/* Hero Section */}
      <div className="prompt-selector-hero mb-5">
        <div className="hero-content text-center">
          <div className="hero-icon mb-3">
            <i className="fas fa-brain fa-3x"></i>
          </div>
          <h1 className="hero-title mb-3">
            <span className="gradient-text">AI Feedback Generator</span>
          </h1>
          <p className="hero-subtitle mb-4">
            Customize your AI analysis with advanced prompt engineering and dynamic options
          </p>
          <div className="exam-type-indicator mb-3">
            <Badge className="exam-type-badge">
              <i className="fas fa-tag me-1"></i>
              {questionTypes.join(', ').toUpperCase()} EXAM
            </Badge>
          </div>
          <HeaderWithApiCount />
        </div>
      </div>

      {/* Limit Warning */}
      {isLimitReached && (
        <Alert variant="danger" className="modern-alert mb-4">
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>
              <strong>Daily Limit Reached</strong>
              <br />
              You have reached your daily API usage limit ({MAX_CALLS_PER_DAY} calls).
            </div>
          </div>
        </Alert>
      )}

      {/* Main Configuration Card */}
      <Card className="main-config-card border-0 shadow-lg">
        <Card.Header className="modern-card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-icon me-3">
                <i className="fas fa-cogs"></i>
              </div>
              <div>
                <h4 className="mb-1 text-white">Configure Your AI Prompt</h4>
                <small className="text-white-50">Choose your AI provider, feedback style, and customize your analysis</small>
              </div>
            </div>
            <Button
              className="dynamic-prompt-btn"
              size="sm"
              onClick={handleDynamicPromptGeneration}
              disabled={isLimitReached}
            >
              <i className="fas fa-magic me-2"></i>
              AI-Powered Options
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          {/* Provider & Style Selection */}
          <div className="config-section mb-4">
            <div className="section-header mb-4">
              <h5 className="section-title">
                <i className="fas fa-sliders-h me-2 text-primary"></i>
                Basic Configuration
              </h5>
              <p className="section-subtitle text-muted">
                Select your preferred AI provider and feedback analysis style
              </p>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <div className="modern-form-group">
                  <label className="modern-label">
                    <i className="fas fa-robot me-2 text-primary"></i>
                    AI Feedback Provider
                  </label>
                  <div className="modern-select-wrapper">
                    <Form.Select 
                      className="modern-select"
                      value={selectedProvider} 
                      onChange={(e) => setSelectedProvider(e.target.value)}
                    >
                      {aiProviders.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          🤖 {provider.name}
                        </option>
                      ))}
                    </Form.Select>
                    <div className="select-icon">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="modern-form-group">
                  <label className="modern-label">
                    <i className="fas fa-palette me-2 text-primary"></i>
                    Feedback Style
                  </label>
                  <div className="modern-select-wrapper">
                    <Form.Select 
                      className="modern-select"
                      value={selectedLabel} 
                      onChange={(e) => handlePromptChange(e.target.value)}
                    >
                      {promptsList.map((p, idx) => (
                        <option key={idx} value={p.label}>
                          📊 {p.label}
                        </option>
                      ))}
                    </Form.Select>
                    <div className="select-icon">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Prompt Configuration */}
          <div className="prompt-section">
            <div className="section-header mb-4">
              <h5 className="section-title">
                <i className="fas fa-code me-2 text-success"></i>
                Prompt {isCustomPrompt ? 'Editor' : 'Preview'}
              </h5>
              <p className="section-subtitle text-muted">
                {isCustomPrompt 
                  ? 'Customize your prompt to get exactly the feedback you need'
                  : 'Preview the selected prompt template that will be used for analysis'
                }
              </p>
            </div>

            <div className="prompt-container">
              {isCustomPrompt ? (
                <div className="custom-prompt-editor">
                  <Form.Control
                    as="textarea"
                    rows={12}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="modern-textarea"
                    placeholder="Enter your custom prompt here..."
                  />
                  <div className="editor-footer">
                    <div className="editor-tips">
                      <i className="fas fa-lightbulb me-2 text-warning"></i>
                      <span className="tip-text">
                        Tip: Use [QUESTIONS], [SUBMISSIONS], and [ANSWERS] placeholders to reference exam data
                      </span>
                    </div>
                    <div className="character-count">
                      {customPrompt.length} characters
                    </div>
                  </div>
                </div>
              ) : (
                <Card className="prompt-preview-card border-0">
                  <Card.Header className="preview-header">
                    <i className="fas fa-eye me-2"></i>
                    Prompt Preview
                  </Card.Header>
                  <Card.Body className="preview-body">
                    <pre className="prompt-content">{selectedPrompt}</pre>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="action-section mt-5">
            <div className="d-flex justify-content-center">
              <Button
                className={`generate-btn ${(isCustomPrompt && !customPrompt.trim()) || isLimitReached ? 'disabled' : ''}`}
                size="lg"
                onClick={handleSubmit}
                disabled={(isCustomPrompt && !customPrompt.trim()) || isLimitReached}
              >
                <i className="fas fa-rocket me-2"></i>
                <span>Generate AI Feedback</span>
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Enhanced Dynamic Prompt Modal */}
      <Modal show={showDynamicPromptModal} onHide={closeDynamicModal} size="lg" className="dynamic-modal">
        <Modal.Header closeButton className="modern-modal-header">
          <Modal.Title className="d-flex align-items-center">
            <div className="modal-icon me-3">
              <i className="fas fa-magic"></i>
            </div>
            <div>
              <span>AI-Powered Prompt Generation</span>
              <br />
              <small className="text-white-50">Intelligent analysis options tailored to your exam</small>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          {loadingDynamicOptions ? (
            <div className="loading-section text-center py-5">
              <div className="modern-spinner-container">
                <div className="spinner-wrapper">
                  <Spinner animation="border" variant="primary" className="modern-spinner" />
                  <div className="spinner-glow"></div>
                </div>
                <h5 className="loading-title mt-4">Analyzing Your Exam</h5>
                <p className="loading-subtitle text-muted">
                  Generating personalized prompt options based on your exam data...
                </p>
                <div className="loading-steps mt-3">
                  <div className="step active">
                    <i className="fas fa-search me-2"></i>
                    Analyzing questions
                  </div>
                  <div className="step active">
                    <i className="fas fa-chart-bar me-2"></i>
                    Processing submissions
                  </div>
                  <div className="step active">
                    <i className="fas fa-brain me-2"></i>
                    Generating insights
                  </div>
                </div>
              </div>
            </div>
          ) : dynamicOptionsError ? (
            <Alert variant="warning" className="modern-alert">
              <div className="d-flex align-items-start">
                <i className="fas fa-exclamation-triangle me-3 mt-1"></i>
                <div>
                  <h6>Unable to Generate Dynamic Options</h6>
                  <p className="mb-2">{dynamicOptionsError}</p>
                  <p className="mb-0">Using fallback options below. You can still select from these general analysis areas:</p>
                </div>
              </div>
            </Alert>
          ) : (
            <div className="options-intro mb-4">
              <Alert variant="info" className="modern-info-alert">
                <div className="d-flex align-items-start">
                  <i className="fas fa-sparkles me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-2">AI-Generated Focus Areas</h6>
                    <p className="mb-2">These options have been specifically tailored to your exam based on question types, student performance patterns, and submission data.</p>
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      This feature uses 1 API call to analyze your exam data.
                    </small>
                  </div>
                </div>
              </Alert>
              <p className="selection-instruction text-muted text-center">
                Select one or more focus areas to generate a customized analysis prompt
              </p>
            </div>
          )}
          
          {!loadingDynamicOptions && (
            <>
              <div className="options-grid">
                {dynamicOptions.map((option) => (
                  <Card 
                    key={option.id} 
                    className={`option-card ${selectedDynamicOptions.includes(option.id) ? 'selected' : ''}`}
                    onClick={() => handleDynamicOptionChange(option.id)}
                  >
                    <Card.Body className="p-3">
                      <div className="option-header mb-2">
                        <Form.Check
                          type="checkbox"
                          id={`dynamic-option-${option.id}`}
                          checked={selectedDynamicOptions.includes(option.id)}
                          onChange={() => handleDynamicOptionChange(option.id)}
                          className="option-checkbox"
                        />
                        <h6 className="option-title mb-0">{option.label}</h6>
                      </div>
                      <p className="option-description text-muted mb-0">
                        {option.description}
                      </p>
                      <div className="option-overlay">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {selectedDynamicOptions.length > 0 && (
                <div className="selection-summary mt-4">
                  <Alert variant="success" className="modern-success-alert">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-check-circle me-2"></i>
                        <span>
                          <strong>{selectedDynamicOptions.length}</strong> focus area{selectedDynamicOptions.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <Badge bg="success" className="selection-badge">
                        Ready to generate
                      </Badge>
                    </div>
                  </Alert>
                </div>
              )}

              {dynamicOptions.length === 0 && !loadingDynamicOptions && (
                <Alert variant="warning" className="modern-alert text-center">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  No options could be generated. Please try again or contact support if the issue persists.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer className="modern-modal-footer">
          <div className="d-flex justify-content-between align-items-center w-100">
            <Button variant="outline-secondary" onClick={closeDynamicModal} className="cancel-btn">
              <i className="fas fa-times me-2"></i>
              Cancel
            </Button>
            {!loadingDynamicOptions && (
              <Button 
                className={`generate-prompt-btn ${selectedDynamicOptions.length === 0 ? 'disabled' : ''}`}
                onClick={generateDynamicPrompt}
                disabled={selectedDynamicOptions.length === 0}
              >
                <i className="fas fa-magic me-2"></i>
                Generate Prompt ({selectedDynamicOptions.length} selected)
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PromptSelector;
