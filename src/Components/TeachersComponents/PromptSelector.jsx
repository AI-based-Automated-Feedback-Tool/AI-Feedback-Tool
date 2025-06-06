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
    label: 'Simple Summary Only',
    prompt: `Analyze the exam data and summarize student performance in plain text. Focus only on general insights without listing specific questions.`
  },
  {
    label: 'Suggestions Focused',
    prompt: `Review the exam results and provide only improvement suggestions for the teacher. Skip the overall summary.`
  }
];

const PromptSelector = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState(predefinedPrompts[0].prompt);
  const [selectedLabel, setSelectedLabel] = useState(predefinedPrompts[0].label);

  const handleSubmit = () => {
    navigate(`/teacher/exams/${examId}/ai-feedback`, {
      state: { prompt: selectedPrompt }
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
          <h4>Select or Customize AI Prompt</h4>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Choose a prompt template</Form.Label>
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
            <Form.Label>Edit Prompt (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" onClick={handleSubmit}>
            Generate AI Feedback
            </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PromptSelector;