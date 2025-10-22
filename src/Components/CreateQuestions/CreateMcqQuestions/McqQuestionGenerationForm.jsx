import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import useMcqQuestionForm from "./hooks/useMcqQuestionForm";
import AIGeneratedQuestions from "./AIGeneratedQuestions";
export default function McqQuestionGenerationForm({onSave, warning, disabled, noOfQuestions, questionCount}) {
    const {
        errors,
        questionTopic, 
        setQuestionTopic,
        questionNo, 
        setQuestionNo,
        questionDifficulty, 
        setQuestionDifficulty,
        guidance, 
        setGuidance,
        keyConcepts, 
        setKeyConcepts,
        doNotInclude, 
        setDoNotInclude,
        generateQuestion,
        generatedQuestions,
        checkedAIQuestions,
        handleCheckboxChangeAIQ,
        saveCheckedQuestions,
        generatedAndSelectedQuestions,
        isGenerating,
    } = useMcqQuestionForm(onSave, questionCount, noOfQuestions);

  return (
    <>
        <Form>
            {warning && <Alert variant="warning">{warning}</Alert>}
            {/* Question Topic */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Topic of questions *</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={2} className="fs-6" 
                    value={questionTopic} 
                    onChange={e => setQuestionTopic(e.target.value)}
                    placeholder='Enter the topic of the question here...'
                />
                {errors.questionTopic && <div className="text-danger small">{errors.questionTopic}</div>}
            </Form.Group>

            {/* No of questions required */}
            <Form.Group className="mb-3">
                <Row>  
                    <Col md={6} xs={12}>
                        <Form.Label className="fw-bold">No of Questions required *</Form.Label>
                        <Form.Control 
                            className='mb-2' 
                            placeholder= {"Ex- 10"} 
                            onChange= {e => setQuestionNo(e.target.value)}
                            value= {questionNo}
                        />
                    </Col>

                    <Col md={6} xs={12}>
                        <Form.Label className="fw-bold">Difficulty *</Form.Label>
                        <Form.Select  
                            value={questionDifficulty} 
                            onChange={e => setQuestionDifficulty(e.target.value)}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </Form.Select>
                    </Col>                      
                </Row>
                {errors.questionNo && <div className="text-danger small">{errors.questionNo}</div>}
            </Form.Group>

            {/* Describe about the topic for guidance */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Guidance for question creation *</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2} className="fs-6" 
                    value={guidance} 
                    onChange={e => setGuidance(e.target.value)}
                    placeholder='Describe here about your topic'
                />
                {errors.guidance && <div className="text-danger small">{errors.guidance}</div>}
            </Form.Group>  

            {/* Extra Guidance */}            
            <Form.Group className="mb-3">
                <Row>
                    <Col md={6} xs={12}>
                        <Form.Label className="fw-bold">Key Concepts</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2} className="fs-6" 
                            value={keyConcepts} 
                            onChange={e => setKeyConcepts(e.target.value)}
                            placeholder='E.g.- If you want to focus on some key concepts, list them here...'
                        />
                    </Col>

                    <Col md={6} xs={12}>
                        <Form.Label className="fw-bold">Do not include</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2} className="fs-6" 
                            value={doNotInclude} 
                            onChange={e => setDoNotInclude(e.target.value)}
                            placeholder='E.g.- If there are specific things you want to avoid, list them here...'
                        />
                    </Col>                      
                </Row>                    
                {errors.correct && <div className="text-danger small">{errors.correct}</div>}
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

        {/* Display AI Generated Questions */}
        {errors.generation && 
            <div className="text-danger mx-3">
                {errors.generation}
            </div>
        }
        {generatedQuestions.length > 0 && (
            <AIGeneratedQuestions 
                questions={generatedQuestions} 
                checkedQuestions={checkedAIQuestions}
                onCheck={handleCheckboxChangeAIQ}
                onSaveChecked={saveCheckedQuestions}
                errors={errors}
            />
        )}
    </>
  )
}