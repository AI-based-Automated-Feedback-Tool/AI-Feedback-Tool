import { Table, Button } from 'react-bootstrap';

export default function EssayQuestionTable({questions, onDelete, onEdit}) {
  return (
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr>
            <th>#</th>
            <th className="text-center">Question</th>
            <th className="text-center">Attachment</th>
            <th className="text-center">Word Limit</th>
            <th className='text-center'>Points</th>
            <th className="text-center">Grading Notes</th>
            <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{q.question_text}</td>
            <td>{q.attachment_url}</td>
            <td>{q.word_limit}</td>
            <td>{q.points}</td>
            <td>{q.grading_note}</td>
            
            <td>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <Button 
                        variant="danger" 
                        size="sm" 
                        className="flex-grow-1 flex-md-grow-0"
                        onClick={() => onDelete(idx)}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="warning" 
                        size="sm" 
                        className="flex-grow-1 flex-md-grow-0"
                        onClick={() => onEdit(idx)}
                    >
                        Edit
                    </Button>
                </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
