import { Col, Row } from "react-bootstrap";
import {Form, Button} from "react-bootstrap";

export default function EssayQuestionGenerationForm({formState}) {
    const {
        topic,
        setTopic,
        difficultyLevel,
        setDifficultyLevel,
        guidance,
        setGuidance,
        keyConcepts,
        setKeyConcepts,
        doNotInclude,
        setDoNotInclude,
        wordLimitAI,
        setWordLimitAI,
        pointsAI,
        setPointsAI,
        noOfQuestion,
        setNoOfQuestion,
        gradingNotesAI,
        setGradingNotesAI,
        generateQuestion,
        error,
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
            <Form.Group className='mb-3'>
                <Form.Label className='fw-bold'>Guidance / Instructions *</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter any guidance or instructions here..."
                    value={guidance}
                    onChange={(e) => setGuidance(e.target.value)}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Row>
                    <Col md={6} xs={12}>
                        <Form.Label className='fw-bold'>Key Concept to Include *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter key concepts to be included in the essay..."
                            value={keyConcepts}
                            onChange={(e) => setKeyConcepts(e.target.value)}
                        />
                    </Col>
                    <Col md={6} xs={12}>
                        <Form.Label className='fw-bold'>Do Not Include *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter points or concepts to avoid in the essay..."
                            value={doNotInclude}
                            onChange={(e) => setDoNotInclude(e.target.value)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Row>
                    <Col md={4} xs={12}>
                        <Form.Label className='fw-bold'>Word Limit *</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter the word limit here..."
                            value={wordLimitAI}
                            onChange={(e) => setWordLimitAI(e.target.value)}
                        />
                    </Col>
                    <Col md={4} xs={12}>
                        <Form.Label className='fw-bold'>Points *</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter the points here..."
                            value={pointsAI}
                            onChange={(e) => setPointsAI(e.target.value)}
                        />
                    </Col>
                    <Col md={4} xs={12}>
                        <Form.Label className='fw-bold'>Number of Questions *</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="No of questions to generate..."
                            value={noOfQuestion}
                            onChange={(e) => setNoOfQuestion(e.target.value)}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='fw-bold'>Grading Notes *</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter any specific instructions for the essay question evaluation..."
                    value={gradingNotesAI}
                    onChange={(e) => setGradingNotesAI(e.target.value)}
                />
            </Form.Group>

            {/* Generate Button */}
            <div className="d-flex justify-content-end">
                <Button 
                    variant="primary"
                    onClick={generateQuestion}
                > 
                        ➕ Generate Questions
                </Button>
            </div>          
        </Form>
    </>
  )
}
