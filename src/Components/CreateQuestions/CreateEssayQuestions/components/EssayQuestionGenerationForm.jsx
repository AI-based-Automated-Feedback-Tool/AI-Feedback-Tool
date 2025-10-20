import { Col, Row } from "react-bootstrap";
import {Form} from "react-bootstrap";

export default function EssayQuestionGenerationForm({formState}) {
    const {
        topic,
        setTopic,
        difficultyLevel,
        setDifficultyLevel,
        questionText,
        attachments,
        wordLimit,
        points,
        gradingNotes,
        setQuestionText,
        setAttachments, 
        setWordLimit,
        setPoints,
        setGradingNotes,
        onSaveQuestion,
        error,
        fileInputRef,
        isDisabled
    }= formState;
  return (
    <>
        <Form>
            <Form.Group className='mb-3'>
                <Row>
                    <Col md={6} xs={12}>
                        <Form.Label className='fw-bold'>Topic / Subject *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder="Enter the topic for essay questions here..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </Col>
                    <Col md={6} xs={12}>
                        <Form.Label className='fw-bold'>Difficulty Level *</Form.Label>
                        <Form.Select
                            value={difficultyLevel}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Form.Group>
        </Form>
    </>
  )
}
