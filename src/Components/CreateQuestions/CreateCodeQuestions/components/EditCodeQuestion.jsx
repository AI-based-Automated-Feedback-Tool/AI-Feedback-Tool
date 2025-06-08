import React from 'react'
import { Modal, Form, Button  } from 'react-bootstrap'
import { useState } from 'react';

export default function EditCodeQuestion({show, handleClose, questionDetails}) {
  const [questiontext, setQuestionText] = useState(questionDetails.question);  
  const [functionSignature, setFunctionSignature] = useState(questionDetails.functionSignature);
  const [wrapperCode, setWrapperCode] = useState(questionDetails.wrapperCode);
  const [testCases, setTestCases] = useState(questionDetails.testCases);
  const [language, setLanguage] = useState(questionDetails.language);
  const [points, setPoints] = useState(questionDetails.points);
  const [errors, setErrors] = useState({});
    
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
                    value={questiontext}
                    onChange={(e) => setQuestionText(e.target.value)}
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
                    <div key={index} className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Input"
                            value={testCase.input}
                            onChange={(e) => updateTestCaseInput(index, e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            placeholder="Output"
                            value={testCase.output}
                            onChange={(e) => updateTestCaseOutput(index, e.target.value)}
                        />
                    </div>
                ))}
                {errors.testCases && <div className="text-danger small">{errors.testCases}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Programming language</Form.Label>
                <Form.Control
                    type="text"
                    value={language.language_name}
                    onChange={(e) => setLanguage(e.target.value)}
                />
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
            <Button variant="primary" >Save Changes</Button>
        </Modal.Footer>
    </Modal>
  )
}