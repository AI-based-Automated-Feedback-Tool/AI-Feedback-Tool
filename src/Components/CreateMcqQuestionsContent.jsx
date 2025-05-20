import React, { use } from 'react'
import { useState } from 'react';
import McqQuestionForm from './McqQuestionForm';
import Header from './Header';
import SidebarTeacher from './SidebarTeacher';
import { Container, Row, Col, CardHeader, CardBody, Card, Button } from 'react-bootstrap';
import QuestionTable from './QuestionTable';
import EditQuestion from './editQuestion';

export default function CreateMcqQuestionsContent() {
    
    //const {examId} = useParams();//grab examid from url
    const examId = 1; // Placeholder for examId, replace with actual logic to get examId from URL

    // State to manage sidebar visibility
    const [showSidebar, setShowSidebar] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [editQuestionIndex, setEditQuestionIndex] = useState(null);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    // Add question from child form
    const addQuestion = (newQuestion) => {
        setQuestions(prev => [...prev, newQuestion]);
    };
    // Delete question
    const deleteQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    };
    // Edit question
    const editQuestion = (index) => {
        setEditQuestionIndex(index);
        setShowEditQuestion(true);  
    }
    // Save edited question
    const saveEditedQuestion = (updatedQuestion) => {
        const updatedQuestions = [...questions];
        updatedQuestions[editQuestionIndex] = updatedQuestion;
        setQuestions(updatedQuestions);
        setShowEditQuestion(false);
    }

  return (
    <>
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/*Sidebar */}
      <Container fluid>
        <Row>
            <Col md={3}>
                <SidebarTeacher show={showSidebar} onHide={toggleSidebar} />
            </Col>
          
            {/* Main content area */}
            <Col xs={12} md={9} className="p-4">
                <McqQuestionForm onSave={addQuestion}/>
                <Card className="mt-4">
                    <CardHeader className='bg-primary text-white '>
                        <h4>Preview Questions</h4>
                    </CardHeader>
                    <CardBody>
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
                                <Button variant="primary" >
                                    ➕ Save All Question
                                </Button>
                </div> 
                        </>              
                        )}
                    </CardBody>
                </Card>
            </Col>
        </Row>
      </Container>
    </>
  );
}
