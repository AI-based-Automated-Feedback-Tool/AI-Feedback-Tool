import { Table, Button } from 'react-bootstrap';

export default function EssayQuestionTable({questions, onDelete, onEdit}) {
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
    <div className='question-table-wrapper'>
      <table className='modern-table'>
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
          {questions.map((q, idx) => {
            const fullQuestion = q.question_text;
            
            return (
              <tr key={idx}>
                <td>
                  <strong>
                    {idx + 1}
                  </strong>
                </td>
                <td 
                  className="truncate-cell"
                  data-full={fullQuestion}
                  title={fullQuestion}
                >
                  {q.question_text}
                </td>

                <td>
                  {getFileName(q.attachment_url)}
                </td>
                <td>
                  {q.word_limit}
                </td>
                <td>
                  <span className="badge bg-gradient-primary">
                    {q.points || '-'} pts
                  </span>
                </td>
                <td 
                  className='truncate-cell'
                  data-full={q.grading_note}
                  title={q.grading_note}
                >
                  {q.grading_note}
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
