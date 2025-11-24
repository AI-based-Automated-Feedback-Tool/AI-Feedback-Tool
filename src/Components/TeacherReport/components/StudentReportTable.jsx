import { Table } from 'react-bootstrap';
import '../../../css/Reports/StudentReportTable.css';

export default function StudentReportTable({ studentReportTableData, examType }) {
  return (
    <div className="question-table-wrapper">
        <Table className="question-table" hover responsive>
          <thead className="table-light">
            <tr>
              <th className="question-number">#</th>
              <th className="question-text">Question</th>
              <th className="student-answer">Student Answer</th>
              <th className="correct-status">Correct</th>
              <th className="score">Score</th>
            </tr>
          </thead>
          <tbody>
            {studentReportTableData?.map((item, index) => (
              <tr key={index}>
                <td className="question-number">{index + 1}</td>
                <td className="question-text">
                  <div className='question-content'>
                    {examType === 'mcq'
                      ? item.mcq_questions?.question_text
                      : examType === 'essay'
                        ? item.essay_questions?.question_text
                        : examType === 'code'
                          ? item.code_questions?.question_description
                          : null}
                  </div>
                </td>
                <td className="student-answer">
                  <div className='answer-content'>
                    {examType === 'mcq'
                      ? item.student_answer.join(', ')
                      : examType === 'essay'
                        ?item.student_answer?.text
                        : examType === 'code'
                          ? item.student_answer
                          : null}
                  </div>
                </td>
                <td className="correct-status text-center">
                  {item.is_correct ? (
                    <span className="status-badge correct">
                      <i className="fas fa-check me-1"></i> Yes
                    </span>
                  ) : (
                    <span className="text-danger fw-bold">
                      <i className="fas fa-times me-1"></i> No
                    </span>
                  )}
                </td>
                <td className="score">
                  <strong>
                    {item.score}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
  )
}
