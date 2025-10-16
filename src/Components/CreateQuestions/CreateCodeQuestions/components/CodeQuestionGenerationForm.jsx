import { ButtonGroup, Card, Col, Form, Row, ToggleButton, Button } from 'react-bootstrap'
import useFetchLanguages from "../hooks/useFetchLanguages";
import { useState } from 'react';
import '../../../../css/aiQuestionGeneration.css';
import AIGeneratedCodeQuestions from './AIGeneratedCodeQuestions';
import useCodeQuestionForm from '../hooks/useCodeQuestionForm';

export default function CodeQuestionGenerationForm({formState, index, examId, question_count}) {
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
      setIsGenerating
    } = useCodeQuestionForm(examId, question_count);

    const {languages, loading} = useFetchLanguages(setErrors);
    const difficultyLevels = ['Easy', 'Medium', 'Hard'];
    

  return (
    <>
      <Form className="mx-3 mx-md-5">
        <Form.Group className="mb-3">
          <Form.Label className="outside-card-label mt-4">Question Setup</Form.Label>
          <Card className='p-3'>
            <Form.Label className='fw-bold'>Topic / Concept *</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2} className="fs-6"
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
              placeholder='E.g.: Arrays, Linked Lists, Recursion, Dynamic Programming, etc.'
            />
            {errors.topicDescription && <div className="text-danger">{errors.topicDescription}</div>}

            <Form.Label className="fw-bold">Programming Language *</Form.Label>
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
            {errors.aiformSelectedLanguage && <div className="text-danger">{errors.aiformSelectedLanguage}</div>}

            <Row className="align-items-center mt-3">
              <Col md={6}>
                <Form.Label className="fw-bold">Difficulty Level *</Form.Label>
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
              </Col>


              <Col md={6}>
                <Form.Label className="fw-bold">Question Type *</Form.Label>
                <Form.Control 
                  type="text" 
                  value={subQuestionType} 
                  onChange={(e) => setSubQuestionType(e.target.value)}
                  placeholder='E.g. function implementation, debugging, algorithm design'
                />
              </Col>
              {errors.subQuestionType && <div className="text-danger">{errors.subQuestionType}</div>}
            </Row>
          </Card>

          <Form.Label className="outside-card-label mt-4">Guidance & Customization</Form.Label>
          <Card className='p-3'>
            <Form.Label className='fw-bold'>Guidance / Prompt for AI *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder='Provide guidance or context for the AI / Tell the AI what kind of question to generate...'
            />
            {errors.guidance && <div className="text-danger">{errors.guidance}</div>}

            <Form.Label className='fw-bold mt-3'>Key concepts to include </Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              value={keyConcepts}
              onChange={(e) => setKeyConcepts(e.target.value)}
              placeholder='E.g.- If you want to focus on some key concepts, list them here...'
            />

            <Form.Label className='fw-bold mt-3'>Do not include / Avoid </Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              value={doNotInclude}
              onChange={(e) => setDoNotInclude(e.target.value)}
              placeholder='E.g.- If there are specific things you want to avoid, list them here...'
            />
          </Card>

          <Form.Label className="outside-card-label mt-4">Question count / Grading & Output</Form.Label>
          <Card className='p-3'>
            <Form.Label className='fw-bold'>No of Questions to generate *</Form.Label>
            <Form.Control
              type="number"
              value={questionNo}
              onChange={(e) => setQuestionNo(e.target.value)}
              placeholder='Enter the number of questions to generate'
            />
            {errors.questionNo && <div className="text-danger">{errors.questionNo}</div>}

            <Form.Label className='fw-bold mt-3'>Excepted function signature format </Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              value={expectedFunctionSignature}
              onChange={(e) => setExpectedFunctionSignature(e.target.value)}
              placeholder='E.g.- def function_name(params):'
            />

            <Form.Label className='fw-bold mt-3'>Describe about grading * </Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              value={gradingDescription}
              onChange={(e) => setGradingDescription(e.target.value)}
              placeholder='Describe how much points to be awarded for each question... E.g.- Four 10 points questions and two 5 points questions'
            />
            {errors.gradingDescription && <div className="text-danger">{errors.gradingDescription}</div>}
          </Card>

          {/* Generate Button */}
          <div className="d-flex justify-content-end mt-3">
            <Button 
              variant="primary"
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
            > 
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
              "Generate Questions"
              )}
            </Button>
          </div>
        </Form.Group>
      </Form>

      {/* Display AI Generated Questions */}
        {generatedCodeQuestions.length > 0 && (
          <AIGeneratedCodeQuestions 
            questions={generatedCodeQuestions}
          />
        )
      }
    </>
  )
}
