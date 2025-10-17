import React from "react";
import { Card, Badge, Collapse, Button, Form } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

export default function AIGeneratedCodeQuestions({ questions, onCheck, checkedQuestions, onSaveChecked, hasReachedLimit ,question_count, errors}) {
  const [showTestCases, setShowTestCases] = useState(false);

  return (
    <>
    {errors.topic && <div className="text-danger mx-3">{errors.topic}</div>}
    <Card className="mx-3 mx-md-5 mb-3">
        <Card.Header className="bg-secondary text-white">
            <h5>Generated Questions</h5>
        </Card.Header>
        <Card.Body>
    
        {questions.map((question, index) => (
            <div key={index} className="d-flex align-items-start mb-3">
            <Form.Check
              type="checkbox"
              className="me-2 mt-2"
              checked={!!checkedQuestions[index]}
              onChange={() => onCheck(index)}

            />
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
            </div>
        ))}
        </Card.Body>

        {/* Add Questions Button */}
        <div className="d-flex justify-content-end mb-3 mx-3" >
            <Button 
                variant="primary"
                onClick={onSaveChecked} 
                disabled={questions.length === 0 || !!hasReachedLimit}
            >
                ➕ Add Questions to the Exam
            </Button>
        </div>
        {
            <p className="text-success mt-2 text-sm mx-3">
                You can edit the points for each question after adding them to the exam.
            </p>
        }
        {hasReachedLimit && (
            <p className="text-danger mt-2 text-sm mx-3">
                You’ve reached the maximum number of questions ({question_count}). 
                Delete a question to add more.
            </p>
        )}
        {errors.limit && <div className="text-danger mx-3">{errors.limit}</div>}
    </Card>
    </>
  )
}
