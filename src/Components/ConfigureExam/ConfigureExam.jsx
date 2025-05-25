import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../../SupabaseAuth/supabaseClient"; 

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
  const [courses, setCourses] = useState([]);
  const [fetchingCourses, setFetchingCourses] = useState(false);

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      setFetchingCourses(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          return;
        }

        const { data, error } = await supabase
          .from('courses')
          .select('course_id, title, course_code')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setFetchingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user?.id) {
        throw new Error("Please login to create exams");
      }
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (userError || userData?.role !== 'teacher') {
        throw new Error("Only teachers can create exams");
      }

      const response = await axios.post(
        "http://localhost:5000/api/configureExam",
        {
          ...exam,
          user_id: session.user.id
        }
      );      
      localStorage.setItem("examConfig", JSON.stringify({
        ...exam,
        examId: response.data.examId
      }));      
      
      navigate(`/teacher/exams/${response.data.examId}/questions/${exam.type}`);

    } catch (err) {
      console.error("Error saving exam:", err);
      setError(err.message || "Failed to save exam configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4>📝 Configure New Exam</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Exam Title *</Form.Label>
                  <Form.Control 
                    name="title" 
                    onChange={handleChange}
                    value={exam.title}
                    placeholder="Enter a descriptive title (e.g., 'Data Structures Final Exam')"
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Course *</Form.Label>
                      <Form.Select
                        name="course_id"
                        onChange={handleChange}
                        value={exam.course_id}
                        required
                        disabled={fetchingCourses}
                      >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_code} - {course.title}
                          </option>
                        ))}
                      </Form.Select>
                      {fetchingCourses && (
                        <Form.Text className="text-muted">Loading courses...</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Exam Duration (Minutes) *</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="duration" 
                        onChange={handleChange}
                        value={exam.duration}
                        placeholder="Estimated completion time (e.g., '120')"
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Exam Rules Section */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Exam Rules & Instructions</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Student Instructions</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="instructions"
                    onChange={handleChange}
                    value={exam.instructions}
                    placeholder="Provide clear rules for students:
  - Allowed materials
  - Submission guidelines
  - Special requirements"
                  />
                  <Form.Text className="text-muted">
                    These instructions will be visible to students
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Grading Criteria Section */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Grading Configuration</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AI Assessment Guidelines</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="ai_assessment_guide"
                    onChange={handleChange}
                    value={exam.ai_assessment_guide}
                    placeholder="Define evaluation criteria:
  1. Points deduction for late submissions
  2. Required code documentation
  3. Plagiarism check severity"
                  />
                  <Form.Text className="text-muted">
                    These instructions guide the automated grading system
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Question Type *</Form.Label>
                      <Form.Select 
                        name="type" 
                        onChange={handleChange}
                        value={exam.type}
                        className="form-select"
                      >
                        <option value="mcq">Multiple Choice Questions</option>
                        <option value="code">Programming/Coding</option>
                        <option value="essay">Written Responses</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Total Questions *</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="question_count"
                        onChange={handleChange}
                        value={exam.question_count}
                        placeholder="Number of questions (e.g., '15')"
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                type="submit" 
                disabled={loading}
                variant="primary"
                size="lg"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Configuration...
                  </>
                ) : (
                  "Save & Proceed to Questions"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ConfigureExam;