import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Alert, ListGroup, Badge } from 'react-bootstrap';

const AIFeedbackPage = () => {
  const { examId } = useParams();

  // Sample data structure
  const feedbackData = {
    examOverview: {
      totalQuestions: 15,
      totalSubmissions: 87,
      averageScore: 72.5,
      difficultyBalance: { easy: 5, medium: 7, hard: 3 }
    },
    keyInsights: [
      {
        title: "Question Clarity",
        feedback: "3 questions confused many students",
        example: "Q7: 'Explain virtual DOM' was misinterpreted"
      },
      {
        title: "Knowledge Gaps",
        feedback: "State management concepts need reinforcement",
        example: "Only 41% answered useState dependencies correctly"
      }
    ],
    questionAnalysis: [
      {
        id: 4,
        text: "useEffect dependency question",
        issue: "42% missed missing dependencies",
        commonWrongAnswers: ["Needs cleanup", "Syntax errors"],
        suggestion: "More dependency array examples"
      }
    ],
    teachingRecommendations: [
      {
        area: "State Management",
        action: "Conduct useState/useReducer workshop",
        priority: "High"
      }
    ]
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h4>AI-Generated Teaching Feedback</h4>
          <span className="small">Exam ID: {examId}</span>
        </Card.Header>
        <Card.Body>
          {/* Exam Overview */}
          <div className="mb-4">
            <h5>Exam Overview</h5>
            <p>
              <strong>Questions:</strong> {feedbackData.examOverview.totalQuestions} | 
              <strong>Submissions:</strong> {feedbackData.examOverview.totalSubmissions} | 
              <strong>Avg Score:</strong> {feedbackData.examOverview.averageScore}%
            </p>
            <div>
              Difficulty: 
              <Badge bg="success" className="mx-1">
                Easy: {feedbackData.examOverview.difficultyBalance.easy}
              </Badge>
              <Badge bg="warning" className="mx-1">
                Medium: {feedbackData.examOverview.difficultyBalance.medium}
              </Badge>
              <Badge bg="danger" className="mx-1">
                Hard: {feedbackData.examOverview.difficultyBalance.hard}
              </Badge>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mb-4">
            <h5>Key Insights</h5>
            <ListGroup variant="flush">
              {feedbackData.keyInsights.map((insight, i) => (
                <ListGroup.Item key={i}>
                  <strong>{insight.title}:</strong> {insight.feedback}
                  {insight.example && (
                    <div className="text-muted small mt-1">Example: {insight.example}</div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* Question Analysis */}
          <div className="mb-4">
            <h5>Question Analysis</h5>
            <ListGroup variant="flush">
              {feedbackData.questionAnalysis.map((q, i) => (
                <ListGroup.Item key={i}>
                  <div className="fw-bold">Q{q.id}: {q.text}</div>
                  <div className="text-danger">Issue: {q.issue}</div>
                  {q.commonWrongAnswers && (
                    <div className="small text-muted">
                      Common errors: {q.commonWrongAnswers.join(", ")}
                    </div>
                  )}
                  <div className="text-success mt-1">
                    <i className="bi bi-lightbulb"></i> Suggestion: {q.suggestion}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* Recommendations */}
          <div>
            <h5>Teaching Recommendations</h5>
            <ListGroup>
              {feedbackData.teachingRecommendations.map((rec, i) => (
                <ListGroup.Item 
                  key={i}
                  className={rec.priority === "High" ? "list-group-item-danger" : ""}
                >
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>{rec.area}:</strong> {rec.action}
                    </span>
                    <Badge bg={rec.priority === "High" ? "danger" : "warning"}>
                      {rec.priority}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Card.Body>
      </Card>

      <Alert variant="info">
        <i className="bi bi-robot"></i> AI-generated feedback based on student response patterns
      </Alert>
    </Container>
  );
};

export default AIFeedbackPage;