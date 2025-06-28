import { Form, Row, Col, Button} from 'react-bootstrap';

export default function EditEssayQuestionCollection({questions, setQuestions}) {

  return (
    <>
      {questions.map((q, index) => {
        const answers = Array.isArray(q.answers) ? q.answers : [];

        return (
          <div key={q.question_id} className="mb-4 p-3 border rounded bg-light">
            <h6>Question {index + 1}</h6>

            {/* Question text */}
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

            {/* Grading Notes */}
            <Form.Group className="mb-2">
              <Form.Label>Grading Note</Form.Label>
              <Form.Control
                type="text"
                value={q.grading_note}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].function_signature = e.target.value;
                    console.log('Updated Function Signature:', updated[index].function_signature);
                  setQuestions(updated);
                }}
              />
            </Form.Group>

            {/* Word Limit */}
            <Form.Group className="mb-2">
              <Form.Label>Word Limit</Form.Label>
              <Form.Control
                type="text"
                value={q.word_limit}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].word_limit = e.target.value;
                    console.log('Updated Word Limit:', updated[index].word_limit);
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

            {/* Attachments */}
            <Form.Group className="mb-2">
              <Form.Label>Attachments</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].attachments = Array.from(e.target.files);
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
