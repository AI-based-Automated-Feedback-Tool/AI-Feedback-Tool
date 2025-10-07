import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import useMcqQuestionForm from "./hooks/useMcqQuestionForm";

export default function ManualMcqQuestionCreation({onSave, warning, disabled}) {
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
    } = useMcqQuestionForm(onSave);

  return (
    <Form>
        {warning && <Alert variant="warning">{warning}</Alert>}
        {/* Question */}
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Question *</Form.Label>
            <Form.Control 
                as="textarea" 
                rows={3} className="fs-6" 
                value={questionText} 
                onChange={e => setQuestionText(e.target.value)}
                placeholder='Enter your question here...'
            />
            {errors.question && <div className="text-danger small">{errors.question}</div>}
        </Form.Group>

        {/* Answer Options */}
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Answer Options *</Form.Label>
            <Row>
                {answerOptions.map((option, index) => (
                    <Col key={index} md={6} xs={12}>
                        <Form.Control 
                            className='mb-2' 
                            placeholder= {`Option ${index+1}`} 
                            onChange={(e) => handleAnswerOptionsChange(e,index)} 
                            value= {option}
                        />
                    </Col>
                ))}
            </Row>
            {errors.answers && <div className="text-danger small">{errors.answers}</div>}
        </Form.Group>

        {/* No of answers */}
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">No of answers *</Form.Label>
            <Form.Select  
                value={numOfAnswers} 
                onChange={e => handleNumOfAnswersChange(e)}
            >
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
            </Form.Select>
        </Form.Group>  

        {/* Correct Answers Checkbox */}
        {answerOptions.filter(opt => opt.trim() !== "").length > 0 && (
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Select Correct Answer(s) *</Form.Label>
            {answerOptions.map((opt, idx) =>
                opt.trim() && (
                    <Form.Check
                        key={idx}
                        type="checkbox"
                        label={opt}
                        value={opt}
                        checked={correctAnswers.includes(opt)}
                        onChange={() => handleCheckboxChange(opt)}
                    />
                )
            )}                    
            {errors.correct && <div className="text-danger small">{errors.correct}</div>}
        </Form.Group>
        )}  

        {/* Points for the Question */}
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Number of points *</Form.Label>
            <Form.Control
                type="number"
                min="1"
                placeholder="Enter points for this question"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                required
            />
            {errors.points && <div className="text-danger small">{errors.points}</div>}
        </Form.Group>    

        {/* Submit Button */}
        <div className="d-flex justify-content-end" onClick={handleAddQuestion}>
            <Button variant="primary" disabled={disabled}>
                ➕ Save Question
            </Button>
        </div>          
    </Form>
  )
}