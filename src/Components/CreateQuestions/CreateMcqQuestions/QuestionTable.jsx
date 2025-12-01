import '../../../css/questionCreation/QuestionTable.css'

export default function QuestionTable({questions, onDelete, onEdit}) {
  return (
    <div className='question-table-wrapper-qcreation'>
      <table className='modern-table-qcreation'>
        <thead>
          <tr>
              <th>#</th>
              <th>Question</th>
              <th>Points</th>
              <th>No of answers</th>
              <th>Answer options</th>
              <th>Correct Answers</th>
              <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => {
            const fullQuestion = q.question;
            const fullAnswers = q.answers.join(", ");
            const fullCorrectAnswers = q.correctAnswers.join(", ");
            
            return (
              <tr key={idx}>
                <td><strong>{idx + 1}</strong></td>
                <td 
                  className="truncate-cell"
                  data-full={fullQuestion}
                  title={fullQuestion}
                >
                  {fullQuestion}
                </td>
                <td>
                  <span className="badge bg-gradient-primary">
                    {q.points || '-'} pts
                  </span>
                </td>
                <td>{q.numOfAnswers || q.answers?.length || "-"}</td>
                <td 
                  className='truncate-cell'
                  data-full={fullAnswers}
                  title={fullAnswers}
                >
                  {fullAnswers}
                </td>
                <td
                  className="truncate-cell text-success fw-bold"
                  data-full={fullCorrectAnswers}
                  title={fullCorrectAnswers}
                >
                  {fullCorrectAnswers}
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <button 
                      className="action-btn-sm btn-delete"
                      onClick={() => onDelete(idx)}
                    >
                      <i className="fas fa-trash action-icon"></i>
                      Delete
                    </button>
                    <button 
                      className="action-btn-sm btn-edit"
                      onClick={() => onEdit(idx)}
                    >
                      <i className="fas fa-edit action-icon"></i>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
