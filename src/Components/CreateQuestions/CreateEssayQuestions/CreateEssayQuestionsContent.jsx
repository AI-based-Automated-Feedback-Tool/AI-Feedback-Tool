import React, { use } from 'react'
import { Container, Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';

import EssayQuestionForm from './components/EssayQuestionForm';

export default function CreateEssayQuestionsContent({examId, question_count}) {   
    
  return (
    <>               
        <Col className="w-100">
            <EssayQuestionForm />                  
        </Col>                  
    </>
  );
}
