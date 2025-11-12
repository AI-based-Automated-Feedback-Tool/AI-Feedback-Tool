import { Row, Col } from "react-bootstrap";
import '../../../css/questionCreation/McqCreation.css';
import '../../../css/questionCreation/AIGeneratedQuestions.css';

export default function AIGeneratedQuestions({ questions, checkedQuestions, onCheck, onSaveChecked, errors }) {
  
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

        {questions && questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={index} className="d-flex align-items-start gap-3">
                {/* Custom Checkbox */}
                <div
                  className="custom-checkbox mt-1"
                  onClick={() => onCheck(index)}
                >
                  <input
                    type="checkbox"
                    className="d-none"
                    checked={!!checkedQuestions[index]}
                    readOnly
                  />
                  <i className={`fas ${checkedQuestions[index] ? 'fa-check-square text-primary' : 'fa-square'} fa-lg`}></i>
                </div>
                {/* Question Card */}
                <div className="glass-card flex-grow-1 hover-lift">
                  <div className="p-3">
                    <div className="fw-bold fs-5 mb-3 text-dark">
                      {q.question}
                    </div>

                    {/* Choices */}
                    <Row className="g-3">
                      {q.choices.map((choice, idx) => (
                        <Col key={idx} md={6} xs={12}>
                          <div 
                            className={`choice-pill p-3 rounded-3 text-center fw-medium ${
                              choice === q.correct_answer
                                ? 'choice-correct text-white'
                                : 'choice-normal'
                            }`}
                          >
                            {choice}
                            {choice === q.correct_answer && (
                              <i className="fas fa-check ms-2"></i>
                            )}
                          </div>
                        </Col>
                      ))}
                    </Row>

                    {/* Points */}
                    {q.points && (
                      <div className='mt-3'>
                        <span className="badge bg-gradient-primary">
                          <i className="fas fa-coins me-1"></i>
                          Points: {q.points}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          ):(
            <p className="text-muted text-center py-5">
            No questions generated yet. Try generating some above!
          </p>
        )}

      {/* Add Questions Button */}
      <div className="text-end mt-5">
        <button 
          type="button" 
          className="action-btn action-btn-lg"
          onClick={onSaveChecked}
        >
          <i className="fas fa-plus me-2"></i>
          Add Questions to the Exam
        </button>
      </div>
      
      {errors.aiQuestionsCount && (
        <div className="error-alert mt-3 text-center">
          <i className="fas fa-exclamation-triangle icon"></i>
          {errors.aiQuestionsCount}
        </div>
      )}
    </div>
  </div>
  );
}
