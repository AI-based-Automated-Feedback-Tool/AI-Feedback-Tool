import React from 'react'
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

export default function McqQuestionForm() {
    
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
                        <Col>
                            <Form.Control className="mb-2" placeholder="Option A" />
                        </Col>
                        <Col>
                            <Form.Control className="mb-2" placeholder="Option B" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control className='mb-2' placeholder="Option C" />
                        </Col>
                        <Col>
                            <Form.Control className='mb-2' placeholder="Option D" />
                        </Col>
                    </Row>
                </Form.Group>

                
            </Form>
        </Card.Body>
    </Card>
  )
}
