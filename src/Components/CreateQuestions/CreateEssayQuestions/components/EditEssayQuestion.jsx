import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react';
import { useState } from 'react';

export default function EditEssayQuestion({show, handleClose, questionDetails, handleSaveChanges, formState}) {
    const [fileName, setFileName] = useState(null);
    const [tempAttachments, setTempAttachments] = useState(null);
    const [tempFileName, setTempFileName] = useState(null);

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
        validate,
        resetForm
    } = formState;

    // dialog form contents
    useEffect(() => {
        if (questionDetails) {
            const url = questionDetails.attachment_url ? questionDetails.attachment_url : null;
            const fileNameWithTimestamp = url ? url.split('/').pop() : null;
            if (fileNameWithTimestamp) {
                const trimmedName = fileNameWithTimestamp.substring(fileNameWithTimestamp.indexOf('_') + 1);
                setFileName(trimmedName);
                setTempFileName(trimmedName);
            } 
            setQuestionText(questionDetails.question_text);
            setAttachments(questionDetails.attachment_url);
            setWordLimit(questionDetails.word_limit);
            setPoints(questionDetails.points);
            setGradingNotes(questionDetails.grading_note);
            setTempAttachments(questionDetails.attachment_url);
            
        }
    }, [questionDetails]);

    const manageSaveChanges = async() => {
        const isValid = validate();
        if (!isValid) {
            return;
        }

        let attachmentUrlToSave = tempAttachments;
        if (tempAttachments instanceof File) {
            try {
                attachmentUrlToSave = await uploadAttachment(tempAttachments);

                if (attachmentUrlToSave?.url?.publicUrl) {
                    uploadedUrl = attachmentUrlToSave.url.publicUrl;
                } else {
                    throw new Error(attachmentUrlToSave.message || "Invalid upload response");
                }
            
            } catch (err) {
                setError(prevError => ({
                    ...prevError,
                    attachment: "Failed to upload attachment. Please try again."
                }));
                return;
            }            
        }
        const updatedQuestion = {
            question_text: questionText,
            attachment_url: attachmentUrlToSave,
            word_limit: wordLimit,
            points: points,
            grading_note: gradingNotes,
        }
        setAttachments(attachmentUrlToSave);
        setFileName(tempFileName);
        handleSaveChanges(updatedQuestion);

        // Reset form fields    
        resetForm();
        setTempAttachments(null);
        setTempFileName(null);
    }

    const handleExit = () => {
        setTempAttachments(null);
        setTempFileName(null);
        resetForm();
        setFileName(null);
        handleClose();
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
                {tempAttachments && typeof tempAttachments === 'string' && (
                    <div className="mb-2">
                        <span className="text-muted">
                            Current Attachment: {tempFileName}
                        </span>
                        <a
                            href={tempAttachments}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='ms-2'
                        >
                            View Current Attachment
                        </a>
                        <span
                            style={{
                                color: '#6c757d',
                                cursor: 'pointer',
                                marginLeft: '8px'
                            }}
                                onClick={() => {
                                    setTempAttachments(null);
                                    setTempFileName(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = null;
                                    }
                                }}
                        >
                            ❌
                        </span>
                    </div>
                )}
                    <Form.Control
                        type="file"
                        accept='.png, .jpg, .jpeg, .pdf, .doc, .mp4, .mp3'
                        onChange={(e) => {
                            setTempAttachments(e.target.files[0]);
                            setTempFileName(e.target.files[0]?.name);
                        }}
                        ref={fileInputRef}
                    />
                    {tempAttachments instanceof File && <small className="text-muted">Selected: {tempAttachments.name}<span
                        style={{ color: '#6c757d', cursor: 'pointer', marginLeft: '8px' }}
                        onClick={() => {
                            if (tempAttachments && fileInputRef.current) {
                                fileInputRef.current.value = null;
                            }
                        setTempAttachments(null);
                        setTempFileName(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = null;
                        } 
                    }}>
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
            <Button variant="secondary" onClick={handleExit}>Close</Button>
            <Button variant="primary" onClick={manageSaveChanges}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
  )
}