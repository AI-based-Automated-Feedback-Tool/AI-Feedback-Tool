import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';

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
          .select('exam_id, title, duration, type')
          .eq('course_id', course_id);

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
            {courseData ? `${courseData.course_code} - ${courseData.title}` : 'Course Exams'}
          </h4>
          {courseData && (
            <Button 
              variant="light"
              onClick={() => navigate(`/teacher/exams`)}
            >
              Create New Exam
            </Button>
          )}
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
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.exam_id}>
                    <td>{exam.title}</td>
                    <td>{exam.type.toUpperCase()}</td>
                    <td>{formatDuration(exam.duration)}</td>
                    <td className="text-center">
                      
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