import React, { use } from 'react'
import { useState } from 'react';
import McqQuestionForm from './McqQuestionForm';
import Header from './Header';
import SidebarTeacher from './SidebarTeacher';
import { Container, Row, Col } from 'react-bootstrap';
import QuestionTable from './QuestionTable';

export default function CreateMcqQuestionsContent() {
    //grab examid from url
    //const {examId} = useParams();
    const examId = 1; // Placeholder for examId, replace with actual logic to get examId from URL

    // State to manage sidebar visibility
    const [showSidebar, setShowSidebar] = useState(false);
    const [questions, setQuestions] = useState([]);
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
            {questions.length > 0 && (
              <QuestionTable questions={questions} onDelete={deleteQuestion} />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
