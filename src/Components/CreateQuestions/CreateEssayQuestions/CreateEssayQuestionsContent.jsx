import React, { use } from 'react'
import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import EssayQuestionForm from './components/EssayQuestionForm';
import useEssayQuestionCreation from './hooks/useEssayQuestionCreation';
import EssayQuestionTable from './components/EssayQuestionTable';
import EditEssayQuestion from './components/EditEssayQuestion';

export default function CreateEssayQuestionsContent({examId, question_count}) { 
  const {
    question,
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
    handleDeleteQuestion,
    handleEditQuestion,
    editQuestionIndex,
    showEditQuestion,
    setShowEditQuestion,
    handleSaveChanges
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
                fileInputRef,
                handleDeleteQuestion,
                handleEditQuestion,
                editQuestionIndex,
                showEditQuestion,
                setShowEditQuestion
              }}/>                  
        </Col>   
        {question.length > 0 &&
        <>
          <EssayQuestionTable
            questions={question}
            onDelete={handleDeleteQuestion}
            onEdit={handleEditQuestion}
          />
          {editQuestionIndex !== null && question[editQuestionIndex] && (
            <EditEssayQuestion 
              show={showEditQuestion}
              handleClose={() => setShowEditQuestion(false)}
              questionDetails={question[editQuestionIndex]}
              handleSaveChanges={handleSaveChanges}
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
                error,
                fileInputRef
              }}
            />
          )}
        </>
        }               
    </>
  );
}
