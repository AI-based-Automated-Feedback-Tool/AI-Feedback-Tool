import React from 'react'
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import useFetchLanguages from "./hooks/useFetchLanguages";

export default function CodeQuestionForm({setError, selectedLanguage, setSelectedLanguage}) {
    const [testCases, setTestCases] = React.useState([{ input: "", output: "" }]);
    const {languages, loading} = useFetchLanguages(setError);

    const addTestCase = () => {
        setTestCases([...testCases,{input: "", output: ""}])
    }
  return (
    <Card>
        <Card.Header className='bg-primary text-white'>
            <h4>📝 Create Code Questions</h4>
        </Card.Header>
        <Card.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Question Description*</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={2} className="fs-6"
                        placeholder='Enter your question here...'
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Function Signature*</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={2} className="fs-6"
                        placeholder='Enter the function signature here...'
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Wrapper code*</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={2} className="fs-6"
                        placeholder='Enter the wrapper code here...'
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Test Cases *</Form.Label>
                    {testCases.map((testCase, index) => (
                        <Row className='mb-2' key={index}>
                            <Col>
                                <Form.Control 
                                    placeholder='Input'
                                    value={testCase.input}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    placeholder='Output'
                                    value={testCase.output}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button variant="outline-secondary" onClick={addTestCase}>+</Button>
                            </Col>
                        </Row>
                    ))}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Programming Language *</Form.Label>
                        <Form.Select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {languages.map((language) => (
                                <option key={language.id} value={language}>
                                    {language.language_name}
                                </option>
                            ))}
                        </Form.Select>
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
