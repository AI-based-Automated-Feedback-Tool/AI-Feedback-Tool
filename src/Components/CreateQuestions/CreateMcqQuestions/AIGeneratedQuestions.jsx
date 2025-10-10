import React from 'react'
import {useState} from 'react'
import { Row, Card, CardBody, Col, Form, Button } from "react-bootstrap";
import '../../../css/aiQuestionGeneration.css';

export default function AIGeneratedQuestions({ questions, checkedQuestions, onCheck, onSaveChecked }) {
  
  return (
    <Row className="mb-4 mt-4 mx-1 main-row-bg">
      <Card className="text-start border-0 shadow-sm bg-light mb-2">
        <CardBody>
          <h5>
            <span className="text-muted mb-1">🧠 Generated Questions by AI: </span>
          </h5>                    
        </CardBody>
      </Card>

      {questions &&
        questions.map((q, index) => (
          <div key={index} className="d-flex align-items-start mb-3">
            <Form.Check
              type="checkbox"
              className="me-2 mt-2"
              checked={!!checkedQuestions[index]}
              onChange={() => onCheck(index)}

            />
            <Card className="flex-grow-1" >
            <CardBody>
              <div className="fw-bold">{q.question}</div>
              <Row className="mt-2">
                {q.choices.map((choice, idx) => (
                  <Col key={idx} md={6} xs={12} className='mb-2'>
                    <Card className={`p-2 border choice-card ${choice === q.correct_answer ? 'choice-correct' : ''}`}>
                      {choice}
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="text-muted">Correct Answer: {q.correct_answer}</div>
            </CardBody>
          </Card>
          </div>
        ))
      }

      {/* Generate Button */}
      <div className="d-flex justify-content-end" onClick={onSaveChecked}>
        <Button variant="primary" >
          ➕ Add Questions to the Exam
        </Button>
      </div>
    </Row>
  )
}
