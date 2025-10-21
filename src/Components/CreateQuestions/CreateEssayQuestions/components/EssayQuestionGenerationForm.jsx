import { Col, Row } from "react-bootstrap";
import {Form, Button} from "react-bootstrap";
import AIGeneratedEssayQuestions from "./AIGeneratedEssayQuestions";

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
        isDisabled,
        generatedQuestions,
        checkedQuestions,
        setCheckedQuestions,
        handleCheckboxChangeEssay,
        saveCheckedQuestions,
        isGenerating
    }= formState;
  return (
    <>
        <Form className="mx-3 mx-md-5">
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
                        {error.topic && <div className="text-danger">{error.topic}</div>}
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
                        {error.difficultyLevel && <div className="text-danger">{error.difficultyLevel}</div>}
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
                {error.guidance && <div className="text-danger">{error.guidance}</div>}
            </Form.Group>
            <Form.Group className='mb-3'>
                <Row>
                    <Col md={6} xs={12}>
                        <Form.Label className='fw-bold'>Key Concept to Include </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Eg: critical thinking, analysis, etc..."
                            value={keyConcepts}
                            onChange={(e) => setKeyConcepts(e.target.value)}
                        />
                    </Col>
                    <Col md={6} xs={12}>
                        <Form.Label className='fw-bold'>Do Not Include </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Eg: political topics, historical events, etc..."
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
                        {error.wordLimitAI && <div className="text-danger">{error.wordLimitAI}</div>}
                    </Col>
                    <Col md={4} xs={12}>
                        <Form.Label className='fw-bold'>Points *</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter the points here..."
                            value={pointsAI}
                            onChange={(e) => setPointsAI(e.target.value)}
                        />
                        {error.pointsAI && <div className="text-danger">{error.pointsAI}</div>}
                    </Col>
                    <Col md={4} xs={12}>
                        <Form.Label className='fw-bold'>Number of Questions *</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="No of questions to generate..."
                            value={noOfQuestion}
                            onChange={(e) => setNoOfQuestion(e.target.value)}
                        />
                        {error.noOfQuestion && <div className="text-danger">{error.noOfQuestion}</div>}
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='fw-bold'>Grading Notes *</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Eg: Focus on clarity, coherence, argument strength..."
                    value={gradingNotesAI}
                    onChange={(e) => setGradingNotesAI(e.target.value)}
                />
                {error.gradingNotesAI && <div className="text-danger">{error.gradingNotesAI}</div>}
            </Form.Group>

            {/* Generate Button */}
            <div className="d-flex justify-content-end">
                <Button 
                    variant="primary"
                    onClick={generateQuestion}
                    disabled={isGenerating}
                >
                    {isGenerating ? ( 
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                        </>
                    ) : (
                        "➕ Generate Questions"
                    )}
                </Button>
            </div>          
        </Form>

        {/* Show Generated Questions */}
        {generatedQuestions.length > 0 && (
            <AIGeneratedEssayQuestions 
                questions={generatedQuestions} 
                checkedQuestions={checkedQuestions}
                onCheck={handleCheckboxChangeEssay}
                onSaveChecked={saveCheckedQuestions}
            />
        )}
    </>
  )
}
