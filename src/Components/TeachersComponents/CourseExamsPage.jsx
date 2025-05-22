import React from 'react';
import { Container, Card, Table, Button, Alert } from 'react-bootstrap';

const CourseExamsPage = () => {
  // Mock data for UI development
  const mockExams = [
    { exam_id: 1, title: 'Midterm Exam', type: 'mcq', duration: 90 },
    { exam_id: 2, title: 'Final Exam', type: 'essay', duration: 120 },
  ];
  const mockCourseTitle = 'Introduction to Computer Science';

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${minutes}m`;
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4>CSS201 - {mockCourseTitle}</h4>
        </Card.Header>
        <Card.Body>
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
              {mockExams.map((exam) => (
                <tr key={exam.exam_id}>
                  <td>{exam.title}</td>
                  <td>{exam.type.toUpperCase()}</td>
                  <td>{formatDuration(exam.duration)}</td>
                  <td>
                    <Button variant="primary" size="sm">
                      Edit Exam
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseExamsPage;