import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';

const CourseExamsPage = () => {
  const { course_code } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    const fetchCourseAndExams = async () => {
      try {
        setLoading(true);
        
        // Fetch course title
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('title')
          .eq('course_code', course_code)
          .single();

        if (courseError) throw courseError;
        setCourseTitle(courseData?.title || '');

        // Fetch exams for this course
        const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select('exam_id, title, duration, type')
        .eq('course_code', course_code);

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
  }, [course_code]);

  const handleExamClick = (examId) => {
    navigate(`/teacher/exams/${examId}/questions`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${minutes}m`;
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
  <h4>
    {courseTitle ? `${course_code} - ${courseTitle}` : 'Course Exams'}
  </h4>
  <Button 
    variant="light"
    onClick={() => navigate(`/teacher/exams`)}
  >
    Create New Exam
  </Button>
</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <Alert variant="info">
              No exams found for this course. Create one to get started.
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Duration</th>
                    {/* Remove this column <th>Created</th> */}
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam) => (
                    <tr key={exam.exam_id}>
                        <td>{exam.title}</td>
                        <td>{exam.type.toUpperCase()}</td>
                        <td>{formatDuration(exam.duration)}</td>
                        {/* Remove this cell <td>{new Date(exam.created_at).toLocaleDateString()}</td> */}
                        <td>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleExamClick(exam.exam_id)}
                        >
                            Edit Exam
                        </Button>
                        </td>
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