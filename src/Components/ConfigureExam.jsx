// This component allows the user to configure an exam by providing details such as title, 
// course code, description, type, duration, and number of questions.

import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ConfigureExam = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState({
    title: "",
    courseCode: "",
    description: "",
    type: "mcq",
    duration: "",
    questionCount: ""
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
              <Form.Control name="title" onChange={handleChange} />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Course</Form.Label>
                  <Form.Control name="courseCode" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control type="number" name="duration" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Exam Instructions</Form.Label>
              <Form.Control as="textarea" rows={2} name="instructions" onChange={handleChange} />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select name="type" onChange={handleChange}>
                    <option value="mcq">Multiple Choice</option>
                    <option value="code">Code Question</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Number of Questions</Form.Label>
                  <Form.Control type="number" name="questionCount" onChange={handleChange} />
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
