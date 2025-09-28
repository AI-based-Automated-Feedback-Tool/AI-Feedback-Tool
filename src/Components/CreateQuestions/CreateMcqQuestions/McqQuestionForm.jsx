import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useState } from 'react';
import ManualMcqQuestionCreation from './ManualMcqQuestionCreation';

export default function McqQuestionForm({onSave, warning, disabled}) {     
  return (
    <Card>
        <Card.Header className="bg-primary text-white">
            <h4>📝 Create MCQ Questions</h4>
        </Card.Header>
        <Card.Body>
            <ManualMcqQuestionCreation onSave={onSave} warning={warning} disabled={disabled}/>
        </Card.Body>
    </Card>
  )
}
