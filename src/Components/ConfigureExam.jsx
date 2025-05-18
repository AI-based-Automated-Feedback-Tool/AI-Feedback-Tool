// This component allows the user to configure an exam by providing details such as title, 
// course code, description, type, duration, and number of questions.

import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ConfigureExam = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState({
    title: "",
    course_id: "",
    instructions: "",
    type: "mcq",
    duration: "",
    question_count: "",
    ai_assessment_guide: ""
  });

  const handleChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    localStorage.setItem("examConfig", JSON.stringify(exam));
    navigate("/create-questions");
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4>📝 Configure Exam</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Exam Title</Form.Label>
              <Form.Control 
                name="title" 
                onChange={handleChange} 
                placeholder="e.g., Midterm Exam - Data Structures"
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Course ID</Form.Label>
                  <Form.Control 
                    name="course_id" 
                    onChange={handleChange} 
                    placeholder="e.g., CS101, MATH201"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="duration" 
                    onChange={handleChange} 
                    placeholder="e.g., 90 for 1.5 hours"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Exam Instructions</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                name="instructions"
                onChange={handleChange}
                placeholder="e.g., - Complete all questions within the time limit
- No external help or AI assistance allowed
- Keep your camera on during the exam"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>AI Assessment Guide</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="ai_assessment_guide"
                onChange={handleChange}
                placeholder="e.g., - Deduct 10% for missing comments
- Award extra points for efficient algorithms
- Strictly check for plagiarism"
              />
              <Form.Text className="text-muted">
                These criteria will guide the AI evaluation process
              </Form.Text>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select name="type" onChange={handleChange}>
                    <option value="mcq">Multiple Choice</option>
                    <option value="code">Code Question</option>
                    <option value="essay">Essay</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Number of Questions</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="question_count"
                    onChange={handleChange}
                    placeholder="Total questions students must answer"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button onClick={handleNext}>Create Questions</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ConfigureExam;