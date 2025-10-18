import React, { useEffect, useState, useContext } from "react";
import { Container, Card, Form, Row, Col, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../SupabaseAuth/supabaseClient";
import HeaderWithApiCount from './HeaderWithApiCount';
import { ApiCallCountContext } from "../../../Context/ApiCallCountContext";
import '../../../css/pages/FeedbackSelector.css';

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

    navigate(`/teacher/exams/${selectedExam}/prompt-selector`, {
      state: { questionTypes: [selectedType] },
    });

  };

  return (
    <div className="feedback-selector-page">
      {/* Hero Section */}
      <div className="feedback-selector-hero">
        <div className="container">
          <div className="hero-content text-center">
            <div className="hero-icon mb-3">
              <i className="fas fa-robot fa-3x text-primary"></i>
            </div>
            <h1 className="hero-title mb-3">
              <span className="gradient-text">AI-Powered Feedback</span>
            </h1>
            <p className="hero-subtitle text-muted mb-4">
              Generate intelligent insights and recommendations for your exams using advanced AI analysis
            </p>
            <HeaderWithApiCount />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container feedback-content-container">
        {error && (
          <Alert variant="danger" className="modern-alert mb-4">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

      {/* Main Selection Card */}
      <Card className="main-selection-card border-0 shadow-lg">
        <Card.Header className="modern-card-header">
          <div className="d-flex align-items-center">
            <div className="header-icon me-3">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div>
              <h4 className="mb-1 text-white">Select Your Exam</h4>
              <small className="text-white-50">Choose the course, type, and specific exam for AI analysis</small>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          <Form>
            {/* Filter Section */}
            <div className="filter-section mb-4">
              <div className="section-header mb-4">
                <h5 className="section-title">
                  <i className="fas fa-filter me-2 text-primary"></i>
                  Filter Options
                </h5>
                <p className="section-subtitle text-muted">
                  Narrow down your exam selection by course and type
                </p>
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <div className="modern-form-group">
                    <label className="modern-label">
                      <i className="fas fa-graduation-cap me-2 text-primary"></i>
                      Select Course
                    </label>
                    <div className="modern-select-wrapper">
                      <Form.Select
                        className="modern-select"
                        value={selectedCourse}
                        onChange={(e) => {
                          setSelectedCourse(e.target.value);
                          setSelectedExam("");
                          setExamDetails(null);
                        }}
                        disabled={loading || courses.length === 0}
                      >
                        <option value="">🎯 Choose a Course</option>
                        {courses.map((course) => (
                          <option key={course.course_id} value={course.course_id}>
                            📚 {course.course_code} - {course.title}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="select-icon">
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                    {courses.length === 0 && !loading && (
                      <div className="form-feedback">
                        <i className="fas fa-info-circle me-1"></i>
                        No courses available
                      </div>
                    )}
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="modern-form-group">
                    <label className="modern-label">
                      <i className="fas fa-tasks me-2 text-primary"></i>
                      Select Exam Type
                    </label>
                    <div className="modern-select-wrapper">
                      <Form.Select
                        className="modern-select"
                        value={selectedType}
                        onChange={(e) => {
                          setSelectedType(e.target.value);
                          setSelectedExam("");
                          setExamDetails(null);
                        }}
                      >
                        <option value="">📝 Choose Exam Type</option>
                        <option value="mcq">🔘 Multiple Choice Questions</option>
                        <option value="code">💻 Programming/Code</option>
                        <option value="essay">📄 Essay/Written</option>
                      </Form.Select>
                      <div className="select-icon">
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Exam Selection */}
              {selectedCourse && selectedType && (
                <Row className="mt-4">
                  <Col md={12}>
                    <div className="modern-form-group exam-selection">
                      <label className="modern-label">
                        <i className="fas fa-file-alt me-2 text-primary"></i>
                        Select Specific Exam
                      </label>
                      <div className="modern-select-wrapper">
                        <Form.Select
                          className="modern-select"
                          value={selectedExam}
                          onChange={(e) => setSelectedExam(e.target.value)}
                          disabled={!exams.length}
                        >
                          <option value="">📋 Choose an Exam</option>
                          {exams.map((exam) => (
                            <option key={exam.exam_id} value={exam.exam_id}>
                              📊 {exam.title}
                            </option>
                          ))}
                        </Form.Select>
                        <div className="select-icon">
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-section text-center py-4">
                <div className="modern-spinner">
                  <Spinner animation="border" variant="primary" className="me-3" />
                  <span className="loading-text">Loading exam data...</span>
                </div>
              </div>
            )}

            {/* Exam Details Preview */}
            {examDetails && (
              <div className="exam-details-section">
                <div className="section-header mb-3">
                  <h5 className="section-title">
                    <i className="fas fa-info-circle me-2 text-success"></i>
                    Exam Preview
                  </h5>
                </div>
                
                <Card className="exam-details-card border-0">
                  <Card.Body className="p-4">
                    <div className="exam-header mb-3">
                      <h6 className="exam-title text-primary">{examDetails.title}</h6>
                      <Badge bg="primary" className="exam-type-badge">
                        {examDetails.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <Row className="exam-stats">
                      <Col md={3}>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <i className="fas fa-clock text-warning"></i>
                          </div>
                          <div className="stat-content">
                            <span className="stat-value">{examDetails.duration}</span>
                            <span className="stat-label">Minutes</span>
                          </div>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="stat-item">
                          <div className="stat-icon">
                            <i className="fas fa-question-circle text-info"></i>
                          </div>
                          <div className="stat-content">
                            <span className="stat-value">{examDetails.question_count}</span>
                            <span className="stat-label">Questions</span>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="exam-instructions">
                          <strong>Instructions:</strong>
                          <p className="text-muted mb-0 mt-1">
                            {examDetails.instructions || "No special instructions provided"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            )}

            {/* Action Section */}
            <div className="action-section mt-5">
              <div className="d-flex justify-content-between align-items-center">
                <div className="action-info">
                  {isLimitReached && (
                    <div className="limit-warning">
                      <i className="fas fa-exclamation-triangle text-danger me-2"></i>
                      <span className="text-danger fw-bold">
                        Daily limit reached. Try again tomorrow.
                      </span>
                    </div>
                  )}
                </div>
                
                <Button
                  className={`modern-action-btn ${!selectedExam || loading || isLimitReached ? 'disabled' : ''}`}
                  size="lg"
                  onClick={handleAIFeedbackClick}
                  disabled={!selectedExam || loading || isLimitReached}
                >
                  <i className="fas fa-robot me-2"></i>
                  <span>Generate AI Feedback</span>
                  <i className="fas fa-arrow-right ms-2"></i>
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </div>
  );
};

export default FeedbackSelector;
