import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderWithApiCount from './HeaderWithApiCount';

const AIFeedbackPage_Essay = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

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
          <p>This is the placeholder for the AI feedback for essay exams.</p>
          <p>In the next steps, we will fetch data, call AI, and display the results here.</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AIFeedbackPage_Essay;
