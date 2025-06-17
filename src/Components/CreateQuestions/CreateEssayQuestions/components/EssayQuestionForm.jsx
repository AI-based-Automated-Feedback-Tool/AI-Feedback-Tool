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
        setGradingNotes,
        onSaveQuestion,
        error,
        fileInputRef,
        isDisabled
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
                    {error.questionText && <div className="text-danger small">{error.questionText}</div>}
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label className='fw-bold'>Attachments</Form.Label>
                    <Form.Control 
                        type="file" 
                        accept='.png, .jpg, .jpeg, .pdf, .doc, .mp4, .mp3'
                        onChange={(e) => setAttachments(e.target.files[0])}
                        ref={fileInputRef}
                    />
                    {attachments && <small className="text-muted">Selected: {attachments.name}<span 
                        style={{ color: '#6c757d', cursor: 'pointer', marginLeft: '8px' }} 
                        onClick={() => {
                            setAttachments(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                            }
                        }}
                    >
                        ❌
                    </span></small>}
                    {error.attachments && <div className="text-danger small">{error.attachments}</div>}
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
                            {error.wordLimit && <div className="text-danger small">{error.wordLimit}</div>}
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
                            {error.points && <div className="text-danger small">{error.points}</div>}
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
                    {error.gradingNotes && <div className="text-danger small">{error.gradingNotes}</div>}
                </Form.Group>

                {/* Submit Button */}
                <div className="d-flex justify-content-end" >
                    <Button variant="primary" onClick={onSaveQuestion} disabled={isDisabled()}>
                        ➕ Save Question
                    </Button>
                    
                </div>   
            </Form>
        </Card.Body>
    </Card>
  )
}
