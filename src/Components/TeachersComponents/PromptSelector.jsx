import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';

const predefinedPrompts = [
  {
    label: 'Standard Analysis',
    prompt: `Analyze these exam results and provide feedback in this exact JSON structure:
    
{
  "overallSummary": "Brief 2-3 sentence summary of class performance",
  "keyStrengths": [
    "List 3-5 concepts students mastered well",
    "Include specific question numbers as evidence"
  ],
  "mostMissedQuestions": [
    "Top 3-5 questions students struggled with",
    "Briefly explain the misconceptions"
  ],
  "teachingSuggestions": [
    "2-3 specific reteaching strategies",
    "Activity ideas to reinforce weak areas"
  ],
  "nextSteps": [
    "Immediate actions for the teacher",
    "Follow-up assessment ideas"
  ]
}

Questions: [QUESTIONS]
Submissions: [SUBMISSIONS]
Answers: [ANSWERS]

Return ONLY valid JSON with these exact keys.`
  },
  {
    label: 'Quick Insights',
    prompt: `Provide concise exam feedback in this JSON format:
{
  "overallSummary": "One paragraph summary",
  "keyStrengths": ["2-3 strengths max"],
  "mostMissedQuestions": ["2-3 weak areas"],
  "teachingSuggestions": ["2 quick recommendations"],
  "nextSteps": ["1-2 action items"]
}`
  },
  {
    label: 'Detailed Report',
    prompt: `Create comprehensive feedback in this structure:
{
  "overallSummary": "Detailed performance analysis (3-4 sentences)",
  "keyStrengths": [
    "3-5 mastered concepts with question examples",
    "Performance patterns observed"
  ],
  "mostMissedQuestions": [
    "Top 5 difficult questions",
    "Detailed misconception analysis for each",
    "Prerequisite knowledge gaps"
  ],
  "teachingSuggestions": [
    "Differentiated instruction strategies",
    "Reteaching methods for each weak area",
    "Recommended practice activities"
  ],
  "nextSteps": [
    "Short-term remediation plan",
    "Long-term instructional adjustments",
    "Suggested resources"
  ]
}`
  },
  {
    label: 'Custom Prompt',
    prompt: `Create your own custom prompt structure. You can use these placeholders if needed:
[QUESTIONS] - Will be replaced with exam questions
[SUBMISSIONS] - Will be replaced with student submissions
[ANSWERS] - Will be replaced with correct answers

Suggested structure:
{
  "analysis": "Your custom analysis requirements",
  "strengths": ["What to look for"],
  "weaknesses": ["What to analyze"],
  "recommendations": ["What to suggest"]
}`
  }
];

const aiProviders = [
  { id: 'cohere', name: 'Cohere AI', model: 'command' },  
  { id: 'openrouter', name: 'OpenRouter AI', model: 'openrouter-chat' }
];

const PromptSelector = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState(predefinedPrompts[0].prompt);
  const [selectedLabel, setSelectedLabel] = useState(predefinedPrompts[0].label);
  const [selectedProvider, setSelectedProvider] = useState(aiProviders[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);

  const handleSubmit = () => {
    const finalPrompt = isCustomPrompt ? customPrompt : selectedPrompt;
    navigate(`/teacher/exams/${examId}/ai-feedback`, {
      state: { 
        prompt: finalPrompt,
        aiProvider: selectedProvider
      }
    });
  };

  const handlePromptChange = (label) => {
    if (label === 'Custom Prompt') {
      setIsCustomPrompt(true);
      setCustomPrompt(predefinedPrompts.find(p => p.label === label).prompt);
    } else {
      setIsCustomPrompt(false);
      const prompt = predefinedPrompts.find(p => p.label === label).prompt;
      setSelectedLabel(label);
      setSelectedPrompt(prompt);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4>AI Feedback Generator</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>AI Feedback Provider</Form.Label>
                <Form.Select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
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
                <Form.Select
                  value={selectedLabel}
                  onChange={(e) => {
                    const prompt = predefinedPrompts.find(p => p.label === e.target.value).prompt;
                    setSelectedLabel(e.target.value);
                    setSelectedPrompt(prompt);
                  }}
                >
                  {predefinedPrompts.map((p, idx) => (
                    <option key={idx} value={p.label}>{p.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Preview</Form.Label>
              <Card body className="bg-light">
                <pre style={{whiteSpace: 'pre-wrap'}}>{selectedPrompt}</pre>
              </Card>
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" onClick={handleSubmit}>
              Generate Feedback
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PromptSelector;