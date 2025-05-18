import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send to backend
      const response = await axios.post(
        "http://localhost:5000/api/configureExam",
        {
          ...exam,
          teacher_id: "c0a80100-0000-4000-a000-000000000001" // Replace with actual auth later
        }
      );

      // Save to localStorage and navigate
      localStorage.setItem("examConfig", JSON.stringify({
        ...exam,
        examId: response.data.examId
      }));
      navigate("/create-questions");
    } catch (err) {
      console.error("Error saving exam:", err);
      setError(err.response?.data?.error || "Failed to save exam configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4>📝 Configure Exam</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Exam Title</Form.Label>
              <Form.Control 
                name="title" 
                onChange={handleChange}
                value={exam.title}
                placeholder="e.g., Midterm Exam - Data Structures"
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Course ID</Form.Label>
                  <Form.Control 
                    name="course_id" 
                    onChange={handleChange}
                    value={exam.course_id}
                    placeholder="e.g., CS101, MATH201" 
                    required
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
                    value={exam.duration}
                    placeholder="e.g., 90 for 1.5 hours"
                    min="1"
                    required
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
                value={exam.instructions}
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
                value={exam.ai_assessment_guide}
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
                  <Form.Select 
                    name="type" 
                    onChange={handleChange}
                    value={exam.type}
                  >
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
                    value={exam.question_count}
                    placeholder="Total questions students must answer"
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Questions"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ConfigureExam;