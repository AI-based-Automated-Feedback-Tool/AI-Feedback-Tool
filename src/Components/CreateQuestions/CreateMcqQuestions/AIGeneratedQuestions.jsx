import React from 'react'
import { Row, Card, CardBody } from "react-bootstrap";

export default function AIGeneratedQuestions({ questions }) {
  return (
    <Row className="mb-4 mt-4">
      <Card className="text-start border-0 shadow-sm bg-light">
        <CardBody>
          <h5>
            <span className="text-muted mb-1">🧠 Generated Questions by AI: </span>
            <span className="fw-bold text-primary">{}</span>
          </h5>                    
        </CardBody>
      </Card>
    </Row>
  )
}
