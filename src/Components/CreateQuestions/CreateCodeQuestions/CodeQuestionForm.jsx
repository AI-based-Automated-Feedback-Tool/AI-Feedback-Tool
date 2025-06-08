import React from 'react'
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import useFetchLanguages from "./hooks/useFetchLanguages";
import { useState } from 'react';

export default function CodeQuestionForm({setError, onAddQuestion}) {
    const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
    const {languages, loading} = useFetchLanguages(setError);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [questionDescription, setQuestionDescription] = useState("");
    const [functionSignature, setFunctionSignature] = useState("");
    const [wrapperCode, setWrapperCode] = useState("");
    const [points, setPoints] = useState(1);

    const addTestCase = () => {
        setTestCases([...testCases,{input: "", output: ""}])
    }

    const handleAddQuestion = () => {
        // Validate and submit the question
        if (!questionDescription.trim()) {
            setError("Question description is required.");
            return;
        }
        if (!functionSignature.trim()) {
            setError("Function signature is required.");
            return;
        }
        if (!wrapperCode.trim()) {
            setError("Wrapper code is required.");
            return;
        }
        if (testCases.length === 0){
            setError("At least one test case is required.");
            return;
        }
        if (testCases.some(testCase => !testCase.input.trim() || !testCase.output.trim())) {
            setError("All test cases must have both input and output.");
            return;
        }
        if (!selectedLanguage) {
            setError("Please select a programming language.");
            return;
        }

        //Clear error if everything is valid
        setError(null);

        const newQuestion = {
            question: questionDescription,
            functionSignature: functionSignature,
            wrapperCode: wrapperCode,
            testCases: testCases,
            language: selectedLanguage,
            points: points
        }
        onAddQuestion(newQuestion);

        // Reset form fields
        setQuestionDescription("");
        setFunctionSignature("");
        setWrapperCode("");
        setTestCases([{ input: "", output: "" }]);
        setSelectedLanguage(null);
        setPoints(1);
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
                        value={questionDescription}
                        onChange={(e) => setQuestionDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Function Signature*</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={2} className="fs-6"
                        placeholder='Enter the function signature here...'
                        value={functionSignature}
                        onChange={(e) => setFunctionSignature(e.target.value)}  
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Wrapper code*</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={2} className="fs-6"
                        placeholder='Enter the wrapper code here...'
                        value={wrapperCode}
                        onChange={(e) => setWrapperCode(e.target.value)}
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
                                    onChange={(e) => {
                                        const newTestCase = [...testCases];
                                        newTestCase[index].input = e.target.value
                                        setTestCases(newTestCase)
                                    } }
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    placeholder='Output'
                                    value={testCase.output}
                                    onChange={(e) => {
                                        const newTestCase = [...testCases];
                                        newTestCase[index].output = e.target.value
                                        setTestCases(newTestCase)
                                    } }
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
                            value={selectedLanguage?.id || ""}
                            onChange={(e) => {
                                const selectedLang = languages.find(lang => String(lang.id) === e.target.value);
                                setSelectedLanguage(selectedLang);
                            }}
                        >
                            {languages.map((language) => (
                                <option key={language.id} value={language.id}>
                                    {language.language_name}
                                </option>
                            ))}
                        </Form.Select>
                </Form.Group>

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
                </Form.Group>

                {/* Submit Button */}
                <div className="d-flex justify-content-end" onClick={handleAddQuestion} >
                    <Button variant="primary" >
                        ➕ Save Question
                    </Button>
                </div>

            </Form>
        </Card.Body>
    </Card>
  )
}
