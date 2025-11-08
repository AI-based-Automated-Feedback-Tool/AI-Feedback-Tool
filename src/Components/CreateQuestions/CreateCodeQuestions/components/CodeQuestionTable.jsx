import '../../../../css/questionCreation/QuestionTable.css'
import { useState } from 'react';

export default function CodeQuestionTable({questions, onDelete, onEdit}) {
  const [expandedTestCases, setExpandedTestCases] = useState({});

  const toggleTestCases = (idx) => {
    setExpandedTestCases(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };
  return (
    <div className='question-table-wrapper'>
      <table className='modern-table'>
        <thead>
          <tr>
            <th>#</th>
            <th >Question</th>
            <th>Function signature</th>
            <th>Wrapper code</th>
            <th>Test cases</th>
            <th>Programming language</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => {
            const fullQuestion = q.question;
            const fullSignature = q.functionSignature;
            const fullWrapper = q.wrapperCode;
            
            return (
              <tr key={idx}>
                <td>
                  <strong>
                    {idx + 1}
                  </strong>
                </td>
                {/* question */}
                <td 
                  className="truncate-cell"
                  data-full={fullQuestion}
                  title={fullQuestion}
                >
                  {fullQuestion}
                </td>

                {/* function signature */}
                <td 
                  className="truncate-cell"
                  data-full={fullSignature}
                  title={fullSignature}
                >
                  <code className="code-inline">{fullSignature}</code>
                </td>

                {/* wrapper code */}
                <td 
                  className="truncate-cell"
                  data-full={fullWrapper}
                  title={fullWrapper}
                >
                  <code className="code-inline">{fullWrapper}</code>
                </td>

                {/* test cases */}
                <td className="test-cases-cell">
                  <button
                    className="btn-toggle-testcases"
                    onClick={() => toggleTestCases(idx)}
                  >
                    <i className={`fas fa-chevron-${expandedTestCases[idx] ? 'up' : 'down'}`}></i>
                    {q.testCases.length} case{q.testCases.length !== 1 ? 's' : ''}
                  </button>

                  {expandedTestCases[idx] && (
                    <div className="test-cases-dropdown">
                      <table className="test-cases-mini-table">
                        <thead>
                          <tr>
                            <th>Input</th>
                            <th>Expected Output</th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.testCases.map((tc, tIdx) => (
                            <tr key={tIdx}>
                              <td>
                                <code className="test-code">{tc.input}</code>
                              </td>
                              <td>
                                <code className="test-code text-success">{tc.output}</code>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </td>

                {/* programming language */}
                <td>
                  <span className='badge bg-success'>
                    {q.language.language_name}
                  </span>
                </td>

                {/* points */}
                <td>
                  <span className="badge bg-gradient-primary">
                    {q.points || '-'} 
                  </span>
                </td>

                {/* actions */}
                <td>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <button 
                      className="action-btn-sm btn-delete"
                      onClick={() => onDelete(idx)}
                    >
                      <i className="fas fa-trash action-icon"></i> Delete
                    </button>
                    <button
                      className="action-btn-sm btn-edit"
                      onClick={() => onEdit(idx)}
                    >
                      <i className="fas fa-edit action-icon"></i> Edit
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
