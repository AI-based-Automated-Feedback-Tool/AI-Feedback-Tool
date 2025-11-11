import { Card, Row, Col, Button, Badge, Form } from "react-bootstrap";
import '../../../../css/questionCreation/AIGeneratedQuestions.css';
export default function AIGeneratedEssayQuestions({ questions, onCheck, checkedQuestions, onSaveChecked, error, hasReachedLimit}) {
  return (
    <div className="glass-card mt-5 overflow-visible">
      <div className="gradient-header">
        <h4>
          <i className='fas fa-brain me-2'></i>
          Generated Questions by AI
        </h4>
      </div>

      <div className="p-4">
        <p className="text-muted small mb-4">
          Select the questions you want to add to your exam.
        </p>

        {questions && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div 
                key={idx} 
                className="d-flex align-items-start gap-3"
              >
                <div
                  className="custom-checkbox mt-1"
                  onClick={() => onCheck(idx)}
                >
                  <input
                    type="checkbox"
                    className="d-none"
                    checked={!!checkedQuestions[idx]}
                    readOnly
                  />
                  <i className={`fas ${checkedQuestions[idx] ? 'fa-check-square text-primary' : 'fa-square'} fa-lg`}></i>
                </div>
                {/* Question Card */}
                <div className="glass-card flex-grow-1 hover-lift">
                  <div className="p-3">
                    <div className="fw-bold fs-5 mb-3 text-dark">
                      {q.question_text}
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <Badge bg="info" pill>Word Limit: {q.word_limit}</Badge>
                      <Badge bg="success" pill>Points: {q.points}</Badge>
                    </div>

                    {q.grading_note && (
                      <p className="text-muted small mb-0">
                        <strong>Note:</strong> {q.grading_note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {
            <div className="info-banner mt-3 mx-3">
                <i className="fas fa-edit me-2"></i>
                <span>You can edit points for each question after adding them to the exam.</span>
            </div>
        }

        <div className="text-end mt-5" >
          <button 
            type="button"
            className="action-btn action-btn-lg"
            onClick={onSaveChecked} 
          >
            <i className="fas fa-plus me-2"></i>
            Add Questions to the Exam
          </button>
        </div>
        
        {error.saving && (
          <div className="error-alert mt-3 text-center">
            <i className="fas fa-exclamation-triangle icon"></i>
            {error.saving}
          </div>
        )}
      </div>
    </div>
  );
}
