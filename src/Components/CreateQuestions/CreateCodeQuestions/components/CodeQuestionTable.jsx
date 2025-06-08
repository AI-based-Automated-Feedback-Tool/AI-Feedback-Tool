import React from 'react'
import { Table, Button } from 'react-bootstrap';

export default function CodeQuestionTable({questions}) {
  return (
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr>
            <th>#</th>
            <th className="text-center">Question</th>
            <th className="text-center">Function signature</th>
            <th className="text-center">Wrapper code</th>
            <th className='text-center'>Test cases</th>
            <th className="text-center">Programming language</th>
            <th className="text-center">Points</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{q.question}</td>
            <td>{q.functionSignature}</td>
            <td>{q.wrapperCode}</td>
            <td>
                <Table size="sm" bordered>
                  <thead>
                    <tr>
                      <th>Input</th>
                      <th>Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.testCases.map((testCase, tIdx) => (
                      <tr key={tIdx}>
                        <td>{testCase.input}</td>
                        <td>{testCase.output}</td>
                      </tr>
                    ))}
      </tbody>
    </Table>
            </td>
            <td>{q.language}</td>
            <td>{q.points}</td>
            <td>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <Button 
                        variant="danger" 
                        size="sm" 
                        className="flex-grow-1 flex-md-grow-0"
                    >
                        Delete
                    </Button>
                    <Button
                        variant="warning" 
                        size="sm" 
                        className="flex-grow-1 flex-md-grow-0"
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
