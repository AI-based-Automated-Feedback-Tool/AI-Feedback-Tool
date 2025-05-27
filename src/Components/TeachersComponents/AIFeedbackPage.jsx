import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';

const AIFeedbackPage = () => {
  const { examId } = useParams();

  return (
    <Container className="mt-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h4>AI-Generated Teaching Feedback</h4>
          <span className="small">Exam ID: {examId}</span>
        </Card.Header>
        <Card.Body>
          <p>Loading feedback...</p>
        </Card.Body>
      </Card>
      <Alert variant="info">
        <i className="bi bi-robot"></i> Feedback will appear here.
      </Alert>
    </Container>
  );
};

export default AIFeedbackPage;
