import React from 'react'
import { Modal, Form, Button  } from 'react-bootstrap'
import { useState } from 'react';

export default function EditQuestion({show, handleClose, questionDetails, onSave}) {  
    const [questiontext, setQuestionText] = useState(questionDetails.question);
    const [answerOptions, setAnswerOptions] = useState(questionDetails.answers);
    const [numOfAnswers, setNumOfAnswers] = useState(questionDetails.numOfAnswers);
    const [correctAnswers, setCorrectAnswers] = useState(questionDetails.correctAnswers);
    const [points, setPoints] = useState(questionDetails.points);

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
        const updatedQuestion = {
            question: questiontext,
            answers: answerOptions,
            numOfAnswers: parseInt(numOfAnswers),
            correctAnswers: correctAnswers,
            points: parseInt(points)
        };
        onSave(updatedQuestion);
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
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                />
            </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleEdit} >Save Changes</Button>
      </Modal.Footer>
    </Modal>
  )
}
