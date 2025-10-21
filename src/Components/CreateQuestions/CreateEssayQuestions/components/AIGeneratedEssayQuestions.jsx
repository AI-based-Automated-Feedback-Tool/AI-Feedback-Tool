import { Card, Row, Col, Button, Badge, Form } from "react-bootstrap";
import '../../../../css/aiQuestionGeneration.css'
export default function AIGeneratedEssayQuestions({ questions, onCheck, checkedQuestions, onSaveChecked}) {
  return (
    <Card className="parent-ai-card mb-4 mt-4 shadow-lg">
      <Card.Body>
        <Card.Title className="parent-card-title mb-4">
          Generated Essay Questions
        </Card.Title>

        {questions.map((q, idx) => (
          <div key={idx} className="d-flex align-items-start mb-3">
            <Form.Check
              type="checkbox"
              className="me-2 mt-2"
              checked={!!checkedQuestions[idx]}
              onChange={() => onCheck(idx)}

            />
            <Card className="ai-question-card mb-3 shadow-sm">
              <Card.Body>
                <Card.Title className="ai-question-title">
                  Question {idx + 1}
                </Card.Title>
                <Card.Text className="ai-question-text mb-3">
                  {q.question_text}
                </Card.Text>
                <div className="mb-3">
                  <Badge bg="info" className="me-2">
                    Word Limit: {q.word_limit}
                  </Badge>
                  <Badge bg="success">
                    Points: {q.points}
                  </Badge>
                </div>
                {q.grading_note && (
                  <Card.Text className="text-muted small ai-grading-note">
                    <strong>Grading Note:</strong> {q.grading_note}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}

        <div className="d-flex justify-content-end mb-3 mx-3" >
          <Button 
            variant="primary"
            onClick={onSaveChecked} 
          >
            ➕ Add Questions to the Exam
          </Button>
        </div>

      </Card.Body>
    </Card>
  );
}
