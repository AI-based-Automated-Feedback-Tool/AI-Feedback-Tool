import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert, Form } from 'react-bootstrap';
import { useState } from 'react';
import CodeQuestionForm from './components/CodeQuestionForm'
import CodeQuestionTable from './components/CodeQuestionTable';
import EditCodeQuestion from './components/EditCodeQuestion';
import useCodeQuestionForm from './hooks/useCodeQuestionForm';

export default function CreateCodeQuestionsContent({examId, question_count}) {
  const{
    setErrors,
    errors,
    loading,
    questions,
    showEditQuestion,
    setShowEditQuestion,
    editQuestionIndex,
    handleSaveChanges,
    handleAddQuestion,
    handleDeleteQuestion,
    handleEditQuestion,
    saveAllQuestions
  } = useCodeQuestionForm(examId);

  const [error, setError] = useState(null);  

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
            <Button variant="primary" onClick={saveAllQuestions} disabled={loading}>
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
