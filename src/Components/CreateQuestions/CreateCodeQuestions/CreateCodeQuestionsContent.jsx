import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert, Form } from 'react-bootstrap';
import { useState } from 'react';
import CodeQuestionForm from './CodeQuestionForm';


export default function CreateCodeQuestionsContent() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [error, setError] = useState(null);

  return (
    <Col className="w-100">
        <CodeQuestionForm 
          setError={setError} 
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        {error && <Alert variant="danger">{error}</Alert>}
    </Col>
  )
}
