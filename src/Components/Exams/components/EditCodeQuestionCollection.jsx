import { Form, Row, Col, Button, Badge} from 'react-bootstrap';
import { useState } from 'react';
import '../../../css/EditExam/EditCodeQuestionCollection.css';
export default function EditMcqQuestionCollection({questions, setQuestions}) {
  const [testCaseInputs, setTestCaseInputs] = useState({});
  return (
    <div className="edit-mcq-question-collection">
      {questions.map((q, index) => {
        return (
          <div key={q.question_id} className="code-question-card">
            <div className="code-question-header">
              <div className="d-flex align-items-center gap-3">
                <div className="code-icon">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <h5 className="code-title mb-0">
                  Question {index + 1}
                </h5>
              </div>

              <span className="points-badge">
                {q.points || 0} pts
              </span>
            </div>

            {/* Question Description */}
            <Form.Group className="mb-3" controlId={`desc-${q.question_id}`}>
              <Form.Label className="input-label">
                Question Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={q.question_description}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].question_description = e.target.value;
                    console.log('Updated Question Description:', updated[index].question_description);
                  setQuestions(updated);
                }}
                className='question-textarea'
              />
            </Form.Group>

            {/* Function signature */}
            <Form.Group className="mb-3" controlId={`sig-${q.question_id}`}>
              <Form.Label className='input-label'>
                Function Signature
              </Form.Label>
              <Form.Control
                type="text"
                value={q.function_signature}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].function_signature = e.target.value;
                    console.log('Updated Function Signature:', updated[index].function_signature);
                  setQuestions(updated);
                }}
                className='code-input'
              />
            </Form.Group>

            {/* Wrapper Code */}
            <Form.Group className="mb-3" controlId={`wrapper-${q.question_id}`}>
              <Form.Label className='input-label'>
                Wrapper Code
              </Form.Label>
              <Form.Control
                as="textarea"
                value={q.wrapper_code}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].wrapper_code = e.target.value;
                    console.log('Updated Wrapper Code:', updated[index].wrapper_code);
                  setQuestions(updated);
                }}
                className='code-textarea'
              />
            </Form.Group>

            {/* Points */}
            <Form.Group className="mb-3" controlId={`points-${q.question_id}`}>
              <Form.Label className="fw-bold me-3">Points</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={q.points || ''}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].points = parseInt(e.target.value) || 0;
                  console.log('Updated Points:', updated[index].points);
                  setQuestions(updated);
                }}
                className="points-input d-inline-block"
              />
            </Form.Group>

            {/* Test Cases */}
            <div className="test-cases-section">
              <Form.Label className="section-title">
                Test Cases ({q.test_cases?.length || 0})
              </Form.Label>
              
              <Row className="test-cases-header g-0 mb-2">
                <Col md={6} >
                  <strong className="text-primary">Input</strong>
                </Col>
                <Col md={6} >
                  <strong className="text-success">Expected Output</strong>
                </Col>
              </Row>

              {q.test_cases.map((tc, tcIndex) => (
                <Row key={tcIndex} className="test-case-row g-3 mb-3 align-items-center">
                  <Col md ={5}>
                    <Form.Control
                      as="textarea"
                      placeholder="Input (JSON)"
                      rows={1}
                      value={testCaseInputs[`${index}-${tcIndex}-input`] ?? JSON.stringify(tc.input, null, 2)}
                      onChange={(e) => {
                        setTestCaseInputs(prev => ({
                          ...prev,
                          [`${index}-${tcIndex}-input`]: e.target.value
                        }));
                        const updated = [...questions];
                        updated[index].test_cases[tcIndex].input = JSON.parse(e.target.value);                      
                        setQuestions(updated);
                      }}
                      className='test-input'
                    />
                  </Col>
                  <Col md ={5}>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      placeholder="Expected Output (JSON)"
                      value={testCaseInputs[`${index}-${tcIndex}-output`] ?? JSON.stringify(tc.output, null, 2)}
                      onChange={(e) => {
                        setTestCaseInputs(prev => ({
                          ...prev,
                          [`${index}-${tcIndex}-output`]: e.target.value
                        }));
                        const updated = [...questions];
                        updated[index].test_cases[tcIndex].output = JSON.parse(e.target.value);                      
                        setQuestions(updated);
                      }}
                      className='test-output'
                    />
                  </Col>
                  <Col md={2} className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="remove-testcase-btn"
                      onClick={() => {
                        const updated = [...questions];
                        updated[index].test_cases.splice(tcIndex, 1);
                        setQuestions(updated);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
            <hr className="question-divider" />
          </div>
        );
      })}
    </div>
  );
}
