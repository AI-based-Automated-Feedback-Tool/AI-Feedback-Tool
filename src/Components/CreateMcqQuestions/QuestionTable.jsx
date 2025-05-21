import React from 'react'
import { Table, Button } from 'react-bootstrap';

export default function QuestionTable({questions, onDelete, onEdit}) {
  return (
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr>
            <th>#</th>
            <th className="text-center">Question</th>
            <th className="text-center">Points</th>
            <th className="text-center">No of answers</th>
            <th className='text-center'>Answer options</th>
            <th className="text-center">Correct Answers</th>
            <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{q.question}</td>
            <td>{q.points}</td>
            <td>{q.numOfAnswers}</td>
            <td>{q.answers.join(", ")}</td>
            <td>{q.correctAnswers.join(", ")}</td>
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
