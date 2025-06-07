import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';

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

  const handleSubmit = () => {
    navigate(`/teacher/exams/${examId}/ai-feedback`, {
      state: { 
        prompt: selectedPrompt,
        aiProvider: selectedProvider
      }
    });
  };

  const handlePromptChange = (label) => {
    const prompt = predefinedPrompts.find(p => p.label === label).prompt;
    setSelectedLabel(label);
    setSelectedPrompt(prompt);
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4>Select Feedback Type</h4>
          <p className="mb-0">Choose how detailed you want the analysis</p>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
                <Form.Label>Feedback Style</Form.Label>
                <Form.Select
                  value={selectedLabel}
              onChange={(e) => handlePromptChange(e.target.value)}
                >
                  {predefinedPrompts.map((p, idx) => (
                    <option key={idx} value={p.label}>{p.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

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