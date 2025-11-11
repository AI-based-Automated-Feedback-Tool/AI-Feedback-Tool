import React from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import useFetchLanguages from '../hooks/useFetchLanguages';
import { useEffect } from 'react';
import useCodeQuestionForm from '../hooks/useCodeQuestionForm';
import '../../../../css/questionCreation/editQuestion/EditQuestionModal.css';

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
        handleClose();
    }

    return (
    <Modal 
        show={show} 
        onHide={handleClose} 
        size="lg" 
        className="edit-question-modal" 
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title>
                <i className="fas fa-code me-2"></i> Edit Question
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form.Group controlId="code-question" className="mb-4">
                <Form.Label className='form-label'>
                    <i className="fas fa-question-circle icon"></i> Question
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={questionDescription}
                    onChange={(e) => setQuestionDescription(e.target.value)}
                    placeholder='Describe what the student should implement...'
                />
                {errors.question && (
                <div className="error-text">
                    <i className="fas fa-exclamation-triangle"></i> {errors.question}
                </div>
            )}
            </Form.Group>
        
            <Form.Group controlId="function-sig" className="mb-4">
                <Form.Label className='form-label'>
                    <i className="fas fa-code icon"></i> Function signature
                </Form.Label>
                <Form.Control
                    type="text"
                    value={functionSignature}
                    onChange={(e) => setFunctionSignature(e.target.value)}
                    placeholder="e.g. def solve(arr):"
                />
                {errors.functionSignature && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {errors.functionSignature}
                    </div>
                )}
            </Form.Group>

            <Form.Group controlId="wrapper-code" className="mb-4">
                <Form.Label className="form-label">
                    <i className="fas fa-code-branch icon"></i> Wrapper code
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={5}
                    value={wrapperCode}
                    onChange={(e) => setWrapperCode(e.target.value)}
                    placeholder="Code that wraps the student's function..."
                />
                {errors.wrapperCode && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {errors.wrapperCode}
                    </div>
                )}
            </Form.Group>

            <div className="mb-4">
                <Form.Label className="form-label">
                    <i className="fas fa-vial icon"></i> Test cases
                </Form.Label>
                <div className='test-case-group'>
                    {testCases.map((testCase, index) => (
                        <div key={index} className="test-case-row mb-2">
                            <Row className="g-2">
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
                                <Col xs="auto" className="d-flex align-items-center">
                                    {index === testCases.length - 1 ? (
                                        <Button 
                                            size='sm'
                                            className='action-btn-sm'
                                            onClick={addTestCase}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    ) : (
                                        <Button 
                                            size='sm'
                                            variant='outline-danger'
                                            onClick={() => {
                                                setTestCases(testCases.filter((testCase, i) => i !== index));
                                            }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </div>
                        ))}
                </div>
                {errors.testCases && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {errors.testCases}
                    </div>
                )}
            </div>

            <Form.Group controlId="language-select" className="mb-4">
                <Form.Label className="form-label">
                    Programming language
                </Form.Label>
                <Form.Select
                    value={selectedLanguage ? selectedLanguage.id : ''}
                    onChange={(e) => {
                        const selectedLang = languages.find(lang => String(lang.id) === e.target.value);
                        setSelectedLanguage(selectedLang);
                    }}
                >
                    <option value=""> -- Select Language --</option>
                    {languages.map((language) => (
                        <option key={language.id} value={language.id}>
                            {language.language_name}
                        </option>
                    ))}
                </Form.Select>
                {errors.language && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {errors.language}
                    </div>
                )}
            </Form.Group>

            <Form.Group controlId="code-points" className="mb-4">
                <Form.Label className="form-label">
                    <i className="fas fa-coins icon"></i> Points
                </Form.Label>
                <Form.Control
                    type="number"
                    min="1"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                />
                {errors.points && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {errors.points}
                    </div>
                )}
            </Form.Group>
        </Modal.Body>

        <Modal.Footer>
            <button className="action-btn action-btn-secondary" onClick={handleClose}>
                Close
            </button>
            <button className="action-btn" onClick={manageSaveChanges}>
                Save Changes
            </button>
        </Modal.Footer>
    </Modal>
  )
}