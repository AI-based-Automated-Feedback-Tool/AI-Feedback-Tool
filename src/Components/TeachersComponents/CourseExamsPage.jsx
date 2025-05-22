import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';

const CourseExamsPage = () => {
  const { course_code } = useParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch exams
        const { data: examsData, error: examsError } = await supabase
          .from('exams')
          .select('exam_id, title, duration, type')
          .eq('course_code', course_code);

        if (examsError) throw examsError;
        setExams(examsData || []);
        
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [course_code]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${minutes}m`;
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4>{course_code} - {courseTitle}</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <Alert variant="info">No exams found for this course.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.exam_id}>
                    <td>{exam.title}</td>
                    <td>{exam.type.toUpperCase()}</td>
                    <td>{formatDuration(exam.duration)}</td>
                    <td>
                      <Button variant="primary" size="sm">
                        Edit
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