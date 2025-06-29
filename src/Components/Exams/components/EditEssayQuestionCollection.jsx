import { Form, Row, Col, Button} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
const SUPABASE_PUBLIC_URL = "https://okmurjvzsgdxjiaflacq.supabase.co/storage/v1/object/public/essay-attachments/";

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
          <div key={q.question_id} className="mb-4 p-3 border rounded bg-light">
            <h6>Question {index + 1}</h6>

            {/* Question text */}
            <Form.Group className="mb-2">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                type="text"
                value={q.question_text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].question_text = e.target.value;
                    console.log('Updated Question Text:', updated[index].question_text);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            {/* Grading Notes */}
            <Form.Group className="mb-2">
              <Form.Label>Grading Note</Form.Label>
              <Form.Control
                type="text"
                value={q.grading_note}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].function_signature = e.target.value;
                    console.log('Updated Function Signature:', updated[index].function_signature);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            {/* Word Limit */}
            <Form.Group className="mb-2">
              <Form.Label>Word Limit</Form.Label>
              <Form.Control
                type="text"
                value={q.word_limit}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].word_limit = e.target.value;
                    console.log('Updated Word Limit:', updated[index].word_limit);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            

            {/* Points */}
            <Form.Group className="mb-2">
              <Form.Label>Points</Form.Label>
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
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Attachment</Form.Label>
              {attachments && (
                <div className="mb-2">
                  <span className="text-muted">Attachment: {fileName}</span>
                  {!isFile && (
                    <a
                      href={getPublicAttachmentUrl(attachments)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-2"
                    >
                      View
                    </a>
                  )}
                  <span
                    className="ms-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const updated = [...questions];
                      updated[index].attachments = null;
                      updated[index].attachment_url = null;
                      setQuestions(updated);
                    }}
                  >
                    ❌
                  </span>
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
              />
            </Form.Group>
          </div>
        );
      })}
    </>
  );
}
