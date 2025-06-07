import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert, Form } from 'react-bootstrap';
import CodeQuestionForm from './CodeQuestionForm';


export default function CreateCodeQuestionsContent() {
  return (
    <Col className="w-100">
        <CodeQuestionForm />
    </Col>
  )
}
