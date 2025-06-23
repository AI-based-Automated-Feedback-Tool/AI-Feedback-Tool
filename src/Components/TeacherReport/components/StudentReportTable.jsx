import { Table } from 'react-bootstrap';

export default function StudentReportTable({ studentReportTableData, examType }) {
  return (
    <div className="table-responsive">
        <Table striped bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Student Answer</th>
              <th>Correct</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {studentReportTableData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {examType === 'mcq'
                    ? item.mcq_questions?.question_text
                    : examType === 'essay'
                      ? item.essay_questions?.question_text
                      : examType === 'code'
                        ? item.code_questions?.question_description
                        : null}
                </td>
                <td>
                  {examType === 'mcq'
                    ? item.student_answer.join(', ')
                    : examType === 'essay'
                      ?item.student_answer?.text
                      : examType === 'code'
                        ? item.student_answer
                        : null}
                </td>
                <td>
                  {item.is_correct ? (
                    <span className="text-success fw-bold">✔ Yes</span>
                  ) : (
                    <span className="text-danger fw-bold">✘ No</span>
                  )}
                </td>
                <td>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
  )
}
