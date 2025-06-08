import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert, Form } from 'react-bootstrap';
import { useState } from 'react';
import CodeQuestionForm from './CodeQuestionForm';
import CodeQuestionTable from './components/CodeQuestionTable';


export default function CreateCodeQuestionsContent() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  // Function to handle adding a new question
  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  return (
    <Col className="w-100">
      <CodeQuestionForm 
            setError={setError}
            onAddQuestion={handleAddQuestion}
      />
      {error && <Alert variant="danger">{error}</Alert>}
      {questions.length > 0 && (
        <CodeQuestionTable questions={questions} />        
      )}
    </Col>
  )
}
