import React from 'react'
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState } from 'react';
import { Table } from 'react-bootstrap';

export default function McqQuestionForm({onSave}) {
    const [questionText, setQuestionText] = useState("");
    const [answerOptions, setAnswerOptions] = useState(["","","",""])
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [numOfAnswers, setNumOfAnswers] = useState(1);
    const [points, setPoints] = useState("");
    const [errors, setErrors] = useState({});

    // Set answer options
    const handleAnswerOptionsChange = (e, index) => {
        const latestAnswerOptions = [...answerOptions];
        latestAnswerOptions[index] = e.target.value;
        setAnswerOptions(latestAnswerOptions)
    }

    // Toggle checkbox for correct answers and remove if already selected
    const handleCheckboxChange = (value) => {
        if (correctAnswers.includes(value)) {
            setCorrectAnswers(correctAnswers.filter(ans => ans !== value));
        } else {
            setCorrectAnswers([...correctAnswers, value]);
        }
    };

    //Set number of answers
    const handleNumOfAnswersChange = (e) => {
        const enteredValue = parseInt(e.target.value);
        setNumOfAnswers(enteredValue);
    }

    // Form validation before submission
    const handleAddQuestion = () => {
        const trimmedAnswers = answerOptions.map(opt => opt.trim());
        const newErrors = {};

        if (!questionText.trim()) newErrors.question = "Question is required.";
        if (trimmedAnswers.includes("")) {
            newErrors.answers = "All answer options must be filled.";
        }
        if (!points || isNaN(points) || parseInt(points) < 1) {
            newErrors.points = "Points must be at least 1.";
        }
        if (correctAnswers.length !== parseInt(numOfAnswers)) {
            newErrors.correct = `Select exactly ${numOfAnswers} correct answer(s).`;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0){
            const newQuestion = {
                question: questionText,
                answers: trimmedAnswers,
                numOfAnswers: numOfAnswers,
                correctAnswers: correctAnswers,
                points: points
            }
            onSave( newQuestion);

            // Reset form fields
            setQuestionText("");
            setAnswerOptions(["", "", "", ""]);
            setCorrectAnswers([]);
            setNumOfAnswers(1);
            setPoints("");
            setErrors({});
        }
    }
    
      
  return (
    <Card>
        <Card.Header className="bg-primary text-white">
            <h4>📝 Create MCQ Questions</h4>
        </Card.Header>
        <Card.Body>
            <Form>
                {/* Question */}
                <Form.Group className="mb-3">
                    <Form.Label>Question</Form.Label>
                    <Form.Control as="textarea" rows={3} className="fs-6" value={questionText} onChange={e => setQuestionText(e.target.value)}/>
                    {errors.question && <div className="text-danger small">{errors.question}</div>}
                </Form.Group>

                {/* Answer Options */}
                <Form.Group className="mb-3">
                    <Form.Label >Answer Options</Form.Label>
                    <Row>
                        {answerOptions.map((option, index) => (
                            <Col key={index} md={6} xs={12}>
                                <Form.Control className='mb-2' placeholder= {`Option ${index+1}`} onChange={(e) => handleAnswerOptionsChange(e,index)} value= {option}/>
                            </Col>
                        ))}
                    </Row>
                    {errors.answers && <div className="text-danger small">{errors.answers}</div>}
                </Form.Group>

                {/* No of answers */}
                <Form.Group className="mb-3">
                    <Form.Label>No of answers</Form.Label>
                    <Form.Select  value={numOfAnswers} onChange={e => handleNumOfAnswersChange(e)}>
                        <option value="1">01</option>
                        <option value="2">02</option>
                        <option value="3">03</option>
                        <option value="4">04</option>
                    </Form.Select>
                </Form.Group>  

                {/* Correct Answers Checkbox */}
                {answerOptions.filter(opt => opt.trim() !== "").length > 0 && (
                    <Form.Group className="mb-3">
                        <Form.Label>Select Correct Answer(s)</Form.Label>
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
                    <Form.Label>Number of points </Form.Label>
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
                    <Button variant="primary" >
                        ➕ Save Question
                    </Button>
                </div>          
            </Form>
        </Card.Body>
    </Card>
  )
}
