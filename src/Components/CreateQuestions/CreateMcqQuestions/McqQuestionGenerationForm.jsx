import { Form, Button, Row, Col, Card, Alert, Container } from "react-bootstrap";
import { useState } from "react";
import useMcqQuestionForm from "./hooks/useMcqQuestionForm";
import AIGeneratedQuestions from "./AIGeneratedQuestions";

export default function McqQuestionGenerationForm({onSave, warning, disabled, questionCount, noOfQuestions, loadCount, usageCount}) {
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
        setAiModel,
        aiModel,
        gradingNotes, 
        setGradingNotes
    } = useMcqQuestionForm(onSave, questionCount, noOfQuestions, loadCount, usageCount);

    const [isModelOpen, setIsModelOpen] = useState(false);
    const aiModels = [
        { value: "cohere", label: "Cohere AI", badge: "Fast" },
        { value: "deepseek", label: "DeepSeek", badge: "Free / Slower" }
    ];
    const difficultyOptions = ["Easy", "Medium", "Hard"];
  return (
    <div className="mcq-page">
        <div className="container">

            {/* AI Model Selector */}
            <div className="glass-card p-4 mb-5 text-center">
                <h4 className="gradient-header mb-4">
                    <i className="fas fa-robot me-2"></i> Select AI Model
                </h4>
                <div className="custom-select mx-auto" style={{ maxWidth: '380px' }}>
                    <div
                        className="select-trigger"
                        onClick={() => setIsModelOpen(!isModelOpen)}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="text-start">
                                <div className="fw-bold">
                                    {aiModels.find(m => m.value === aiModel)?.label || "Select Model"}
                                </div>
                                <small className="text-muted">
                                    {aiModels.find(m => m.value === aiModel)?.badge}
                                </small>
                            </div>
                        </div>
                        <i className={`fas fa-chevron-down arrow ${isModelOpen ? "rotated" : ""}`}></i>
                    </div>
                    {isModelOpen && (
                        <ul className="select-menu">
                            {aiModels.map(model => (
                                <li
                                    key={model.value}
                                    className="select-option d-flex justify-content-between align-items-center"
                                    onClick={() => {
                                        setAiModel(model.value);
                                        setIsModelOpen(false);
                                    }}
                                >
                                    <span>{model.label}</span>
                                    <span className="badge bg-primary small">{model.badge}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <p className="text-muted small mt-3">
                    Choose the AI model to generate questions. Cohere AI is faster, DeepSeek is free but slower.
                </p>
            </div>

            {/* Main Form Card */}
            <div className="glass-card">
                <div className="gradient-header">
                    <h4>
                        <i className="fas fa-magic me-2"></i> 
                        Generate MCQ Questions
                    </h4>
                </div>

                <div className="p-4">
                    {warning && (
                        <div className="error-alert mb-4">
                            <i className="fas fa-exclamation-triangle icon"></i>
                            {warning}
                        </div>
                    )}

                    <Form className="p-4 space-y-5">
                    {/* Question Topic */}
                        <Form.Group className="form-group" controlId="questionTopic">
                            <Form.Label className="form-label">
                                <i className="fas fa-question-circle icon"></i> Topic of questions *
                            </Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                className="form-textarea" 
                                value={questionTopic} 
                                onChange={e => setQuestionTopic(e.target.value)}
                                placeholder='Enter the topic of the question here...'
                            />
                            {errors.questionTopic && (
                                <div className="error-alert">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {errors.questionTopic}
                                </div>
                            )}
                        </Form.Group>

                        {/* No of questions required */}
                        <Form.Group className="form-group" controlId="questionNoDifficulty">
                            <Form.Label className="form-label">
                                <i className="fas fa-list-ol icon"></i> No ofQuestions & Difficulty *
                            </Form.Label>
                            <Row className="g-3">
                                <Col md={6} xs={12}>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        className='form-input'
                                        placeholder={"Ex- 10"}
                                        onChange={e => setQuestionNo(e.target.value)}
                                        value={questionNo}
                                    />
                                </Col>

                                <Col md={6} xs={12}>
                                    <div className="custom-select">
                                        <Form.Select  
                                            value={questionDifficulty} 
                                            onChange={e => setQuestionDifficulty(e.target.value)}
                                            className='form-select'
                                        >
                                            {difficultyOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </Col>                      
                            </Row>
                            {errors.questionNo && (
                                <div className="error-alert">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {errors.questionNo}
                                </div>
                            )}
                        </Form.Group>

                        {/* Describe about the topic for guidance */}
                        <Form.Group className="form-group" controlId="guidance">
                            <Form.Label className="form-label">
                                <i className="fas fa-lightbulb icon"></i> Guidance for question creation *
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3} 
                                className="form-textarea" 
                                value={guidance} 
                                onChange={e => setGuidance(e.target.value)}
                                placeholder='Describe here about your topic'
                            />
                            {errors.guidance && (
                                <div className="error-alert">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {errors.guidance}
                                </div>
                            )}
                        </Form.Group>

                        {/* Extra Guidance */}            
                        <Form.Group className="form-group" controlId="extraGuidance">
                            <Form.Label className="form-label">
                                <i className="fas fa-key icon"></i> Extra Guidance
                            </Form.Label>
                            <Row className="g-3">
                                <Col md={6} xs={12}>
                                    <Form.Control
                                        as="textarea"
                                        rows={3} 
                                        className="form-textarea" 
                                        value={keyConcepts} 
                                        onChange={e => setKeyConcepts(e.target.value)}
                                        placeholder='E.g.- If you want to focus on some key concepts, list them here...'
                                    />
                                </Col>

                                <Col md={6} xs={12}>
                                    <Form.Control
                                        as="textarea"
                                        rows={3} 
                                        className="form-textarea" 
                                        value={doNotInclude} 
                                        onChange={e => setDoNotInclude(e.target.value)}
                                        placeholder='E.g.- If there are specific things you want to avoid, list them here...'
                                    />
                                </Col>                      
                            </Row>                    
                            {errors.correct && (
                                <div className="text-danger small">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {errors.correct}
                                </div>
                            )}
                        </Form.Group>

                        {/* Guidance for grading/points */}
                        <Form.Group className="form-group" controlId="gradingNotes">
                            <Form.Label className="form-label">
                                <i className="fas fa-star icon"></i>
                                Grading / Points *
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="form-input"
                                value={gradingNotes}
                                onChange={e => setGradingNotes(e.target.value)}
                                placeholder='Create 2 points questions .... '
                            />
                            {errors.gradingNotes && (
                                <div className="text-danger small">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {errors.gradingNotes}
                                </div>
                            )}
                        </Form.Group>

                        {/* Generate Button */}
                        <div className="text-end mt-4">
                            <button 
                                type="button"
                                className="action-btn"
                                variant="primary"
                                onClick={generateQuestion}
                                disabled={isGenerating}
                            > 
                                {isGenerating ? (
                                    <>
                                        <div className="spinner" ></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-magic me-2"></i>
                                        Generate Questions
                                    </>
                                )}
                            </button>
                        </div> 
                        {errors.usageLimit && (
                            <div className="error-alert mt-4 text-center">
                                <i className="fas fa-exclamation-triangle icon"></i>
                                {errors.usageLimit}
                            </div>
                        )}
                    </Form>
                </div>
            </div>

            {/* Display AI Generated Questions */}
            {errors.generation && (
                <div className=" error-alert mt-4 text-center">
                    <i className="fas fa-exclamation-triangle icon"></i>
                    {errors.generation}
                </div>
            )}

            {/*AI Generated Questions Section*/}
            {generatedQuestions.length > 0 && (
                <div className="mt-5">
                    <AIGeneratedQuestions 
                        questions={generatedQuestions} 
                        checkedQuestions={checkedAIQuestions}
                        onCheck={handleCheckboxChangeAIQ}
                        onSaveChecked={saveCheckedQuestions}
                        errors={errors}
                    />
                </div>
            )}
        </div>
    </div>  
  );
}