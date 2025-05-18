import React from 'react'
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState } from 'react';

export default function McqQuestionForm() {
    // State to manage answer options and set their values
    const [answerOptions, setAnswerOptions] = useState(["","","",""])
    const handleAnswerOptionsChange = (e, index) => {
        const latestAnswerOptions = [...answerOptions];
        latestAnswerOptions[index] = e.target.value;
        setAnswerOptions(latestAnswerOptions)
    }

    // State to manage correct answers,Toggle checkbox for correct answers and remove if already selected
    const [correctAnswers, setCorrectAnswers] = useState([]);
    // Toggle checkbox for correct answers
    const handleCheckboxChange = (value) => {
        if (correctAnswers.includes(value)) {
            setCorrectAnswers(correctAnswers.filter(ans => ans !== value));
        } else {
            setCorrectAnswers([...correctAnswers, value]);
        }
    };
      
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
                    <Form.Control as="textarea" rows={3} className="fs-6"/>
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
                </Form.Group>

                {/* No of answers */}
                <Form.Group className="mb-3">
                    <Form.Label>No of answers</Form.Label>
                    <Form.Select  >
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
                    </Form.Group>
                )}                
            </Form>
        </Card.Body>
    </Card>
  )
}
