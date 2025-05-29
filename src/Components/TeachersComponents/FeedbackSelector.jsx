import React, { useEffect, useState } from "react";
import { Container, Card, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";

const FeedbackSelector = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [examTypes] = useState(["mcq", "code", "essay"]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("course_id, title, course_code")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch exams when course or type changes
  useEffect(() => {
    const fetchExams = async () => {
      if (!selectedCourse || !selectedType) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("exams")
          .select("exam_id, title")
          .eq("course_id", selectedCourse)
          .eq("type", selectedType)          
        if (error) throw error;
        setExams(data || []);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError("Failed to load exams.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [selectedCourse, selectedType]);

  // Fetch selected exam details
  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!selectedExam) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("exam_id", selectedExam)
          .single();
        if (error) throw error;
        setExamDetails(data);
      } catch (err) {
        console.error("Error fetching exam details:", err);
        setError("Failed to load exam details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [selectedExam]);

  const handleProceed = () => {
    navigate('/teacher/ai-feedback?exam_id=${selectedExam}');
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4>🤖 AI Feedback - Select Exam</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Filter Exams</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Select Course</Form.Label>
                      <Form.Select
                        value={selectedCourse}
                        onChange={(e) => {
                          setSelectedCourse(e.target.value);
                          setSelectedExam("");
                          setExamDetails(null);
                        }}
                      >
                        <option value="">-- Choose a Course --</option>
                        {courses.map((course) => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_code} - {course.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Select Exam Type</Form.Label>
                      <Form.Select
                        value={selectedType}
                        onChange={(e) => {
                          setSelectedType(e.target.value);
                          setSelectedExam("");
                          setExamDetails(null);
                        }}
                      >
                        <option value="">-- Choose Exam Type --</option>
                        {examTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.toUpperCase()}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Select Exam</Form.Label>
                      <Form.Select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        disabled={!exams.length}
                      >
                        <option value="">-- Choose an Exam --</option>
                        {exams.map((exam) => (
                          <option key={exam.exam_id} value={exam.exam_id}>
                            {exam.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {loading && (
              <div className="text-center mb-4">
                <Spinner animation="border" variant="primary" />
              </div>
            )}

            

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceed}
                disabled={!selectedExam || loading}
              >
                Proceed to AI Feedback
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeedbackSelector;