import { Card, Col, Row } from "react-bootstrap";
import {Form, Button} from "react-bootstrap";
import { useState } from "react";
import AIGeneratedEssayQuestions from "./AIGeneratedEssayQuestions";
import '../../../../css/questionCreation/EssayCreation.css';

export default function EssayQuestionGenerationForm({formState}) {
    const {
        question,
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
        isGenerating,
        generateError,
        hasReachedLimit,
        aiModel,
        setAiModel
    }= formState;

    const [isModelOpen, setIsModelOpen] = useState(false);
    const aiModels = [
        { value: "cohere", label: "Cohere AI", badge: "Fast" },
        { value: "deepseek", label: "DeepSeek", badge: "Free / Slower" }
    ];
    const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

  return (
    <div className="essay-ai-page">
        <div className="container">
            {/* AI Model Selection */}
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

            {/*Main Form Card */}
            <div className="glass-card">
                <div className="gradient-header">
                    <h4>
                        <i className="fas fa-magic me-2"></i>
                        Generate Essay Questions
                    </h4>
                </div>

                <div className="p-4">
                    <Form className="space-y-5">
                        {/* Topic*/}
                        <Form.Group className="form-group" controlId="topic">
                            <Form.Label className="form-label">
                                <i className="fas fa-book-open icon"></i> Topic *
                            </Form.Label>                            
                            <Form.Control 
                                as ="textarea"
                                rows={1}
                                className="form-textarea"
                                placeholder="Enter topic (e.g., Climate Change, Ethics in AI)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            {error.topic && (
                                <div className="error-alert">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {error.topic}
                                </div>
                            )}
                        </Form.Group>

                        {/* Difficulty Level */}
                        <Form.Group className='form-group' controlId='difficultyLevel'>
                            <Form.Label className='form-label'>
                                <i className="fas fa-tachometer-alt icon"></i> Difficulty Level *
                            </Form.Label>
                            <div className="custom-select">
                                <div
                                    className="select-trigger"
                                    onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
                                >
                                    <span>
                                        {difficultyLevel || "Select Difficulty Level"}
                                    </span>
                                    <i className={`fas fa-chevron-down arrow ${isDifficultyOpen ? "rotated" : ""}`}></i>
                                </div>

                                {isDifficultyOpen && (
                                    <ul className="select-menu">
                                        {["Easy", "Medium", "Hard"].map((level) => (
                                            <li
                                                key={level}
                                                className="select-option"
                                                onClick={() => {
                                                    setDifficultyLevel(level);
                                                    setIsDifficultyOpen(false);
                                                }}
                                            >
                                                {level}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {error.difficultyLevel && (
                                <div className="error-alert">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {error.difficultyLevel}
                                </div>
                            )}
                        </Form.Group>

                        {/* Guidance */}
                        <Form.Group className='form-group' controlId='guidance'>
                            <Form.Label className='form-label'>
                                <i className="fas fa-lightbulb icon"></i>
                                 Guidance / Instructions *
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                className="form-textarea"
                                placeholder="Describe tone, depth, structure..."
                                value={guidance}
                                onChange={(e) => setGuidance(e.target.value)}
                            />
                            {error.guidance && (
                                <div className="error-alert">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {error.guidance}
                                </div>
                            )}
                        </Form.Group>

                        {/* Key Concepts and Avoid */}
                        <Form.Group className='form-group' controlId='keyConceptsAvoid'>
                            <Form.Label className='form-label'>
                                <i className="fas fa-key icon"></i> Key Concepts to Include / Do Not Include
                            </Form.Label>
                            <Row className='g-3'>
                                <Col md={6}>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        className="form-textarea"
                                        placeholder="E.g., critical thinking, analysis..."
                                        value={keyConcepts}
                                        onChange={(e) => setKeyConcepts(e.target.value)}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        className="form-textarea"
                                        placeholder="E.g., avoid politics, religion..."
                                        value={doNotInclude}
                                        onChange={(e) => setDoNotInclude(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* Word Limit and Points */}
                        <Form.Group className="form-group" controlId="wordLimitPoints">
                            <Form.Label className='form-label'>
                                <i className="fas fa-cog icon"></i> Word Limit & Points *
                            </Form.Label>
                            <Row className='g-3'>
                                <Col md={4}>
                                    <Form.Control 
                                        type="number"
                                        className="form-input"
                                        placeholder="E.g. 500"
                                        value={wordLimitAI}
                                        onChange={(e) => setWordLimitAI(e.target.value)}
                                    />
                                    {error.wordLimitAI && (
                                        <div className="error-alert">
                                            <i className="fas fa-exclamation-triangle icon"></i>
                                            {error.wordLimitAI}
                                        </div>
                                    )}
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="number" 
                                        className="form-input"
                                        min={1}
                                        placeholder="E.g. 10"
                                        value={pointsAI}
                                        onChange={(e) => setPointsAI(e.target.value)}
                                    />
                                    {error.pointsAI && (
                                        <div className="error-alert">
                                            <i className="fas fa-exclamation-triangle icon"></i>
                                            {error.pointsAI}
                                        </div>
                                    )}
                                </Col>
                                <Col md={4}>
                                    <Form.Control 
                                        type="number"
                                        className="form-input"
                                        min={1}
                                        placeholder="No of Questions"
                                        value={noOfQuestion}
                                        onChange={(e) => setNoOfQuestion(e.target.value)}
                                    />
                                    {error.noOfQuestion && (
                                        <div className="error-alert">
                                            <i className="fas fa-exclamation-triangle icon"></i>
                                            {error.noOfQuestion}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* Grading Notes */}
                        <Form.Group className='form-group' controlId='gradingNotes'>
                            <Form.Label className='form-label'>
                                <i className="fas fa-clipboard-list icon"></i> Grading Notes *
                            </Form.Label>   
                            <Form.Control
                                as="textarea"
                                rows={3}
                                className="form-textarea"
                                placeholder="E.g., focus on clarity, coherence..."
                                value={gradingNotesAI}
                                onChange={(e) => setGradingNotesAI(e.target.value)}
                            />
                            {error.gradingNotesAI && (
                                <div className="error-alert">
                                    <i className="fas fa-exclamation-triangle icon"></i>
                                    {error.gradingNotesAI}
                                </div>
                            )}
                        </Form.Group>

                        {/* Generate Button */}
                        <div className="text-end mt-4">
                            <button
                                type="button"
                                className="action-btn"
                                onClick={generateQuestion}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-magic me-2"></i> Generate Questions
                                    </>
                                )}
                            </button>
                        </div>
                        {error.usageLimit && (
                            <div className="error-alert mt-4 text-center">
                                <i className="fas fa-exclamation-triangle icon"></i>
                                {error.usageLimit}
                            </div>
                        )}          
                    </Form>
                </div>
            </div>

            {/* Generation error */}
            {generateError && (
                <div className="error-alert mt-4 text-center">
                    <i className="fas fa-exclamation-triangle icon"></i>
                    {typeof generateError === "string" 
                    ? generateError 
                    : generateError.generate || "Failed to generate questions"}
                </div>
            )}

            {/* Generated Questions */}
            {generatedQuestions.length > 0 && (
                <div className="mt-5">
                    <AIGeneratedEssayQuestions 
                        questions={generatedQuestions}
                        checkedQuestions={checkedQuestions}
                        onCheck={handleCheckboxChangeEssay}
                        onSaveChecked={saveCheckedQuestions}
                        generateError={generateError}
                        error={error}
                        hasReachedLimit={hasReachedLimit}
                    />
                </div>
            )}
        </div>
    </div>
  )
}
                    