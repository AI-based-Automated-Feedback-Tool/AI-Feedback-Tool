import React, { use } from 'react'
import { useParams } from 'react-router-dom';
import McqQuestionForm from './McqQuestionForm';
import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import QuestionTable from './QuestionTable';
import EditQuestion from './EditQuestion';
import {useMcqQuestion} from './useMcqQuestion';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function CreateMcqQuestionsContent() {
    
    const {examId} = useParams();
    const location = useLocation();                   
    const query = new URLSearchParams(location.search);
    const question_count = query.get('question_count');
    const navigate = useNavigate();

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
        clearQuestions,
        error,
        loading,
        userId,
        warning
    } = useMcqQuestion(examId, question_count);

    const handleSaveQuestions = async () => {
        await saveAllQuestions();
        if (!error) {
            clearQuestions();
            alert("Questions saved successfully!");
            navigate("/teacher");
        }        
    }

    const isDisabled = () =>{
        if (questions.length >= parseInt(question_count)) {
            return true
        }
        return false
    }

  return (
    <>               
            {/* Main content area */}
            <Col className="w-100">
                <McqQuestionForm onSave={addQuestion} warning={warning} disabled={isDisabled()}/>
                {questions.length > 0 && (
                    <Card className="mt-4">
                        <CardHeader className='bg-primary text-white '>
                            <h4>Preview Questions</h4>
                        </CardHeader>
                        <CardBody>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
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
                            
                        </CardBody>
                    </Card>
                )}
            </Col>        
    </>
  );
}
