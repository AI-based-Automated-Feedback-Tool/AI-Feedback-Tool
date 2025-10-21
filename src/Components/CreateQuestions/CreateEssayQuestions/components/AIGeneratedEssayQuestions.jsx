import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import '../../../../css/aiQuestionGeneration.css'
export default function AIGeneratedEssayQuestions({ questions }) {
  return (
    <Card className="parent-ai-card mb-4 mt-4 shadow-lg">
      <Card.Body>
        <Card.Title className="parent-card-title mb-4">
          Generated Essay Questions
        </Card.Title>

        {questions.map((q, idx) => (
          <Card key={idx} className="ai-question-card mb-3 shadow-sm">
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
        ))}

      </Card.Body>
    </Card>
  );
}
