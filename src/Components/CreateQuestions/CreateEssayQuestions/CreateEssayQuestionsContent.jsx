import React, { use } from 'react'
import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import EssayQuestionForm from './components/EssayQuestionForm';
import useEssayQuestionCreation from './hooks/useEssayQuestionCreation';

export default function CreateEssayQuestionsContent({examId, question_count}) { 
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
    fileInputRef
  } = useEssayQuestionCreation(examId, question_count);
    
    
  return (
    <>               
        <Col className="w-100">
            <EssayQuestionForm 
              formState={{
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
                fileInputRef
              }}/>                  
        </Col>                  
    </>
  );
}
