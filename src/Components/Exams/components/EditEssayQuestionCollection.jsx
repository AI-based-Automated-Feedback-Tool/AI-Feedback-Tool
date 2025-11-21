import { Form, Row, Col, Button} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
const SUPABASE_PUBLIC_URL = "https://okmurjvzsgdxjiaflacq.supabase.co/storage/v1/object/public/essay-attachments/";
import '../../../css/EditExam/EditEssayQuestionCollection.css';

export default function EditEssayQuestionCollection({questions, setQuestions, attachmentRef}) {
  const localAttachmentBackup = useRef({});

  useEffect(() => {
    const map = {};
    questions.forEach(q => {
      if (q.attachment_url) {
        map[q.question_id] = q.attachment_url;
      }
    });
    localAttachmentBackup.current = map;
    if (attachmentRef) {
      attachmentRef.current = map;
    }
  }, [questions]);

  const getPublicAttachmentUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${SUPABASE_PUBLIC_URL}${path}`;
  };

  
  return (
    <>
      {questions.map((q, index) => {
        const attachments = q.attachments || q.attachment_url || null;
        const isFile = attachments instanceof File;

        // Compute fileName (if attachment is a URL or File)
        let fileName = null;
        if (attachments instanceof File) {
          fileName = attachments.name;
        } else if (typeof attachments === 'string') {
          const filePart = attachments.split('/').pop();
          fileName = decodeURIComponent(filePart?.substring(filePart.indexOf('_') + 1));
        }
        return (
          <div key={q.question_id} className="essay-question-card px-4 pt-3">
            <div className="essay-question-header mb-4">
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="essay-icon">
                    <i className="fas fa-pen-nib"></i>
                  </div>
                  <h5 className="essay-title mb-0">
                    Question {index + 1}
                  </h5>
                </div>
                <div className="points-badge">
                  {q.points || 0} pts
                </div>
              </div>
            </div>

            {/* Question text */}
            <Form.Group className="mb-4">
              <Form.Label className='input-label'>Question Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={q.question_text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].question_text = e.target.value;
                    console.log('Updated Question Text:', updated[index].question_text);
                  setQuestions(updated);
                }}
                className='question-textarea'
                placeholder='Write your essay question here...'
              />
            </Form.Group>

            {/* Grading Notes */}
            <Form.Group className="mb-4">
              <Form.Label className='input-label'>Grading Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={q.grading_note}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].function_signature = e.target.value;
                    console.log('Updated Function Signature:', updated[index].function_signature);
                  setQuestions(updated);
                }}
                className='question-textarea'
                placeholder='How should AI grade this essay?'
              />
            </Form.Group>

            {/* Word Limit */}
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className='input-label'>Word Limit</Form.Label>
                  <Form.Control
                    type="number"
                    value={q.word_limit}
                    min={1}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].word_limit = e.target.value;
                        console.log('Updated Word Limit:', updated[index].word_limit);
                      setQuestions(updated);
                    }}
                    className="points-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className='input-label'>Points</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={q.points || ''}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].points = parseInt(e.target.value) || 0;
                      console.log('Updated Points:', updated[index].points);
                      setQuestions(updated);
                    }}
                    className="points-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-4">
              <Form.Label className="input-label">Attachment</Form.Label>
              {attachments && (
                <div className="attachment-preview p-3 rounded border mb-3 d-flex align-items-center justify-content-between">
                  <div>
                    <i className="fas fa-paperclip me-2 text-primary"></i>
                    <strong>{fileName}</strong>
                    {!isFile && (
                      <a
                        href={getPublicAttachmentUrl(attachments)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-3 text-decoration-underline small"
                      >
                        View
                      </a>
                    )}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      const updated = [...questions];
                      updated[index].attachments = null;
                      updated[index].attachment_url = null;
                      setQuestions(updated);
                    }}
                  >
                    ❌
                  </Button>
                </div>
              )}

              <Form.Control
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.doc,.mp4,.mp3"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const updated = [...questions];
                    updated[index].attachments = file;
                    updated[index].attachment_url = null;
                    setQuestions(updated);
                  }
                }}
                className='form-control'
              />
              <small className="text-muted">Supported: Images, PDF, Word</small>
            </div>
            <hr className='question-divider'/>
          </div>
          
        );
      })}
    </>
  );
}
