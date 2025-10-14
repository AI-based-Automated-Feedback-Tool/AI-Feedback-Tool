import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert, Form } from 'react-bootstrap';
import { useState } from 'react';
import CodeQuestionForm from './components/CodeQuestionForm'
import CodeQuestionTable from './components/CodeQuestionTable';
import EditCodeQuestion from './components/EditCodeQuestion';
import useCodeQuestionForm from './hooks/useCodeQuestionForm';

export default function CreateCodeQuestionsContent({examId, question_count}) {
  const{
    questionDescription,
    setQuestionDescription,
    functionSignature,
    setFunctionSignature,
    wrapperCode,
    setWrapperCode,
    testCases,
    setTestCases,
    selectedLanguage,
    setSelectedLanguage,
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
    saveAllQuestions,
    addTestCase,
    validate,
    resetForm,
    setPoints,
    points,
    warning,
    aiformSelectedLanguage,
    setAiformSelectedLanguage
  } = useCodeQuestionForm(examId, question_count); 

  const isDisabled = () =>{
        if (questions.length >= parseInt(question_count)) {
            return true
        }
        return false
    }

  return (
    <Col className="w-100">
      {errors?.message && 
        <div className="mt-3">
          <Alert variant="danger">
            {errors.message}
          </Alert>
        </div>
      }
      {warning && <Alert variant="warning">{warning}</Alert>}
      <CodeQuestionForm 
            setError={setErrors}
            onAddQuestion={handleAddQuestion}
            formState={{
              questionDescription, 
              setQuestionDescription, 
              functionSignature, 
              setFunctionSignature, 
              wrapperCode, 
              setWrapperCode, 
              testCases, 
              setTestCases, 
              selectedLanguage, 
              setSelectedLanguage,
              points,
              setPoints,
              addTestCase,
              errors,
              setErrors,
              validate,
              resetForm,
              aiformSelectedLanguage,
              setAiformSelectedLanguage
            }}
            disabled={isDisabled()}
      />
      
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
