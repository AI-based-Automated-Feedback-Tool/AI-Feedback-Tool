import React from 'react'
import { Modal, Form, Button  } from 'react-bootstrap'
import { useState } from 'react';

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
        }        
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
                    value={questiontext}
                    onChange={(e) => setQuestionText(e.target.value)}
                />
                {errors.question && <div className="text-danger small">{errors.question}</div>}
            </Form.Group>
        
            <Form.Group className="mb-3">
                <Form.Label>Answer Options</Form.Label>
                {answerOptions.map((answer, index) => (
                    <Form.Control
                        key={index}
                        type="text"
                        value={answer}
                        onChange={(e) => updateAnswers(index, e)}
                    />
                ))}
                {errors.answers && <div className="text-danger small">{errors.answers}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>No of Answers</Form.Label>
                    <Form.Control
                        type="number"
                        value={numOfAnswers}
                        onChange={(e) => setNumOfAnswers( e.target.value)}
                    />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Correct Answers</Form.Label>
                    {answerOptions.map((answer, index) => (
                        <Form.Check
                            key={index}
                            type="checkbox"
                            label={answer}
                            checked={correctAnswers.includes(answer)}
                            onChange={() => handleChange(answer)}
                        />
            ))}
            {errors.correct && <div className="text-danger small">{errors.correct}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                />
            </Form.Group>
            {errors.points && <div className="text-danger small">{errors.points}</div>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleEdit} >Save Changes</Button>
      </Modal.Footer>
    </Modal>
  )
}
