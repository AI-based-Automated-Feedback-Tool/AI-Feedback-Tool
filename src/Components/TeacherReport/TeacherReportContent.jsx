import React from 'react'
import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export default function TeacherReportContent() {
  return (
    <Col 
        className="w-100 " 
        style={{ backgroundColor: '#f8f9fa' }}
    >
        <Card className="mt-4">
            <CardHeader className='bg-primary text-white '>
                <h4>📋 Teacher Report</h4>
            </CardHeader>
            <CardBody>
                <Card className="mb-4 border-0 shadow-sm">
                    <CardHeader>
                        <h5 className="mb-0">Search Criteria</h5>
                    </CardHeader>
                    <CardBody>
                        <Row className="mb-2 mb-md-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        Course ID *
                                    </Form.Label>
                                    <Form.Select
                                        value={""}
                                        onChange={""}
                                    >
                                        <option value="">
                                            Select a course
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        Exam Title *
                                    </Form.Label>
                                    <Form.Select
                                        value={""}
                                        onChange={""}
                                    >
                                        <option value="">
                                            Select an exam
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mb-2 mb-md-3'>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        Student name 
                                    </Form.Label>
                                    <Form.Select
                                        value={""}
                                        onChange={""}
                                    >
                                        <option value="">
                                            Select a student
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                        </Row>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="mt-2 mt-md-3"
                        >
                            Generate Report
                        </Button>
                    </CardBody>
                </Card>

                <Card className="mb-4 border-0 shadow-sm">
                    <CardBody>
                        {/*Here shows the text which says no contents to preview */}
                        <Alert variant="info">
                            <p className="mb-0">
                                No report available to preview. Please select the criteria and generate a report.
                            </p>
                        </Alert>
                    </CardBody>

                </Card>

            </CardBody>
        </Card>
    </Col>
  )
}
