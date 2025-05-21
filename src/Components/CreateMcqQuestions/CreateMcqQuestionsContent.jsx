import React, { use } from 'react'
import { useState } from 'react';
import McqQuestionForm from './McqQuestionForm';
import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import QuestionTable from './QuestionTable';
import EditQuestion from './EditQuestion';
import {useMcqQuestion} from './useMcqQuestion';

export default function CreateMcqQuestionsContent() {
    
    //const {examId} = useParams();//grab examid from url
    //console.log(examId);
    const examId = "c15b5849-8f7e-4971-a99c-81ca0f6ae8a8"; // Replace with actual exam ID
    const userId = "5416a41e-d744-41cb-b6ab-48e89957f78c"; // Replace with actual user ID

    const {
        questions,
        showEditQuestion,
        editQuestionIndex,
        addQuestion,
        deleteQuestion,
        editQuestion,
        saveEditedQuestion,
        saveAllQuestions,
        setShowEditQuestion,
        error,
        loading,
    } = useMcqQuestion(examId,userId);

    const handleSaveQuestions = async () => {
        await saveAllQuestions();
        if (!error) {
            alert("Questions saved successfully!");
        }        
    }

  return (
    <>               
            {/* Main content area */}
            <Col className="w-100">
                <McqQuestionForm onSave={addQuestion}/>
                <Card className="mt-4">
                    <CardHeader className='bg-primary text-white '>
                        <h4>Preview Questions</h4>
                    </CardHeader>
                    <CardBody>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {questions.length > 0 && (
                        <>
                            <QuestionTable 
                                questions={questions} 
                                onDelete={deleteQuestion} 
                                onEdit={editQuestion}
                            />
                            {editQuestionIndex !== null && questions[editQuestionIndex] && (
                            <EditQuestion 
                                show={showEditQuestion}
                                handleClose={() => setShowEditQuestion(false)}
                                questionDetails = {questions[editQuestionIndex]}
                                onSave={saveEditedQuestion}
                            />
                            )}
                            {/* Submit Button */}
                            <div className="d-flex justify-content-end" >
                                <Button variant="primary" onClick={handleSaveQuestions} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving Questions...
                                        </>
                                    ) : (
                                        "➕ Save All Question"
                                    )}                              
                                </Button>
                            </div> 
                        </>              
                        )}
                    </CardBody>
                </Card>
            </Col>        
    </>
  );
}
