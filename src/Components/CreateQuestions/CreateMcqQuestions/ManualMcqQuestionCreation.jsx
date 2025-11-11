import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import useMcqQuestionForm from "./hooks/useMcqQuestionForm";
import '../../../css/questionCreation/McqCreation.css'
import { useId } from "react";
export default function ManualMcqQuestionCreation({onSave, warning, disabled, questionCount, noOfQuestions, loadCount, usageCount}) {
    const {
        questionText, 
        setQuestionText,
        answerOptions,
        correctAnswers,
        numOfAnswers,
        points, 
        setPoints,
        errors,
        handleAddQuestion,
        handleAnswerOptionsChange,
        handleCheckboxChange,
        handleNumOfAnswersChange
    } = useMcqQuestionForm(onSave, questionCount, noOfQuestions, loadCount, usageCount);

    // Generate a unique ID 
    const groupId = useId();

  return (
    <Form className="space-y-6">  
      {warning && (
        <div className="error-alert mb-4">
          <i className="fas fa-exclamation-triangle icon"></i>
            {warning}
        </div>
      )}
      {/* Question */}
      <Form.Group className="form-group" controlId="questionText">
        <Form.Label className="form-label">
          <i className="fas fa-question-circle icon"></i> Question *
        </Form.Label>
        <Form.Control
          as="textarea"
          className="form-textarea"
          rows="3"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          placeholder="Enter your question here..."
        />
        {errors.question && (
          <div className="error-alert">
            <i className="fas fa-exclamation-triangle icon"></i>
            {errors.question}
          </div>
        )}
      </Form.Group>

      {/* Answer Options */}
      <Form.Group className="form-group answer-options-group" >
        <Form.Label className="form-label" htmlFor={`${groupId}-answer-0`}>
          <i className="fas fa-list-ul icon"></i> Answer Options *
        </Form.Label>
        <Row className="g-3">
          {answerOptions.map((option, index) => (
            <Col key={index} md={6} xs={12}>
              <Form.Control
                id={`${groupId}-answer-${index}`}
                name={`answer-${index}`}
                type="text"
                className="form-input"
                placeholder={`Option ${index + 1}`}
                onChange={e => handleAnswerOptionsChange(e, index)}
                value={option}
              />
            </Col>
          ))}
        </Row>
        {errors.answers && (
          <div className="error-alert">
            <i className="fas fa-exclamation-triangle icon"></i>
            {errors.answers}
          </div>
        )}
      </Form.Group>

      {/* No of answers */}
      <Form.Group className="form-group no-answers-group" controlId="numOfAnswers">
        <Form.Label className="form-label">
          <i className="fas fa-hashtag icon"></i> No of Correct Answers *
        </Form.Label>
        <div className="custom-select">
          <Form.Select 
            className="form-select" 
            value={numOfAnswers} 
            onChange={e => handleNumOfAnswersChange(e)}
          >
            <option value="1">01</option>
            <option value="2">02</option>
            <option value="3">03</option>
            <option value="4">04</option>
          </Form.Select>
        </div>
      </Form.Group>
        
      {/* Correct Answers Checkbox */}
      {answerOptions.filter(opt => opt.trim()).length > 0 && (
        <Form.Group className="form-group">
          <Form.Label className="form-label">
            Select Correct Answer(s) *
          </Form.Label>
          <div className="correct-answers-list">
            {answerOptions
              .filter(opt => opt.trim())
              .map((opt, idx) => (
                <Form.Check
                  key={idx}
                  type="checkbox"
                  id={`${groupId}-correct-${idx}`}
                  label={opt}
                  checked={correctAnswers.includes(opt)}
                  onChange={() => handleCheckboxChange(opt)}
                  className="d-flex align-items-center gap-3 mb-2"
                />
              ))}
          </div>
          {errors.correct && (
            <div className="error-alert">
              {errors.correct}
            </div>
          )}
        </Form.Group>
      )}  

      {/* No of Points for the Question */}
      <Form.Group className="form-group no-points-group" controlId="points">
        <Form.Label className="form-label">
          <i className="fas fa-coins icon"></i> Points *
        </Form.Label>
        <Form.Control
          type="number"
          min="1"
          className="form-input"
          value={points}
          onChange={e => setPoints(Number(e.target.value))}
           required
        />
        {errors.points && (
          <div className="error-alert">
            <i className="fas fa-exclamation-triangle icon"></i>
            {errors.points}
          </div>
        )}
      </Form.Group>

      {/* Submit Button */}
      <div className="text-end">
        <button
          type="button"
          className="action-btn"
          onClick={handleAddQuestion}
          disabled={disabled}
        >
          Create Question
        </button>
      </div>
    </Form>
    
  );
}