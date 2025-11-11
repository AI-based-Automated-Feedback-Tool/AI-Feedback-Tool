import { Form, Row, Col, Button } from "react-bootstrap";
import '../../../../css/questionCreation/EssayCreation.css';

export default function ManualEssayQuestionCreation({ formState }) {
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
        onSaveQuestion,
        error,
        fileInputRef,
        isDisabled
    }= formState;

  return (
    <Form>
        <Form.Group className='form-group' controlId='questionText'>
            <Form.Label className='form-label'>
                <i className="fas fa-align-left icon"></i> Question *
            </Form.Label>
            <Form.Control
                as="textarea"
                className="form-textarea"
                rows={3}
                placeholder="Enter your essay question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
            />
            {error.questionText && (
                <div className="error-alert">
                    <i className="fas fa-exclamation-triangle"></i>
                    {error.questionText}
                </div>
            )}
        </Form.Group>

        {/* Attachments Upload */}
        <Form.Group className='form-group'>
            <Form.Label className='form-label'>
                <i className="fas fa-paperclip icon"></i> Attachments
            </Form.Label>
            <div className="file-upload-wrapper">
                <Form.Control 
                    type="file"
                    id="essay-attachment-input" 
                    accept='.png, .jpg, .jpeg, .pdf, .doc, .mp4, .mp3'
                    onChange={(e) => setAttachments(e.target.files[0])}
                    ref={fileInputRef}
                    className="file-input"
                />
                <label 
                    htmlFor="essay-attachment-input"
                    className="file-label"
                >
                    <i className="fas fa-cloud-upload-alt"></i>
                    {attachments ? attachments.name : 'Choose file...'}
                </label>
            </div>
            {attachments && (
                <div className="file-preview">
                    <i className="fas fa-file-alt me-2"></i>
                    {attachments.name}
                    <button 
                        type="button" 
                        className="btn-remove-file"
                        onClick={() => {
                            setAttachments(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                            }
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
            {error.attachments && (
                <div className="error-alert">
                    <i className="fas fa-exclamation-triangle icon"></i>
                    {error.attachments}
                </div>
            )}
        </Form.Group>

            {/*Word Limit and Points*/}
            <Row className='g-3'>
            <Col md={6}>
                <Form.Group className="form-group" controlId="wordLimit">
                    <Form.Label className='form-label'>
                        <i className="fas fa-text-height icon"></i> Word Limit
                    </Form.Label>
                    <Form.Control 
                        type="number"
                        className="form-input" 
                        placeholder="E.g. 500" 
                        value={wordLimit}
                        onChange={(e) => setWordLimit(e.target.value)}
                    />
                    {error.wordLimit && (
                        <div className="error-alert">
                            <i className="fas fa-exclamation-triangle icon"></i>
                            {error.wordLimit}
                        </div>
                    )}
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="form-group" controlId="points">
                    <Form.Label className='fw-label'>
                        <i className="fas fa-star icon"></i> Points *
                    </Form.Label>
                    <Form.Control 
                        type="number" 
                        className="form-input"
                        min={1}
                        placeholder="Enter points" 
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        required
                    />
                    {error.points && (
                        <div className="error-alert">
                            <i className="fas fa-exclamation-triangle icon"></i>
                            {error.points}
                        </div>
                    )}
                </Form.Group>
            </Col>
        </Row>
        
        {/* Grading Notes */}
        <Form.Group className='form-group' controlId='gradingNotes'>
            <Form.Label className='form-label'>
                <i className="fas fa-clipboard-list icon"></i> Grading Notes *
            </Form.Label>
            <Form.Control
                as="textarea"
                className="form-textarea"
                rows={4}
                placeholder="Enter any specific instructions for the essay question evaluation..."
                value={gradingNotes}
                onChange={(e) => setGradingNotes(e.target.value)}
                required
            />
            {error.gradingNotes && (
                <div className="error-alert">
                    <i className="fas fa-exclamation-triangle icon"></i>
                    {error.gradingNotes}
                </div>
            )}
        </Form.Group>

        {/* Submit Button */}
        <div className="d-flex justify-content-end mt-4" >
            <button 
                type="button"
                className="action-btn" 
                onClick={onSaveQuestion} 
                disabled={isDisabled()}
            >
                Save Question
            </button>                    
        </div>   
        {error.message && (
        <div className="error-alert">
          <i className="fas fa-exclamation-triangle icon"></i>
          {error.message}
        </div>
      )}
        
    </Form>
  )
}
