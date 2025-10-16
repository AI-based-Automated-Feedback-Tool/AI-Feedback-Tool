import React from "react";
import { Card, Badge, Collapse, Button } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AIGeneratedCodeQuestions({ questions }) {
  const [showTestCases, setShowTestCases] = React.useState(false);

  return (
    <>
        {questions.map((question) => (
            <Card className="mb-3 shadow-sm">
                <Card.Body>
                    <Card.Title>
                        <strong>Question:</strong> {question.question_description}
                    </Card.Title>
                    <Badge bg="info" className="mb-2">Points: {question.points}</Badge>
                    <Card.Subtitle className="mb-2 text-muted">
                        Function Signature:
                    </Card.Subtitle>
                    <SyntaxHighlighter language="python" style={coy}>
                        {question.function_signature}
                    </SyntaxHighlighter>
                    
                    <Card.Subtitle className="mt-2 mb-2 text-muted">
                        Wrapper Code:
                    </Card.Subtitle>
                    <SyntaxHighlighter language="python" style={coy}>
                        {question.wrapper_code}
                    </SyntaxHighlighter>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowTestCases(!showTestCases)}
                        className="mt-2"
                    >
                        {showTestCases ? "Hide Test Cases" : "Show Test Cases"}
                    </Button>
                    <Collapse in={showTestCases}>
                        <div className="mt-2">
                            {question.test_cases.map((tc, idx) => (
                            <Card key={idx} className="mb-1 p-2 bg-light">
                                <div>
                                    <strong>Input:</strong>{" "}
                                    {JSON.stringify(tc.input)}
                                </div>
                                <div>
                                    <strong>Output:</strong>{" "}
                                    {JSON.stringify(tc.output)}
                                </div>
                            </Card>
                            ))}
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        ))}
    </>
  )
}
