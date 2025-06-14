import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react';
import useEssayQuestionCreation from '../hooks/useEssayQuestionCreation';

export default function EditEssayQuestion({show, handleClose, questionDetails, handleSaveChanges, formState}) {
    const {
        questionText,
        attachments,
        wordLimit,
        points,
        gradingNotes,
        setQuestionText,
        setAttachments,
        setWordLimit,
        setPoints,
        setGradingNotes,
        error,
        fileInputRef,
    } = formState;
    useEffect(() => {
        if (questionDetails) {
            setQuestionText(questionDetails.question_text);
            setAttachments(questionDetails.attachment_url);
            setWordLimit(questionDetails.word_limit);
            setPoints(questionDetails.points);
            setGradingNotes(questionDetails.grading_note);
        }
    }, [questionDetails]);

    const manageSaveChanges = () => {
        const isValid = validate();
        if (!isValid) {
            return;
        }

        const updatedQuestion = {
            question_text: questionText,
            attachment_url: attachments,
            word_limit: wordLimit,
            points: points,
            grading_note: gradingNotes,
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
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                />
                {error.question && <div className="text-danger small">{error.question}</div>}
            </Form.Group>
        
            <Form.Group className='mb-3'>
                <Form.Label className='fw-bold'>Attachments</Form.Label>
                    <Form.Control 
                        type="file" 
                        accept='.png, .jpg, .jpeg, .pdf, .doc, .mp4, .mp3'
                        onChange={(e) => setAttachments(e.target.files[0])}
                        ref={fileInputRef}
                    />
                    {attachments && <small className="text-muted">Selected: {attachments.name}<span 
                    style={{ color: '#6c757d', cursor: 'pointer', marginLeft: '8px' }} 
                    onClick={() => {
                        setAttachments(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = null;
                        }
                    }}
                    >
                        ❌
                    </span></small>}
                    {error.attachments && <div className="text-danger small">{error.attachments}</div>}
            </Form.Group>

            <Row className='mb-3'>
                <Col>
                    <Form.Group>
                        <Form.Label className='fw-bold'>Word Limit</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter the word limit" 
                                value={wordLimit}
                                onChange={(e) => setWordLimit(e.target.value)}
                            />
                            {error.wordLimit && <div className="text-danger small">{error.wordLimit}</div>}
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label className='fw-bold'>Points *</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter points" 
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                required
                            />
                            {error.points && <div className="text-danger small">{error.points}</div>}
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className='mb-3'>
                <Form.Label className='fw-bold'>Grading Notes *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter any specific instructions for the essay question evaluation..."
                        value={gradingNotes}
                        onChange={(e) => setGradingNotes(e.target.value)}
                        required
                    />
                    {error.gradingNotes && <div className="text-danger small">{error.gradingNotes}</div>}
            </Form.Group>                   
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={manageSaveChanges}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
  )
}