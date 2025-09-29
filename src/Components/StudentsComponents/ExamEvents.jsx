import React from 'react';
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
//import { useParams } from 'react-router-dom';

const ExamEventsPage = () => {
    
  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3">My Upcoming Exams</h1>
          <p className="text-center text-muted">
            Track your enrolled exams and preparation progress
          </p>
        </Col>
      </Row>

      
    </Container>
  );
};

export default ExamEventsPage;
