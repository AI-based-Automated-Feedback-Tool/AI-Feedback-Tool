import React from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { useState } from 'react';
import useFetchLanguages from '../hooks/useFetchLanguages';
import { useEffect } from 'react';
import useCodeQuestionForm from '../hooks/useCodeQuestionForm';

export default function EditCodeQuestion({show, handleClose, questionDetails, handleSaveChanges}) {
    const {
        questionDescription, 
        setQuestionDescription, 
        functionSignature, 
        setFunctionSignature, 
        wrapperCode, 
        setWrapperCode, 
        testCases, 
        setTestCases, 
        selectedLanguage, 
        setSelectedLanguage,
        points,
        setPoints,
        addTestCase,
        setErrors,
        errors,
        validate,
        resetForm
    } = useCodeQuestionForm();

    const {languages, loading} = useFetchLanguages(setErrors);    

    useEffect(() => {
        if (questionDetails) {
        setQuestionDescription(questionDetails.question);
        setFunctionSignature(questionDetails.functionSignature);
        setWrapperCode(questionDetails.wrapperCode);
        setTestCases(questionDetails.testCases);
        setSelectedLanguage(questionDetails.language);
        setPoints(questionDetails.points);
        }
    }, [questionDetails]);

    const manageSaveChanges = () => {
        const isValid = validate();
        if (!isValid) {
            return;
        }

        const updatedQuestion = {
            question: questionDescription,
            functionSignature: functionSignature,
            wrapperCode: wrapperCode,
            testCases: testCases,
            language: selectedLanguage,
            points: points,
        }
        handleSaveChanges(updatedQuestion);

        // Reset form fields    
        resetForm();
    }

    return (
    <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={questionDescription}
                    onChange={(e) => setQuestionDescription(e.target.value)}
                />
                {errors.question && <div className="text-danger small">{errors.question}</div>}
            </Form.Group>
        
            <Form.Group className="mb-3">
                <Form.Label>Function signature</Form.Label>
                <Form.Control
                    type="text"
                    value={functionSignature}
                    onChange={(e) => setFunctionSignature(e.target.value)}
                />
                {errors.functionSignature && <div className="text-danger small">{errors.functionSignature}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Wrapper code</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={wrapperCode}
                    onChange={(e) => setWrapperCode(e.target.value)}
                />
                {errors.wrapperCode && <div className="text-danger small">{errors.wrapperCode}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Test cases</Form.Label>
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
                {errors.testCases && <div className="text-danger small">{errors.testCases}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Programming language</Form.Label>
                <Form.Select
                    value={selectedLanguage ? selectedLanguage.id : ''}
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
                {errors.language && <div className="text-danger small">{errors.language}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                />
                {errors.points && <div className="text-danger small">{errors.points}</div>}
            </Form.Group>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={manageSaveChanges}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
  )
}