import React from 'react'
import { Row, Card, CardBody, Col } from "react-bootstrap";

export default function AIGeneratedQuestions({ questions }) {
  return (
    <Row className="mb-4 mt-4">
      <Card className="text-start border-0 shadow-sm bg-light">
        <CardBody>
          <h5>
            <span className="text-muted mb-1">🧠 Generated Questions by AI: </span>
          </h5>                    
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          {
            questions.map((q, index) => (
              <Card className="mb-3" key={index}>
                <CardBody>
                  <div className="fw-bold">{q.question}</div>
                  <div className="mt-2">
                    {q.choices.map((choice, idx) => (
                      <Col key={idx}  md={6} xs={12}>
                        {choice}
                      </Col>
                    ))}
                  </div>
                  <div className="text-muted">{q.correct_answer}</div>
                </CardBody>
              </Card>
            ))
          }
        </CardBody>
      </Card>
    </Row>
  )
}
