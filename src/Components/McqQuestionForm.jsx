import React from 'react'
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState } from 'react';

export default function McqQuestionForm() {
    // State to manage answer options and set their values
    const [answerOPtions, setAnswerOptions] = useState(["","","",""])
    const handleAnswerOptionsChange = (e, index) => {
        const latestAnswerOptions = [...answerOPtions];
        latestAnswerOptions[index] = e.target.value;
        setAnswerOptions(latestAnswerOptions)
    }
      
  return (
    <Card>
        <Card.Header className="bg-primary text-white">
            <h4>📝 Create MCQ Questions</h4>
        </Card.Header>
        <Card.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Question</Form.Label>
                    <Form.Control as="textarea" rows={3} className="fs-6"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label >Answer Options</Form.Label>
                    <Row>
                        {answerOPtions.map((option, index) => (
                            <Col key={index} md={6} xs={12}>
                                <Form.Control className='mb-2' placeholder= {`Option ${index+1}`} onChange={(e) => handleAnswerOptionsChange(e,index)} value= {option}/>
                            </Col>
                        ))}
                    </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Question Type</Form.Label>
                    <Form.Select>
                        <option value="mcq">Radio button</option>
                        <option value="code">Check box</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>No of answers</Form.Label>
                    <Form.Select  >
                        <option value="1">01</option>
                        <option value="2">02</option>
                        <option value="3">03</option>
                        <option value="4">04</option>
                    </Form.Select>
                </Form.Group>                  
            </Form>
        </Card.Body>
    </Card>
  )
}
