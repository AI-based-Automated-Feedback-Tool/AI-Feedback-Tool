import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert, Form } from 'react-bootstrap';
import { useState } from 'react';
import CodeQuestionForm from './CodeQuestionForm';
import CodeQuestionTable from './components/CodeQuestionTable';
import EditCodeQuestion from './components/EditCodeQuestion';


export default function CreateCodeQuestionsContent() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);

  // Function to handle adding a new question
  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };
  
  // Function to handle deleting a question
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  }

  // Function to handle editing a question
  const handleEditQuestion = (index) => {
    setEditQuestionIndex(index);
    setShowEditQuestion(true);
  }

  return (
    <Col className="w-100">
      <CodeQuestionForm 
            setError={setError}
            onAddQuestion={handleAddQuestion}
      />
      {error && <Alert variant="danger">{error}</Alert>}
      {questions.length > 0 && (
        <>
          <CodeQuestionTable 
            questions={questions} 
            onDelete={handleDeleteQuestion}
            onEdit={handleEditQuestion}
          />
          {editQuestionIndex !== null && questions[editQuestionIndex] && (
            <EditCodeQuestion 
              show={showEditQuestion}
              handleClose={() => setShowEditQuestion(false)}
              questionDetails = {questions[editQuestionIndex]}
            />
          )}
        </>
      )}
    </Col>
  )
}
