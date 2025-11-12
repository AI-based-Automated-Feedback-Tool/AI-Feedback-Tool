import React from 'react'
import { Modal, Form, Button  } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import '../../../css/questionCreation/editQuestion/EditQuestionModal.css';

export default function EditQuestion({show, handleClose, questionDetails, onSave}) {  
    const [questiontext, setQuestionText] = useState(questionDetails.question);
    const [answerOptions, setAnswerOptions] = useState(questionDetails.answers);
    const [numOfAnswers, setNumOfAnswers] = useState(questionDetails.numOfAnswers);
    const [correctAnswers, setCorrectAnswers] = useState(questionDetails.correctAnswers);
    const [points, setPoints] = useState(questionDetails.points);
    const [errors, setErrors] = useState({});

    const updateAnswers = (index, e) => {
        const updatedAnswers = [...answerOptions];
        updatedAnswers[index] = e.target.value;
        setAnswerOptions(updatedAnswers);
    }

    // function to close the dialog and reset temporary state
    const handleExit = () => {
        setErrors({});
        handleClose();
    };

    //update state when question details change
    useEffect(() => {
        if (questionDetails) {
            setQuestionText(questionDetails.question);
            setAnswerOptions(questionDetails.answers);
            setNumOfAnswers(questionDetails.numOfAnswers);
            setCorrectAnswers(questionDetails.correctAnswers);
            setPoints(questionDetails.points);
            setErrors({});
        }
    }, [questionDetails]);

    const handleChange = (answer) => {
        if (correctAnswers.includes(answer)) {
            setCorrectAnswers(correctAnswers.filter(ans => ans !== answer));
        } else {
            setCorrectAnswers([...correctAnswers, answer]);
        }
    }

    const handleEdit = () => {
        const trimmedAnswers = answerOptions.map(opt => opt.trim());
        const newErrors = {};

        if (!questiontext.trim()) {
            newErrors.question = "Question is required."
        }
        if (trimmedAnswers.includes("")) {
            newErrors.answers = "All answer options must be filled."
        }
        if (!points || isNaN(points) || parseInt(points) < 1) {
            newErrors.points = "Points must be at least 1."
        }
        if (correctAnswers.length !== parseInt(numOfAnswers)) {
            newErrors.correct = `Select exactly ${numOfAnswers} correct answer(s).`;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const updatedQuestion = {
                question: questiontext.trim(),
                answers: trimmedAnswers,
                numOfAnswers: parseInt(numOfAnswers),
                correctAnswers: correctAnswers,
                points: parseInt(points)
            };
            onSave(updatedQuestion);
            setErrors({});
            handleExit();
        }        
    }

    return (
    <Modal 
        show={show} 
        onHide={handleExit} 
        size="lg" 
        className="edit-question-modal" 
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title>
                <i className="fas fa-edit me-2"></i> Edit Question
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form.Group controlId="edit-question-text" className="mb-4">
                <Form.Label className='form-label'>
                    <i className="fas fa-question-circle icon"></i> Question
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={questiontext}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder='Enter your question...'
                />
                {errors.question && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle icon"></i> {errors.question}
                    </div>
                )}
            </Form.Group>
        
            <div className="mb-4">
                <Form.Label className='form-label'>
                    <i className="fas fa-list-ul icon"></i> Answer Options
                </Form.Label>
                <div className="answer-option-group">
                    {answerOptions.map((answer, index) => (
                        <Form.Group 
                            className="answer-option-wrapper mb-2" 
                            key={index}
                            controlId={`answer-option-${index}`}
                        >
                            <Form.Label 
                                className='fw-bold text-muted d-flex align-items-center'
                                style={{ minWidth: '80px', margin: 0 }}
                            >
                                Option {index + 1}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={answer}
                                onChange={(e) => updateAnswers(index, e)}
                                placeholder={`Option ${index + 1}`}
                                className='flex-grow-1'
                            />
                        </Form.Group>
                    ))}
                </div>
                {errors.answers && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle icon"></i> {errors.answers}
                    </div>
                )}
            </div>

            <Form.Group controlId="num-answers" className="mb-4">
                <Form.Label className="form-label">
                    <i className="fas fa-hashtag icon"></i> No of Answers
                </Form.Label>
                <Form.Control
                    type="number"
                    value={numOfAnswers}
                    onChange={(e) => setNumOfAnswers( e.target.value)}
                />
            </Form.Group>

            <div className="mb-4">
                <Form.Label className="form-label">
                    <i className="fas fa-check-circle icon"></i> Correct Answers
                </Form.Label>
                <div className='correct-answer-group'>
                    {answerOptions.map((answer, index) => (
                        <Form.Group
                            key= {index}
                            controlId={`correct-answer-${index}`}
                            className='correct-answer-item'
                        >
                            <Form.Check
                                type="checkbox"
                                checked={correctAnswers.includes(answer)}
                                onChange={() => handleChange(answer)}
                                label={answer || `Option ${index + 1}`}
                            />
                        </Form.Group>
                    ))
                    }
                </div>
                {errors.correct && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle icon"></i> {errors.correct}
                    </div>
                )}
            </div>

            <Form.Group controlId="edit-points" className="mb-4">
                <Form.Label className="form-label">
                    Points
                </Form.Label>
                <Form.Control
                    type="number"
                    min="1"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                />
                {errors.points && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle icon"></i> {errors.points}
                    </div>
                )}
            </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <button className="action-btn action-btn-secondary" onClick={handleExit}>
            Close
        </button>
        <button className="action-btn" onClick={handleEdit}>
            Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  )
}
