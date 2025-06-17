import React, { useEffect, useState, useContext } from "react";
import { Container, Card, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../SupabaseAuth/supabaseClient";
import HeaderWithApiCount from './HeaderWithApiCount';
import { ApiCallCountContext } from "../../../Context/ApiCallCountContext";

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
  const { count, MAX_CALLS_PER_DAY } = useContext(ApiCallCountContext);
  const isLimitReached = count >= MAX_CALLS_PER_DAY;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("Please login to view courses");

        // Step 1: Get all exams created by this user
        const { data: exams, error: examsError } = await supabase
          .from('exams')
          .select('course_id')
          .eq('user_id', user.id)
          .not('course_id', 'is', null);

        if (examsError) throw examsError;

        // Extract unique course_ids from exams
        const courseIds = [...new Set(exams.map(exam => exam.course_id))];
        
        if (courseIds.length === 0) {
          setCourses([]);
          return;
        }

        // Step 2: Get course details for these course_ids
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('course_id, title, course_code')
          .in('course_id', courseIds)
          .order('created_at', { ascending: false });

        if (coursesError) throw coursesError;

        setCourses(coursesData || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
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
        // Get authenticated user to filter by user_id
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase
          .from("exams")
          .select("exam_id, title")
          .eq("course_id", selectedCourse)
          .eq("type", selectedType)
          .eq("user_id", user.id); // Only show exams created by this user
          
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

  const handleAIFeedbackClick = () => {
    if (isLimitReached) {
      alert("You have reached the daily limit of AI feedback requests. Please try again tomorrow.");
      return;
    }

    navigate(`/teacher/exams/${selectedExam}/prompt-selector`);
  };

  return (
    <Container className="my-4">
      <Card>
        
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">🤖 AI Feedback - Select Exam</h4>
          <HeaderWithApiCount />
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
                        disabled={loading || courses.length === 0}
                      >
                        <option value="">-- Choose a Course --</option>
                        {courses.map((course) => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_code} - {course.title}
                          </option>
                        ))}
                      </Form.Select>
                      {courses.length === 0 && !loading && (
                        <Form.Text className="text-muted">No courses available</Form.Text>
                      )}
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

            {examDetails && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Exam Details</h5>
                </Card.Header>
                <Card.Body>
                  <p><strong>Title:</strong> {examDetails.title}</p>
                  <p><strong>Duration:</strong> {examDetails.duration} mins</p>
                  <p><strong>Questions:</strong> {examDetails.question_count}</p>
                  <p><strong>Type:</strong> {examDetails.type.toUpperCase()}</p>
                  <p><strong>Instructions:</strong> {examDetails.instructions || "N/A"}</p>
                </Card.Body>
              </Card>
            )}

            <div className="d-flex justify-content-end">
              <Button
                variant={isLimitReached ? "secondary" : "primary"}
                size="lg"
                onClick={handleAIFeedbackClick}
                disabled={!selectedExam || loading || isLimitReached}
              >
                Proceed to AI Feedback
              </Button>
            </div>

            {isLimitReached && (
              <p className="text-danger mt-3 text-end fw-bold">
                You have reached the daily limit of AI feedback requests. Please try again tomorrow.
              </p>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeedbackSelector;
