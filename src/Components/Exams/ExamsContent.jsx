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

          <hr />
          <h5 className="mt-4">📝 Questions ({examDetails?.questions.length})</h5>
          
          {examDetails?.type === 'mcq' && (
            <ListGroup variant="flush">
              {examDetails?.questions?.map((q, index) => (
                <ListGroup.Item key={q.question_id} className="mb-3">
                  <strong>Q{index + 1}:</strong> {q.question_text}
                  <div className="mt-2">
                    {q.options.map((option, i) => {
                      const isCorrect = q.answers.includes(option);
                      return (
                        <div key={i} className={`px-2 py-1 rounded mb-1 ${isCorrect ? 'bg-success text-white' : 'bg-light'}`}>
                          {String.fromCharCode(65 + i)}. {option}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <small>
                      Points: <strong>{q.points}</strong> | Correct Answer(s): <strong>{q.no_of_correct_answers}</strong>
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {examDetails?.type === 'code' && (
            <ListGroup variant="flush">
              {examDetails?.questions?.map((q, index) => (
                <ListGroup.Item key={q.question_id} className="mb-3">
                  <strong>Q{index + 1}:</strong> {q.question_description}
                  <p className="mb-1 mt-2 "><strong>Function Signature:</strong></p>
                  <pre className="bg-light p-2 mt-2"><code>{q.function_signature}</code></pre>
                  <p className="mb-1"><strong>Wrapper Code:</strong></p>
                  <pre className="bg-secondary text-white p-2 rounded"><code>{q.wrapper_code}</code></pre>
                  <p><strong>Points:</strong> {q.points}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Col>
    
  )
}
