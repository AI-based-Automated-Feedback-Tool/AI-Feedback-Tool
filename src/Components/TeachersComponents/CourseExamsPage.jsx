import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import '../../css/CourseExamsPage.css';

const CourseExamsPage = () => {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourseAndExams = async () => {
      try {
        setLoading(true);        
        
        if (!course_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(course_id)) {
          throw new Error('Invalid course ID');
        }
        
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('course_id, course_code, title')
          .eq('course_id', course_id)
          .single();

        if (courseError) throw courseError;
        if (!courseData) throw new Error('Course not found');
        setCourseData(courseData);

        const { data: examsData, error: examsError } = await supabase
          .from('exams')
          .select('exam_id, title, duration, type, question_count, end_time')
          .eq('course_id', course_id)
          .order('end_time', { ascending: true }); // Order by due date

        if (examsError) throw examsError;
        setExams(examsData || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndExams();
  }, [course_id]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${minutes}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container className="mt-5 exam-page">
      <Card className="shadow-lg exam-main-card">
        <Card.Header className="bg-gradient text-white d-flex justify-content-between align-items-center exam-header">
          <h4 className="mb-0">
            {courseData ? `${courseData.course_code} - ${courseData.title}` : 'Course Exams'}
          </h4>
          {courseData && (
            <Button 
              variant="light"
              className="create-exam-btn"
              onClick={() => navigate(`/teacher/exams`)}
            >
              Create New Exam
            </Button>
          )}
        </Card.Header>
        <Card.Body className='p-4'>
          {error && <Alert variant="danger" className="modern-alert">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <Alert variant="info" className="empty-state-alert">
              No exams found for this course. Create one to get started.
            </Alert>
          ) : (
            <Table striped bordered hover responsive className="exam-table-list">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Questions</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.exam_id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/teacher/courses/${course_id}/exams/${exam.exam_id}`)} className="exam-row">
                    <td className="exam-title">{exam.title}</td>
                    <td>
                      <span className={`type-badge ${exam.type}`}>
                        {exam.type.toUpperCase()}
                      </span>
                    </td>
                    <td>{formatDuration(exam.duration)}</td>
                    <td>{exam.question_count || 'N/A'}</td>
                    <td>{formatDate(exam.end_time)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseExamsPage;