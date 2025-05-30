import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';



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