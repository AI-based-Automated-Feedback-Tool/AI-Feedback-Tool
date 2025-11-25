import { Form, Row, Col, Badge } from 'react-bootstrap';
import '../../../css/EditExam/EditMcqQuestionCollection.css';

export default function EditMcqQuestionCollection({questions, setQuestions}) {

  return (
    <>
      {questions.map((q, index) => {
        const answers = Array.isArray(q.answers) ? q.answers : [];

        return (
          <div key={q.question_id} className="mcq-question-card mb-5">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h5 className="question-number">
                <i className="fas fa-circle-question text-primary me-3"></i>
                Question {index + 1}
              </h5>
              <Badge bg="info" className="fs-6 px-3 py-2">
                {q.points || 0} pts
              </Badge>
            </div>
          
          {/* Question Text */}
          <div className="mb-4">             
            <Form.Group controlId={`question-text-${q.question_id}`}>
              <Form.Label className="fw-semibold text-indigo">
                Question Text
              </Form.Label>
              <Form.Control
                as="textarea"
                value={q.question_text}
                rows={3}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].question_text = e.target.value;
                    console.log('Updated Question Text:', updated[index].question_text);
                  setQuestions(updated);
                }}
                className='question-textarea'
              />
            </Form.Group>

            {/* Options A-D */}
            <div className="options-section">
              <Form.Label className="section-title">Options</Form.Label>

              <div className="options-list">
                {['A', 'B', 'C', 'D'].map((label, i) => {
                  const opt = q.options[i] || '';
                  const isCorrect = q.answers?.includes(opt);

                  return (
                    <div key={i} className={`option-item ${isCorrect ? 'is-correct' : ''}`}>
                      {/* Hidden checkbox — only for functionality */}
                      <Form.Check
                        type="checkbox"
                        className="sr-only"
                        checked={isCorrect}
                        onChange={() => {
                          const updated = [...questions];
                          const current = updated[index].answers || [];

                          if (current.includes(opt)) {
                            updated[index].answers = current.filter(a => a !== opt);
                          } else if (opt.trim()) {
                            updated[index].answers = [...current, opt];
                          }
                          setQuestions(updated);
                        }}
                      />

                      {/* Custom visible checkbox */}
                      <div
                        className="custom-checkbox"
                        onClick={() => {
                          if (opt.trim()) {
                            const updated = [...questions];
                            const current = updated[index].answers || [];
                            if (current.includes(opt)) {
                              updated[index].answers = current.filter(a => a !== opt);
                            } else {
                              updated[index].answers = [...current, opt];
                            }
                            setQuestions(updated);
                          }
                        }}
                      >
                        {isCorrect && <span className="checkmark">✓</span>}
                      </div>

                      <span className="option-letter">{label}.</span>

                      <Form.Control
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[index].options[i] = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder={`Option ${label}`}
                        className="option-input"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Modern Points & Correct Answers Row */}
              <div className="bottom-bar">
                <div className="score-item">
                  <span className="score-label">Number of Correct Answers</span>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={q.no_of_correct_answers || 1}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].no_of_correct_answers = parseInt(e.target.value) || 1;
                      setQuestions(updated);
                    }}
                    className="modern-number-input"
                  />
                </div>

                <div className="score-item">
                  <span className="score-label">Points</span>
                  <input
                    type="number"
                    min="0"
                    value={q.points || ''}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].points = parseInt(e.target.value) || 0;
                      setQuestions(updated);
                    }}
                    className="modern-number-input"
                  />
                </div>
              </div>
            </div>

            <hr className='question-divider'/>
          </div>
          </div>
        );
      })}
    </>
  );
}
