import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

// CONFIGURATION
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ExamEventsPage = () => {
  const [calendarView, setCalendarView] = useState('month');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    examType: 'all',
    preparationStatus: 'all'
  });

  const examTypes = ['all', 'Quiz', 'Midterm', 'Final', 'Assignment'];
  const preparationStatuses = ['all', 'not-started', 'in-progress', 'completed'];

  // 🔥 FETCH UPCOMING EXAMS FROM YOUR EXISTING BACKEND
  useEffect(() => {
    fetchUpcomingExams();
  }, []);

  const fetchUpcomingExams = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch upcoming exams from your new endpoint
      const response = await fetch(`${API_BASE_URL}/api/upcoming-exams`);

      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched upcoming exams:', data);
      
      // Set the exams data
      setExams(data);
      
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter exams based on selected filters
  const filteredExams = exams.filter(exam => {
    // Only show upcoming exams
    if (exam.status !== 'upcoming') {
      return false;
    }
    
    if (filters.examType !== 'all' && exam.examType !== filters.examType) {
      return false;
    }
    
    if (filters.preparationStatus !== 'all' && exam.preparationStatus !== filters.preparationStatus) {
      return false;
    }
    
    return true;
  });

  const getPreparationVariant = (prepStatus) => {
    const variants = {
      'not-started': 'danger',
      'in-progress': 'warning',
      'completed': 'success'
    };
    return variants[prepStatus] || 'secondary';
  };

  const updatePreparationStatus = async (examId, newStatus) => {
    try {
      //Update backend First
      const response = await fetch(`${API_BASE_URL}/api/exams/${examId}/preparation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preparationStatus: newStatus })
      });
      if (!response.ok) {
        throw new Error(`Failed to update preparation status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Preparation status updated:', result);

      //Update local state after successful backend update

    
    setExams(exams.map(exam => 
      exam.id === examId 
        ? { ...exam, preparationStatus: newStatus }
        : exam
    ));

    } catch (err) {
      console.error('Error updating preparation status:', err);
      alert('Failed to update preparation status. Please try again.');
    }

    
    
  };

  const getDaysUntilExam = (examDate) => {
    const today = new Date();
    const examDay = new Date(examDate);
    const diffTime = examDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCalendarEvents = () => {
    return filteredExams.map(exam => ({
      id: exam.id,
      title: `${exam.courseCode} - ${exam.examType}`,
      start: moment(exam.date, 'YYYY-MM-DD').toDate(),
      end: moment(exam.date, 'YYYY-MM-DD').add(1, 'days').toDate(),
      allDay: true,
      resource: exam,
    }));
  };
  
  const eventStyleGetter = (event) => {
    let backgroundColor;
    
    if (event.resource.preparationStatus === 'completed') {
      backgroundColor = '#28a745';
    } else if (event.resource.preparationStatus === 'in-progress') {
      backgroundColor = '#ffc107';
    } else {
      backgroundColor = '#dc3545';
    }
    
    return {
      style: {
        backgroundColor: backgroundColor,
        borderRadius: '4px',
        border: 'none',
        fontSize: '12px',
        padding: '2px 5px',
        cursor: 'pointer',
        color: 'white',
        opacity: 1,
        fontWeight: 'bold'
      }
    };
  };

  // LOADING STATE
  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading upcoming exams...</p>
        </div>
      </Container>
    );
  }

  //  ERROR STATE
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Exams</Alert.Heading>
          <p>{error}</p>
          <button className="btn btn-danger mt-3" onClick={fetchUpcomingExams}>
            Try Again
          </button>
        </Alert>
      </Container>
    );
  }

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

      {/* Quick Stats - Only for Upcoming Exams */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{filteredExams.length}</Card.Title>
              <Card.Text>Upcoming Exams</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{filteredExams.filter(e => e.preparationStatus === 'in-progress').length}</Card.Title>
              <Card.Text>In Progress</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{filteredExams.filter(e => e.preparationStatus === 'not-started').length}</Card.Title>
              <Card.Text>Not Started</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Calendar component */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Upcoming Exams Calendar</h5>
              <small className="text-muted">Click on events to see exam details</small>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '500px' }}>
                <Calendar
                  localizer={localizer}
                  events={getCalendarEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  views={['month', 'week', 'day']}
                  view={calendarView}
                  onView={view => setCalendarView(view)}
                  onSelectEvent={event => {
                    console.log('Selected exam:', event.resource);
                    alert(`Selected: ${event.resource.courseCode} - ${event.resource.examType}\nDate: ${event.resource.date}\nStatus: ${event.resource.preparationStatus}`);
                  }}
                  eventPropGetter={eventStyleGetter}
                  popup
                  showMultiDayTimes
                />
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  <Badge bg="success" className="me-2">Completed</Badge>
                  <Badge bg="warning" className="me-2">In Progress</Badge>
                  <Badge bg="danger">Not Started</Badge>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <label htmlFor="examType-filter" className="form-label">Exam Type</label>
          <select 
            id="examType-filter"
            className="form-select"
            value={filters.examType}
            onChange={(e) => setFilters({...filters, examType: e.target.value})}
          >
            {examTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </Col>
        <Col md={6}>
          <label htmlFor="preparation-filter" className="form-label">Preparation Status</label>
          <select 
            id="preparation-filter"
            className="form-select"
            value={filters.preparationStatus}
            onChange={(e) => setFilters({...filters, preparationStatus: e.target.value})}
          >
            {preparationStatuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.replace('-', ' ')}
              </option>
            ))}
          </select>
        </Col>
      </Row>

      {/* Exams List */}
      <Row>
        {filteredExams.length === 0 ? (
          <Col>
            <Alert variant="info" className="text-center">
              <Alert.Heading>No Upcoming Exams</Alert.Heading>
              <p>You don't have any upcoming exams at the moment.</p>
            </Alert>
          </Col>
        ) : (
          filteredExams.map(exam => {
            const daysUntil = getDaysUntilExam(exam.date);
            
            return (
              <Col md={6} lg={4} key={exam.id} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <Badge bg="primary">Upcoming</Badge>
                    <Badge bg={getPreparationVariant(exam.preparationStatus)}>
                      {exam.preparationStatus?.replace('-', ' ') || 'not started'}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{exam.courseCode}: {exam.courseName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {exam.examType} Exam
                    </Card.Subtitle>
                    
                    <div className="mb-3">
                      <strong>Date:</strong> {exam.date}<br />
                      <strong>Time:</strong> {exam.time || 'TBA'} {exam.duration && `(${exam.duration})`}<br />
                      <strong>Location:</strong> {exam.location || 'TBA'}<br />
                      <strong>Instructor:</strong> {exam.instructor || 'TBA'}
                    </div>

                    {daysUntil <= 7 && daysUntil > 0 && (
                      <Alert variant="warning" className="py-2">
                        <small>⏰ {daysUntil} day(s) until exam</small>
                      </Alert>
                    )}

                    {exam.syllabus && (
                      <div className="mb-3">
                        <strong>Syllabus:</strong>
                        <p className="small text-muted mb-2">{exam.syllabus}</p>
                      </div>
                    )}

                    {exam.importantNotes && (
                      <div className="mb-3">
                        <strong>Notes:</strong>
                        <p className="small text-muted">{exam.importantNotes}</p>
                      </div>
                    )}

                    {/* Preparation Status Controls */}
                    <div className="d-grid gap-2">
                      <small className="text-muted">Update Preparation:</small>
                      <div className="btn-group w-100">
                        <button
                          className={`btn btn-sm ${exam.preparationStatus === 'not-started' ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => updatePreparationStatus(exam.id, 'not-started')}
                        >
                          Not Started
                        </button>
                        <button
                          className={`btn btn-sm ${exam.preparationStatus === 'in-progress' ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => updatePreparationStatus(exam.id, 'in-progress')}
                        >
                          In Progress
                        </button>
                        <button
                          className={`btn btn-sm ${exam.preparationStatus === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => updatePreparationStatus(exam.id, 'completed')}
                        >
                          Completed
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
};

export default ExamEventsPage;