import React, {useState} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
//import { useParams } from 'react-router-dom';

const localizer = momentLocalizer(moment);
const ExamEventsPage = () => {
     //const {userId} = useParams();

  //Add calender view state
  const [calendarView, setCalendarView] = useState('month');

  // Dummy data for enrolled exams
  const [exams, setExams] = useState([
    {
      id: 1,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      examType: 'Midterm',
      date: '2025-10-20',
      time: '9:00 AM - 11:00 AM',
      duration: '2 hours',
      location: 'Building A, Room 101',
      instructor: 'Dr. Smith',
      status: 'upcoming', // upcoming, in-progress, completed
      enrolled: true,
      preparationStatus: 'not-started', // not-started, in-progress, completed
      syllabus: 'Chapters 1-5, Basic Programming Concepts',
      importantNotes: 'Bring your student ID and calculator'
    },
    {
      id: 2,
      courseCode: 'MATH202',
      courseName: 'Calculus II',
      examType: 'Final',
      date: '2025-10-11',
      time: '1:00 PM - 4:00 PM',
      duration: '3 hours',
      location: 'Building B, Room 205',
      instructor: 'Prof. Johnson',
      status: 'upcoming',
      enrolled: true,
      preparationStatus: 'in-progress',
      syllabus: 'Integration Techniques, Applications of Integration',
      importantNotes: 'Formula sheet will be provided'
    },
    {
      id: 3,
      courseCode: 'PHY101',
      courseName: 'Physics Fundamentals',
      examType: 'Quiz',
      date: '2025-12-10',
      time: '10:30 AM - 11:30 AM',
      duration: '1 hour',
      location: 'Science Building, Lab 3',
      instructor: 'Dr. Brown',
      status: 'upcoming',
      enrolled: true,
      preparationStatus: 'not-started',
      syllabus: 'Newtonian Mechanics, Basic Laws',
      importantNotes: 'Closed book exam'
    }
  ]);

  const [filters, setFilters] = useState({
    examType: 'all',
    status: 'upcoming',
    preparationStatus: 'all'
  });

  const examTypes = ['all', 'Quiz', 'Midterm', 'Final', 'Assignment'];
  const preparationStatuses = ['all', 'not-started', 'in-progress', 'completed'];

  // Filter exams based on selected filters
  const filteredExams = exams.filter(exam => {
    if (filters.examType !== 'all' && exam.examType !== filters.examType) {
      return false;
    }
    if (filters.status !== 'all' && exam.status !== filters.status) {
      return false;
    }
    if (filters.preparationStatus !== 'all' && exam.preparationStatus !== filters.preparationStatus) {
      return false;
    }
    return exam.enrolled; // Only show enrolled exams
  });

  const getStatusVariant = (status) => {
    const variants = {
      'upcoming': 'primary',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'secondary'
    };
    return variants[status] || 'dark';
  };

  const getPreparationVariant = (prepStatus) => {
    const variants = {
      'not-started': 'danger',
      'in-progress': 'warning',
      'completed': 'success'
    };
    return variants[prepStatus] || 'secondary';
  };

  const updatePreparationStatus = (examId, newStatus) => {
    setExams(exams.map(exam => 
      exam.id === examId 
        ? { ...exam, preparationStatus: newStatus }
        : exam
    ));
  };

  const getDaysUntilExam = (examDate) => {
    const today = new Date();
    const examDay = new Date(examDate);
    const diffTime = examDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  //Add calender events function
  const getCalendarEvents = () => {
    return exams.map(exam => ({
      id: exam.id,
      title: `${exam.courseCode} - ${exam.examType}`,
      start: moment(exam.date, 'YYYY-MM-DD').toDate(),
      end: moment(exam.date, 'YYYY-MM-DD').add(1, 'days').toDate( ), // All-day event
      allDay: true,
      resource: exam,
    }));
  };
  
  //Add event styling function
  const eventStyleGetter = (event) => {
  console.log('Event being styled:', event); 
  
  let backgroundColor;
  if (event.resource.status === 'completed') {
    backgroundColor = '#28a745';
  } else if (event.resource.preparationStatus === 'in-progress') {
    backgroundColor = '#ffc107';
  } else if (event.resource.preparationStatus === 'completed') {
    backgroundColor = '#28a745';
  } else {
    backgroundColor = '#dc3545'; // not-started
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
      opacity: 1, // 🔥 ADD THIS
      fontWeight: 'bold' // 🔥 ADD THIS
    }
  };
};

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

  {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{exams.filter(e => e.status === 'upcoming').length}</Card.Title>
              <Card.Text>Upcoming Exams</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{exams.filter(e => e.preparationStatus === 'completed').length}</Card.Title>
              <Card.Text>Prepared</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{exams.filter(e => e.preparationStatus === 'in-progress').length}</Card.Title>
              <Card.Text>In Progress</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{exams.filter(e => e.preparationStatus === 'not-started').length}</Card.Title>
              <Card.Text>Not Started</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*Calendar component*/}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Exam Calendar View</h5>
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
                    // Optional: You can add functionality here to show exam details when clicked
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
        <Col md={4}>
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
        <Col md={4}>
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
              No exams found matching your filters.
            </Alert>
          </Col>
        ) : (
          filteredExams.map(exam => {
            const daysUntil = getDaysUntilExam(exam.date);
            
            return (
              <Col md={6} lg={4} key={exam.id} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <Badge bg={getStatusVariant(exam.status)}>
                      {exam.status}
                    </Badge>
                    <Badge bg={getPreparationVariant(exam.preparationStatus)}>
                      {exam.preparationStatus.replace('-', ' ')}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{exam.courseCode}: {exam.courseName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {exam.examType} Exam
                    </Card.Subtitle>
                    
                    <div className="mb-3">
                      <strong>Date:</strong> {exam.date}<br />
                      <strong>Time:</strong> {exam.time} ({exam.duration})<br />
                      <strong>Location:</strong> {exam.location}<br />
                      <strong>Instructor:</strong> {exam.instructor}
                    </div>

                    {daysUntil <= 7 && daysUntil > 0 && (
                      <Alert variant="warning" className="py-2">
                        <small>⏰ {daysUntil} day(s) until exam</small>
                      </Alert>
                    )}

                    <div className="mb-3">
                      <strong>Syllabus:</strong>
                      <p className="small text-muted mb-2">{exam.syllabus}</p>
                    </div>

                    <div className="mb-3">
                      <strong>Notes:</strong>
                      <p className="small text-muted">{exam.importantNotes}</p>
                    </div>

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
