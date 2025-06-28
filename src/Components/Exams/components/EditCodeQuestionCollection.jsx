import { Form, Row, Col, Button} from 'react-bootstrap';

export default function EditMcqQuestionCollection({questions, setQuestions}) {

  return (
    <>
      {questions.map((q, index) => {
        const answers = Array.isArray(q.answers) ? q.answers : [];

        return (
          <div key={q.question_id} className="mb-4 p-3 border rounded bg-light">
            <h6>Question {index + 1}</h6>

            {/* Question Description */}
            <Form.Group className="mb-2">
              <Form.Label>Question Description</Form.Label>
              <Form.Control
                type="text"
                value={q.question_description}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].question_description = e.target.value;
                    console.log('Updated Question Description:', updated[index].question_description);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            {/* Function signature */}
            <Form.Group className="mb-2">
              <Form.Label>Function Signature</Form.Label>
              <Form.Control
                type="text"
                value={q.function_signature}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].function_signature = e.target.value;
                    console.log('Updated Function Signature:', updated[index].function_signature);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            {/* Wrapper Code */}
            <Form.Group className="mb-2">
              <Form.Label>Wrapper Code</Form.Label>
              <Form.Control
                type="text"
                value={q.wrapper_code}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].wrapper_code = e.target.value;
                    console.log('Updated Wrapper Code:', updated[index].wrapper_code);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            

            {/* Points */}
            <Form.Group className="mb-2">
              <Form.Label>Points</Form.Label>
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
              />
            </Form.Group>

            {/* Test Cases */}
            <Form.Label>Test Cases</Form.Label>
            {q.test_cases.map((tc, tcIndex) => (
              <Row key={tcIndex} className="mb-2">
                <Col>
                  <Form.Control
                    placeholder="Input (JSON)"
                    value={JSON.stringify(tc.input)}
                    onChange={(e) => {
                      const updated = [...questions];
                      try {
                        updated[index].test_cases[tcIndex].input = JSON.parse(e.target.value);
                      } catch {
                        // Optionally show error for invalid JSON
                      }
                      setQuestions(updated);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Expected Output (JSON)"
                    value={JSON.stringify(tc.output)}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].test_cases[tcIndex].output = JSON.parse(e.target.value);
                      
                      setQuestions(updated);
                    }}
                  />
                </Col>
              </Row>
            ))}
          </div>
        );
      })}
    </>
  );
}
