import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert, Form } from 'react-bootstrap';
import { useState } from 'react';
import CodeQuestionForm from './components/CodeQuestionForm'
import CodeQuestionTable from './components/CodeQuestionTable';
import EditCodeQuestion from './components/EditCodeQuestion';


export default function CreateCodeQuestionsContent() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Function to save changes after editing a question
  const handleSaveChanges = (updatedQuestion) => {
    const updatedQuestions = [...questions]
    updatedQuestions[editQuestionIndex] = updatedQuestion
    setQuestions(updatedQuestions);
    setShowEditQuestion(false);
    setEditQuestionIndex(null);}

  // Function to handle submitting all questions

  return (
    <Col className="w-100">
      <CodeQuestionForm 
            setError={setError}
            onAddQuestion={handleAddQuestion}
      />
      {error && 
        <div className="mt-3">
          <Alert variant="danger">
            {error}
          </Alert>
        </div>
      }
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
              questionDetails={questions[editQuestionIndex]}
              handleSaveChanges={handleSaveChanges}
            />
          )}
          {/* Submit Button */}
          <div className="d-flex justify-content-end" >
            <Button variant="primary" >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Questions...
                  </>
              ) : (
                "➕ Save All Questions"
              )}                              
            </Button>
          </div> 
        </>
      )}
    </Col>
  )
}
