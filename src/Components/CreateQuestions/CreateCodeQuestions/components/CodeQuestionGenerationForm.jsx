import { ButtonGroup, Card, Col, Form, Row, ToggleButton, Button } from 'react-bootstrap'
import useFetchLanguages from "../hooks/useFetchLanguages";
import { useState } from 'react';
import AIGeneratedCodeQuestions from './AIGeneratedCodeQuestions';
import '../../../../css/questionCreation/CodeCreation.css';

export default function CodeQuestionGenerationForm({formState, question_count}) {
  const {
      errors,
      setErrors,
      aiformSelectedLanguage,
      setAiformSelectedLanguage,
      difficulty,
      setDifficulty,
      subQuestionType,
      setSubQuestionType,
      guidance,
      setGuidance,
      keyConcepts,
      setKeyConcepts,
      doNotInclude,
      setDoNotInclude,
      questionNo,
      setQuestionNo,
      expectedFunctionSignature,  
      setExpectedFunctionSignature,
      gradingDescription,
      setGradingDescription,
      topicDescription,
      setTopicDescription,
      handleGenerateQuestions,
      generatedCodeQuestions,
      setGeneratedCodeQuestions,
      isGenerating,
      setIsGenerating,
      checkedAICodeQuestions,
      handleCheckboxChangeCode,
      saveCheckedQuestions,
      hasReachedLimit,
      aiModel,
      setAiModel
    } = formState;

    const {languages, loading} = useFetchLanguages(setErrors);
    const difficultyLevels = ['Easy', 'Medium', 'Hard'];

    const [isModelOpen, setIsModelOpen] = useState(false);
    const aiModels = [
        { value: "cohere", label: "Cohere AI", badge: "Fast" },
        { value: "deepseek", label: "DeepSeek", badge: "Free / Slower" }
    ];
    

  return (
    <div className="code-question-generation-form">
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

      <div className="glass-card">
        <div className="gradient-header">
          <h4>
            <i className="fas fa-magic me-2"></i> 
            Generate Code Questions
          </h4>
        </div>

        <div className='p-4'>
          <Form className="p-4 space-y-5">
            <h4 className='outside-card-label'>Question Setup</h4>
            <Card className='p-4 mb-4'>
              <Form.Group className='form-group mb-4' controlId='topicDescription'>
                <Form.Label className='form-label'>
                  <i className="fas fa-lightbulb me-2 icon"></i> Topic / Concept *
                </Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={2} className="fs-6"
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  placeholder='E.g.: Arrays, Linked Lists, Recursion, Dynamic Programming, etc.'
                />
                {errors.topicDescription && (
                  <div className="error-alert">
                    <i className="fas fa-exclamation-triangle icon"></i>
                    {errors.topicDescription}
                  </div>
                )}
              </Form.Group>
              
              <Form.Group className='form-group mb-4' controlId='programmingLanguage'>
                <Form.Label className="form-label">
                  <i className="fas fa-code me-2 icon"></i> Programming Language *
                </Form.Label>
                <Form.Select
                  value={aiformSelectedLanguage?.id || ""}
                  onChange={(e) => {
                    const selectedLang = languages.find(lang => String(lang.id) === e.target.value);
                    setAiformSelectedLanguage(selectedLang);
                  }}
                >
                  {languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.language_name}
                    </option>
                  ))}
                </Form.Select>
                {errors.aiformSelectedLanguage && (
                  <div className="error-alert">
                    <i className="fas fa-exclamation-triangle icon"></i>
                    {errors.aiformSelectedLanguage}
                  </div>
                )}
              </Form.Group>

              <div>
                <Row className="align-items-center mt-3">
                  <Col md={6}>
                    <Form.Group className="form-group mb-3" controlId="difficultyLevel">
                      <Form.Label className="form-label">
                        <i className="fas fa-tachometer-alt me-2 icon"></i> Difficulty Level *
                      </Form.Label>
                      <ButtonGroup className="d-flex">
                        {difficultyLevels.map((level) => (
                          <ToggleButton
                            key={level}
                            id={`difficulty-${level}`}
                            type="radio"
                            variant={difficulty === level ? 'primary' : 'outline-secondary'}
                            name="difficulty"
                            value={level}
                            checked={difficulty === level}
                            onChange={(e) => setDifficulty(e.currentTarget.value)}
                          >
                            {level}
                          </ToggleButton>
                        ))}
                      </ButtonGroup> 
                      {errors.difficulty && <div className="text-danger">{errors.difficulty}</div>}           
                    </Form.Group>
                  </Col>


                  <Col md={6}>
                    <Form.Group className="form-group mb-3" controlId="subQuestionType">
                      <Form.Label className="form-label">
                        <i className="fas fa-tag me-2 icon"></i> Question Type *
                      </Form.Label>
                      <Form.Control 
                        type="text" 
                        value={subQuestionType} 
                        onChange={(e) => setSubQuestionType(e.target.value)}
                        placeholder='E.g. function implementation, debugging, algorithm design'
                      />
                      {errors.subQuestionType && (
                        <div className="error-alert">
                          <i className="fas fa-exclamation-triangle icon"></i>
                          {errors.subQuestionType}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Card>

            <h4 className='outside-card-label'>Guidance & Customization</h4>
            <Card className='p-4'>
              <Form.Group className='form-group mb-2' controlId='guidance'>
                <Form.Label className='form-label'>
                  <i className="fas fa-comment-dots me-2 icon"></i> Guidance / Prompt for AI *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={guidance}
                  onChange={(e) => setGuidance(e.target.value)}
                  placeholder='Provide guidance or context for the AI / Tell the AI what kind of question to generate...'
                />
                {errors.guidance && (
                  <div className="error-alert">
                    <i className="fas fa-exclamation-triangle icon"></i>
                    {errors.guidance}
                  </div>
                )}
              </Form.Group>
              
              <Form.Group className='form-group mb-3' controlId='keyConcepts'>
                <Form.Label className='form-label'>
                  <i className="fas fa-key me-2 icon"></i> Key concepts to include 
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={keyConcepts}
                  onChange={(e) => setKeyConcepts(e.target.value)}
                  placeholder='E.g.- If you want to focus on some key concepts, list them here...'
                />
              </Form.Group> 

              <Form.Group className='form-group mb-3' controlId='doNotInclude'>
                <Form.Label className='form-label'>
                  <i className="fas fa-ban me-2 icon"></i> Do not include / Avoid 
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={doNotInclude}
                  onChange={(e) => setDoNotInclude(e.target.value)}
                  placeholder='E.g.- If there are specific things you want to avoid, list them here...'
                />
              </Form.Group>
            </Card>
            
            <h4 className='outside-card-label mt-4'>Question count / Grading & Output</h4>
              <Card className='p-4'>
                <Form.Group className='form-group mb-3' controlId='questionNo'>
                  <Form.Label className='form-label'>
                    <i className="fas fa-list-ol me-2 icon"></i> No of Questions to generate *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={questionNo}
                    onChange={(e) => setQuestionNo(e.target.value)}
                    placeholder='Enter the number of questions to generate'
                  />
                  {errors.questionNo && (
                    <div className="error-alert">
                      <i className="fas fa-exclamation-triangle icon"></i>
                      {errors.questionNo}
                    </div>
                  )}
                </Form.Group>
                
                <Form.Group className='form-group mb-3' controlId='expectedFunctionSignature'>
                  <Form.Label className='form-label'>
                    <i className="fas fa-signature me-2 icon"></i> Excepted function signature format 
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={expectedFunctionSignature}
                    onChange={(e) => setExpectedFunctionSignature(e.target.value)}
                    placeholder='E.g.- def function_name(params):'
                  />
                </Form.Group>
                
                <Form.Group className='form-group mb-3' controlId='gradingDescription'>
                  <Form.Label className='form-label'>
                    <i className="fas fa-star me-2 icon"></i> Describe about grading * 
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={gradingDescription}
                    onChange={(e) => setGradingDescription(e.target.value)}
                    placeholder='Describe how much points to be awarded for each question... E.g.- Four 10 points questions and two 5 points questions'
                  />
                  {errors.gradingDescription && (
                    <div className="error-alert">
                      <i className="fas fa-exclamation-triangle icon"></i>
                      {errors.gradingDescription}
                    </div>
                  )}
                </Form.Group>
              </Card>

              {/* Generate Button */}
              <div className="text-end mt-4">
                <button 
                  type='button'
                  className="action-btn"
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating}
                > 
                  {isGenerating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
          </Form>
        </div>
      </div>

      {/* Display AI Generated Questions */}
      {errors.topic && (
        <div className="error-alert mx-3">
          <i className="fas fa-exclamation-triangle icon"></i>
          {errors.topic}
        </div>
      )}
      {generatedCodeQuestions.length > 0 && (
        <AIGeneratedCodeQuestions 
          questions={generatedCodeQuestions}
          onCheck={handleCheckboxChangeCode}
          checkedQuestions={checkedAICodeQuestions}
          onSaveChecked={saveCheckedQuestions}
          hasReachedLimit={hasReachedLimit}
          question_count={question_count}
          errors={errors}
        />
      )}
      </div>
    </div>
  )
}
