import { Card, CardBody, CardHeader, Col, Badge , ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useExamDetails from './hooks/useExamDetails';

export default function ExamsContent() {
    const { examId } = useParams();
    const {
        examDetails,
        loading,
        error,
        formatDateTime
    }= useExamDetails({ examId });
    console.log("Exam Details:", examDetails);

  return (
    <Col className="w-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Card className="mt-4">
        <Card.Header className='bg-primary text-white'>
          <h4>📚 Exam Info - {examDetails?.title}</h4>
        </Card.Header>
        <Card.Body>
          <p><strong>Type:</strong> <Badge bg="secondary">{examDetails?.type.toUpperCase()}</Badge></p>
          <p><strong>Duration:</strong> {examDetails?.duration} minutes</p>
          <p><strong>Start:</strong> {formatDateTime(examDetails?.start_time)}</p>
          <p><strong>End:</strong> {formatDateTime(examDetails?.end_time)}</p>
          <p><strong>Instructions:</strong> {examDetails?.instructions || '---'}</p>
        </Card.Body>
      </Card>
    </Col>
    
  )
}
