import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react';
import { useState } from 'react';
import { uploadAttachment, removeAttachment } from "../service/createEssayQuestionService";
import '../../../../css/questionCreation/editQuestion/EditQuestionModal.css';


export default function EditEssayQuestion({show, handleClose, questionDetails, handleSaveChanges, formState}) {
    const [fileName, setFileName] = useState(null);
    const [tempQuestionText, setTempQuestionText] = useState('');
    const [tempWordLimit, setTempWordLimit] = useState('');
    const [tempPoints, setTempPoints] = useState('');
    const [tempGradingNotes, setTempGradingNotes] = useState('');
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
        resetForm,
        setError
    } = formState;

    // function to close the dialog and reset temporary state
    const handleExit = () => {
        setTempAttachments(null);
        setTempFileName(null);
        setFileName(null);
        setError({});
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }   
        handleClose();
    };

    //function to get relative path of the file
    const getRelativeFilePath = (url) => {
        const parts = url.split('/storage/v1/object/public/essay-attachments/');
        return parts[1] || '';
    };

    // dialog form contents
    useEffect(() => {
        if (questionDetails && show) {
            const url = questionDetails.attachment_url ? questionDetails.attachment_url : null;
            const fileNameWithTimestamp = url ? url.split('/').pop() : null;
            if (fileNameWithTimestamp) {
                const spaceLessFileName = fileNameWithTimestamp.substring(fileNameWithTimestamp.indexOf('_') + 1);
                const trimmedName = spaceLessFileName.replace(/%20/g, ' ')
                setFileName(trimmedName);
                setTempFileName(trimmedName);
            } 
            setTempQuestionText(questionDetails.question_text);
            setTempWordLimit(questionDetails.word_limit);
            setTempPoints(questionDetails.points);
            setTempGradingNotes(questionDetails.grading_note);
            setTempAttachments(questionDetails.attachment_url);
            
        }
    }, [questionDetails, show]);

    const manageSaveChanges = async() => {
        const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'video/mp4', 'audio/mpeg'];
        //validate using temporary state
        const validationError = {};
        if (!tempQuestionText.trim()) {
            validationError.question = "Question text is required.";
        }
        if (isNaN(tempWordLimit) || tempWordLimit <= 0) {
            validationError.wordLimit = "Please enter a valid word limit.";
        }
        if (!tempPoints || isNaN(tempPoints) || tempPoints <= 0) {
            validationError.points = "Please enter a valid points value.";
        }
        if (!tempGradingNotes.trim()) {
            validationError.gradingNotes = "Grading notes are required.";
        }
        if (tempAttachments && tempAttachments instanceof File && !allowedFileTypes.includes(tempAttachments.type)) {
            validationError.attachments = "Invalid file type.";
        }
        if (Object.keys(validationError).length > 0) {
            setError(validationError);
            return;
        }

        let attachmentUrlToSave = tempAttachments;
        let uploadedUrl = null;
        // if a new attachment is selected, upload it
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
                    attachment: err.message || "Failed to upload attachment. Please try again."
                }));
                return;
            }            
        }
        // delete the previous attachment if a new one is uploaded
        if (questionDetails.attachment_url && (questionDetails.attachment_url !== attachmentUrlToSave || uploadedUrl)) {
            const relativeFilePath = getRelativeFilePath(questionDetails.attachment_url);
            try {
                await removeAttachment(relativeFilePath);
            } catch (err) {
                setError(prevError => ({
                    ...prevError,
                    attachment: err.message || "Failed to remove previous attachment."
                }));
                return;
            }
        }

        // create the updated question object
        const updatedQuestion = {
            question_text: tempQuestionText.trim(),
            attachment_url: uploadedUrl || attachmentUrlToSave,
            word_limit: Number(tempWordLimit),
            points: Number(tempPoints),
            grading_note: tempGradingNotes.trim(),
        }

        handleSaveChanges(updatedQuestion);
        handleExit();
    }

    

    return (
    <Modal show={show} onHide={handleExit} size="lg" className="edit-question-modal" centered>
        <Modal.Header closeButton>
            <Modal.Title>
                <i className="fas fa-pen me-2"></i> Edit Question
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {error.attachment && (
                <div className="error-text mb-3">
                    <i className="fas fa-exclamation-triangle"></i> {error.attachment}
                </div>
            )}
            <Form.Group controlId="essay-question" className="mb-4">
                <Form.Label className="form-label">
                    Question
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={tempQuestionText}
                    onChange={(e) => setTempQuestionText(e.target.value)}
                    placeholder="Describe the essay question..."
                />
                {error.question && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {error.question}
                    </div>
                )}
            </Form.Group>
        
            <div className="mb-4">
                <Form.Label className="form-label">
                    <i className="fas fa-paperclip icon"></i> Attachment
                </Form.Label>
                {tempAttachments && typeof tempAttachments === 'string' && (
                    <div className="attachment-preview mb-3 p-3 bg-white rounded-3 border">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-file-alt text-primary"></i>
                                <span className="text-muted">
                                    {tempFileName}
                                </span>
                            </div>
                            <div className='d-flex gap-2'>
                                <a
                                    href={tempAttachments}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='text-decoration-none text-primary small'
                                >
                                    View Current Attachment
                                </a>
                                <span
                                    className="text-danger cursor-pointer"
                                    onClick={() => {
                                        setTempAttachments(null);
                                        setTempFileName(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = null;
                                     }
                                    }}
                                >
                                    <i className="fas fa-trash"></i>{/* bin icon */}
                                </span>
                            </div>
                        </div>
                    </div>

                )}
                
                <input
                    type="file"
                    accept='.png, .jpg, .jpeg, .pdf, .doc, .mp4, .mp3'
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setTempAttachments(file);
                            setTempFileName(file?.name);
                        }
                    }}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <div className="d-flex align-items-center gap-3">
                    <label
                        type="button"
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        style={{ width: 'fit-content'}}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <i className="fas fa-upload"></i>
                        {tempAttachments instanceof File ? 'Change File' : 'Upload File'}
                    </label>

                    {tempAttachments instanceof File && (
                        <small className="text-muted d-block mt-2">
                            Selected: <strong>{tempAttachments.name}</strong>
                            <span
                                className="text-danger ms-2 cursor-pointer"
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
                        </small>
                    )}
                </div>
                
                {error.attachments && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {error.attachments}
                    </div>
                )}
            </div>

            <Row className="g-3 mb-4">
                <Col md={6}>
                    <Form.Group controlId="word-limit">
                        <Form.Label className="form-label">
                            <i className="fas fa-align-left icon"></i> Word Limit
                        </Form.Label>
                        <Form.Control 
                            type="number" 
                            min="1"
                            placeholder="Enter the word limit" 
                            value={tempWordLimit}
                            onChange={(e) => setTempWordLimit(e.target.value)}
                        />
                        {error.wordLimit && (
                            <div className="error-text">
                                <i className="fas fa-exclamation-triangle"></i> {error.wordLimit}
                            </div>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="points">
                        <Form.Label className="form-label">
                            <i className="fas fa-coins icon"></i> Points
                        </Form.Label>
                        <Form.Control 
                            type="number" 
                            min="1"
                            placeholder="Enter points" 
                            value={tempPoints}
                            onChange={(e) => setTempPoints(e.target.value)}
                            required
                        />
                        {error.points && (
                            <div className="error-text">
                                <i className="fas fa-exclamation-triangle"></i> {error.points}
                            </div>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group controlId="grading-notes" className="mb-4">
                <Form.Label className="form-label">
                    <i className="fas fa-clipboard-check icon"></i> Grading Notes
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter any specific instructions for the essay question evaluation..."
                    value={tempGradingNotes}
                    onChange={(e) => setTempGradingNotes(e.target.value)}
                    required
                />
                {error.gradingNotes && (
                    <div className="error-text">
                        <i className="fas fa-exclamation-triangle"></i> {error.gradingNotes}
                    </div>
                )}
            </Form.Group>                   
        </Modal.Body>

        <Modal.Footer>
            <button 
                className="action-btn action-btn-secondary" 
                onClick={handleExit}
            >
                Close
            </button>
            <button 
                className="action-btn" 
                onClick={manageSaveChanges}
            >
                <i className="fas fa-save"></i> Save Changes
            </button>
        </Modal.Footer>
    </Modal>
  )
}