import { Card, CardBody, CardHeader, Col, Badge , ListGroup, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useExamDetails from './hooks/useExamDetails';
import EditExam from './components/EditExam';

export default function ExamsContent() {
    const { examId } = useParams();
    const {
        examDetails,
        loading,
        error,
        formatDateTime,
        handleEditExam,
        showEditExam,
        closeEditExam
    }= useExamDetails({ examId });
    console.log("Exam Details:", examDetails);

    // function to get only file name from URL
    const getFileName = (url) => {
      const fileNameWithTimestamp = url ? url.split('/').pop() : null;
      if (fileNameWithTimestamp) {
        const spaceLessFileName = fileNameWithTimestamp.substring(fileNameWithTimestamp.indexOf('_') + 1);
        const trimmedName = spaceLessFileName.replace(/%20/g, ' ')
        return trimmedName;                  
      } 
    }

  return (
    <Col className="w-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Card className="mt-4">
        <Card.Header className='bg-primary text-white'>
          <h4>📚 Exam Info - {examDetails?.title}</h4>
        </Card.Header>
        <Card.Body>
          <>
            <div className="d-flex justify-content-end ">
              <Button variant="outline-primary" size="sm" className='mb-3' onClick={() => handleEditExam(examId)}>
                ✏️ Edit Exam
              </Button>
            </div>
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

            {examDetails?.type === 'essay' && (
              <ListGroup variant="flush">
                {examDetails?.questions?.map((q, index) => (
                  <ListGroup.Item key={q.question_id} className="mb-3">
                    <strong>Q{index + 1}:</strong> {q.question_text}
                    <p className="mt-2"><strong>Word Limit:</strong> {q.word_limit}</p>
                    {q.grading_note && <p><strong>Grading Note:</strong> {q.grading_note}</p>}
                    {q.attachment_url && (
                      <div className="mt-2">
                        <p><strong>Attachment:</strong> {getFileName(q.attachment_url)}</p>
                      </div>
                    )}
                    <p><strong>Points:</strong> {q.points}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </>
          <EditExam
            examId={examId}
            show={showEditExam}
            handleClose={() =>  closeEditExam()}
          />
        </Card.Body>
      </Card>
    </Col>

  )
}
