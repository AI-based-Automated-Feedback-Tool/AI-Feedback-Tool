import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Alert, ListGroup, Badge } from 'react-bootstrap';

const AIFeedbackPage = () => {
  const { examId } = useParams();

  // Sample AI-generated pedagogical feedback
  const aiFeedback = {
    examOverview: {
      totalQuestions: 15,
      totalSubmissions: 87,
      averageScore: 72.5,
      difficultyBalance: {
        easy: 5,
        medium: 7,
        hard: 3
      }
    },
    keyInsights: [
      {
        title: "Question Clarity",
        feedback: "3 questions had wording that confused >30% of students (Q4, Q7, Q12)",
        example: "Q7: 'Explain the virtual DOM' was interpreted literally by 25% of students"
      },
      {
        title: "Knowledge Gaps",
        feedback: "Students struggled most with state management (average 58% correct vs 75% overall)",
        example: "Only 41% correctly answered the useState dependency question"
      },
      {
        title: "Effective Questions",
        feedback: "5 questions perfectly discriminated between strong and weak students",
        example: "Q2 (React lifecycle methods) had 92% accuracy with strong correlation to final grades"
      }
    ],
    questionAnalysis: [
      {
        id: 4,
        text: "What's wrong with this useEffect hook?",
        issue: "42% missed the missing dependency array",
        commonWrongAnswers: [
          "30% thought it needed cleanup",
          "28% incorrectly cited syntax errors"
        ],
        suggestion: "Provide more examples of dependency array usage"
      },
      {
        id: 12,
        text: "Convert this class component to hooks",
        issue: "35% forgot to handle componentDidMount",
        commonWrongAnswers: [
          "40% kept class state syntax",
          "25% misused useEffect"
        ],
        suggestion: "Create a step-by-step conversion guide"
      }
    ],
    teachingRecommendations: [
      {
        area: "State Management",
        action: "Run a dedicated workshop on useState/useReducer",
        priority: "High"
      },
      {
        area: "Component Lifecycle",
        action: "Add visual timelines showing mount/update phases",
        priority: "Medium"
      },
      {
        area: "Performance Optimization",
        action: "Demonstrate React.memo with before/after metrics",
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
          <div className="mb-4">
            <h5>Exam Overview</h5>
            <p>
              This exam had <strong>{aiFeedback.examOverview.totalQuestions} questions</strong> 
              completed by <strong>{aiFeedback.examOverview.totalSubmissions} students</strong>.
              The difficulty balance was well distributed with 
              <Badge bg="success" className="mx-1">{aiFeedback.examOverview.difficultyBalance.easy} Easy</Badge>
              <Badge bg="warning" className="mx-1">{aiFeedback.examOverview.difficultyBalance.medium} Medium</Badge>
              <Badge bg="danger" className="mx-1">{aiFeedback.examOverview.difficultyBalance.hard} Hard</Badge>
              questions.
            </p>
          </div>

          <div className="mb-4">
            <h5>Key Insights</h5>
            <ListGroup variant="flush">
              {aiFeedback.keyInsights.map((insight, i) => (
                <ListGroup.Item key={i}>
                  <strong>{insight.title}:</strong> {insight.feedback}
                  <div className="text-muted small mt-1">Example: {insight.example}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="mb-4">
            <h5>Problematic Questions</h5>
            <ListGroup variant="flush">
              {aiFeedback.questionAnalysis.map((q, i) => (
                <ListGroup.Item key={i}>
                  <div className="fw-bold">Q{q.id}: {q.text}</div>
                  <div className="text-danger">Issue: {q.issue}</div>
                  <div className="small text-muted">
                    Common misconceptions: {q.commonWrongAnswers.join("; ")}
                  </div>
                  <div className="text-success mt-1">
                    <i className="bi bi-lightbulb"></i> Suggestion: {q.suggestion}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div>
            <h5>Recommended Teaching Adjustments</h5>
            <ListGroup>
              {aiFeedback.teachingRecommendations.map((rec, i) => (
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
        <i className="bi bi-robot"></i> This feedback was generated by analyzing patterns in student responses.
        The AI identified common misconceptions and suggested targeted improvements.
      </Alert>
    </Container>
  );
};

export default AIFeedbackPage;