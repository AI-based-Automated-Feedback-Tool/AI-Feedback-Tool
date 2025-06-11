import React from 'react'
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";


export default function EssayQuestionForm({ formState }) {
    const {
        questionText,
        attachments,
        wordLimit,
        points,
        gradingNotes,
        setQuestionText,
        setAttachments, 
        setWordLimit,
        setPoints,
        setGradingNotes 
    }= formState;

  return (
    <Card>
        <Card.Header className='bg-primary text-white'>
            <h4>Essay Question</h4>
        </Card.Header>
        <Card.Body>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label className='fw-bold'>Question *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter your essay question here..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label className='fw-bold'>Attachments</Form.Label>
                    <Form.Control 
                        type="file" 
                        onChange={(e) => setAttachments(e.target.files[0])}
                    />
                </Form.Group>

                <Row className='mb-3'>
                    <Col>
                        <Form.Group>
                            <Form.Label className='fw-bold'>Word Limit</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter the word limit" 
                                value={wordLimit}
                                onChange={(e) => setWordLimit(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className='fw-bold'>Points *</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter points" 
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className='mb-3'>
                    <Form.Label className='fw-bold'>Grading Notes *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter any specific instructions for the essay question evaluation..."
                        value={gradingNotes}
                        onChange={(e) => setGradingNotes(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Submit Button */}
                <div className="d-flex justify-content-end" >
                    <Button variant="primary" >
                        ➕ Save Question
                    </Button>
                </div>   
            </Form>
        </Card.Body>
    </Card>
  )
}
