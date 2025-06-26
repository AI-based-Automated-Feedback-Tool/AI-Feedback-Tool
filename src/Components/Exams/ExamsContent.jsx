import { Card, CardBody, CardHeader, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useExamDetails from './hooks/useExamDetails';

export default function ExamsContent() {
    const { examId } = useParams();
    const {
        examDetails,
        loading,
        error
    }= useExamDetails({ examId });
    console.log("Exam Details:", examDetails);
  return (
    <Col className="w-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Card className="mt-4">
        <Card.Header className='bg-primary text-white'>
          <h4>📚 Exam Info</h4>
        </Card.Header>
        <Card.Body>
          <p>Exams will be listed here.</p>
        </Card.Body>
      </Card>
    </Col>
    
  )
}
