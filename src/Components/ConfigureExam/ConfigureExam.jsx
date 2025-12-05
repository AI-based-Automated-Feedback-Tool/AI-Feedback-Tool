import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import '../../css/pages/ConfigureExam.css';

const ConfigureExam = () => {
    const navigate = useNavigate();
    const [exam, setExam] = useState({
        title: "",
        course_id: "",
        instructions: "",
        type: "mcq",
        duration: "",
        question_count: "",
        ai_assessment_guide: "",
        start_time: "",
        end_time: "",
        exam_or_assignment: "exam"
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
                    .eq('user_id', session.user.id)
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

    const handleDateTimeChange = (e) => {
        // Convert local datetime to ISO string for Supabase
        const date = new Date(e.target.value);
        const isoString = date.toISOString();
        setExam({ ...exam, [e.target.name]: isoString });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate end time is after start time
        if (new Date(exam.end_time) <= new Date(exam.start_time)) {
            setError("End time must be after start time");
            setLoading(false);
            return;
        }

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
                "https://ai-feedback-tool-backend-qgvj.onrender.com/api/configureExam",
                {
                    ...exam,
                    user_id: session.user.id,
                    exam_or_assignment: exam.exam_or_assignment
                }
            );
            
            localStorage.setItem("examConfig", JSON.stringify({
                ...exam,
                examId: response.data.examId
            }));
            
            navigate(`/teacher/exams/${response.data.examId}/questions/${exam.type}?question_count=${exam.question_count}&exam_or_assignment=${exam.exam_or_assignment}`);

        } catch (err) {
            console.error("Error saving exam:", err);
            setError(err.message || "Failed to save exam configuration");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format datetime for input field
    const formatDateTimeForInput = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        // Adjust for timezone offset
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - timezoneOffset);
        return localDate.toISOString().slice(0, 16);
    };

    return (
        <div className="configure-exam-page">
            {/* Hero Section */}
            <div className="configure-hero-section">
                <Container>
                    <div className="configure-hero-content">
                        <h1 className="configure-hero-title">
                            {exam.exam_or_assignment === "exam" ? "📝 Configure New Exam" : "📋 Configure New Assignment"}
                        </h1>
                        <p className="configure-hero-subtitle">
                            Set up comprehensive parameters and grading criteria
                        </p>
                    </div>
                </Container>
            </div>

            <Container className="my-4">
                <Card className="main-card">
                    <Card.Header className="main-card-header">
                        <h4>{exam.exam_or_assignment === "exam" ? "Exam Configuration" : "Assignment Configuration"}</h4>
                    </Card.Header>
                    <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        {/* Exam or Assignment Selection */}
                        <Card className="section-card mb-3">
                            <Card.Header className="section-card-header">
                                <h5 className="mb-0">Type Selection</h5>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Select Type *</Form.Label>
                                    <div className="d-flex gap-4">
                                        <Form.Check
                                            type="radio"
                                            id="type-exam"
                                            name="exam_or_assignment"
                                            value="exam"
                                            label={
                                                <div>
                                                    <strong>Exam</strong>
                                                    <div className="text-muted small">Traditional assessment format</div>
                                                </div>
                                            }
                                            checked={exam.exam_or_assignment === "exam"}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="type-assignment"
                                            name="exam_or_assignment"
                                            value="assignment"
                                            label={
                                                <div>
                                                    <strong>Assignment</strong>
                                                    <div className="text-muted small">Project or homework submission</div>
                                                </div>
                                            }
                                            checked={exam.exam_or_assignment === "assignment"}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                        {/* Basic Information Section */}
                        <Card className="section-card">
                            <Card.Header className="section-card-header">
                                <h5 className="mb-0">Basic Information</h5>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        {exam.exam_or_assignment === "exam" ? "Exam Title" : "Assignment Title"} *
                                    </Form.Label>
                                    <Form.Control 
                                        name="title" 
                                        onChange={handleChange}
                                        value={exam.title}
                                        placeholder={exam.exam_or_assignment === "exam" 
                                            ? "Enter a descriptive title (e.g., 'Data Structures Final Exam')"
                                            : "Enter a descriptive title (e.g., 'Project Report Assignment')"}
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
                                            <Form.Label className="fw-bold">Duration (Minutes) *</Form.Label>
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

                                {/* New Date/Time Fields */}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Start Time *</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                name="start_time"
                                                onChange={handleDateTimeChange}
                                                value={formatDateTimeForInput(exam.start_time)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">End Time *</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                name="end_time"
                                                onChange={handleDateTimeChange}
                                                value={formatDateTimeForInput(exam.end_time)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        
                        {/* Exam Rules Section */}
                        <Card className="section-card">
                            <Card.Header className="section-card-header">
                                <h5 className="mb-0">
                                    {exam.exam_or_assignment === "exam" ? "Exam Rules & Instructions" : "Assignment Instructions"}
                                </h5>
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
                        <Card className="section-card">
                            <Card.Header className="section-card-header">
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
        </div>
    );
};

export default ConfigureExam;