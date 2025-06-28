import { Form, Row, Col } from 'react-bootstrap';

export default function EditQuestionCollection({questions, setQuestions}) {

  return (
    <>
      {questions.map((q, index) => {
        const answers = Array.isArray(q.answers) ? q.answers : [];

        return (
          <div key={q.question_id} className="mb-4 p-3 border rounded bg-light">
            <h6>Question {index + 1}</h6>

            {/* Question Text */}
            <Form.Group className="mb-2">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                type="text"
                value={q.question_text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].question_text = e.target.value;
                    console.log('Updated Question Text:', updated[index].question_text);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            {/* Options A-D */}
            <Row>
              {['A', 'B', 'C', 'D'].map((label, i) => (
                <Col md={6} key={i}>
                  <Form.Group className="mb-2">
                    <Form.Label>Option {label}</Form.Label>
                    <Form.Control
                      type="text"
                      value={q.options[i] || ''}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[index].options[i] = e.target.value;
                        console.log(`Updated Option ${label}:`, updated[index].options[i]);
                        setQuestions(updated);
                      }}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            {/* Number of Correct Answers */}
            <Form.Group className="mb-2">
              <Form.Label>Number of Correct Answers</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={q.options.length}
                value={q.no_of_correct_answers || ''}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].no_of_correct_answers = parseInt(e.target.value) || 1;
                    console.log('Updated No. of Correct Answers:', updated[index].no_of_correct_answers);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            {/* Correct Answers */}
            <Form.Group className="mb-3">
                <Form.Label>Correct Answers</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                    {q.options.map((opt, optIndex) => (
                        <Form.Check
                            key={optIndex}
                            type="checkbox"
                            id={`q${index}_opt${optIndex}`}
                            label={opt || `Option ${String.fromCharCode(65 + optIndex)}`}
                            checked={q.answers.includes(opt)} // check by option string
                            onChange={() => {
                            const updated = [...questions];
                            const currentAnswers = updated[index].answers || [];

                            if (currentAnswers.includes(opt)) {
                                updated[index].answers = currentAnswers.filter(a => a !== opt);
                            } else {
                                updated[index].answers = [...currentAnswers, opt];
                            }

                            setQuestions(updated);
                            }}
                        />
                    ))}
                </div>
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
          </div>
        );
      })}
    </>
  );
}
