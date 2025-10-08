import React from 'react'
import { Row, Card, CardBody, Col } from "react-bootstrap";
import '../../../css/aiQuestionGeneration.css';

export default function AIGeneratedQuestions({ questions }) {
  return (
    <Row className="mb-4 mt-4 mx-1 main-row-bg">
      <Card className="text-start border-0 shadow-sm bg-light mb-2">
        <CardBody>
          <h5>
            <span className="text-muted mb-1">🧠 Generated Questions by AI: </span>
          </h5>                    
        </CardBody>
      </Card>
      
      {
        questions.map((q, index) => (
          <Card className="mb-3" key={index} >
            <CardBody>
              <div className="fw-bold">{q.question}</div>
              <Row className="mt-2">
                {q.choices.map((choice, idx) => (
                  <Col key={idx}  md={6} xs={12} className='mb-2'>
                    <Card className="p-2 border choice-card">
                      {choice}
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="text-muted">{q.correct_answer}</div>
            </CardBody>
          </Card>
        ))
      }
    </Row>
  )
}
