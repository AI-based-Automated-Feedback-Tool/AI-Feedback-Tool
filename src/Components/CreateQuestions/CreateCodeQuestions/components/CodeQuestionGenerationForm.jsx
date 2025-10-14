import { ButtonGroup, Card, Col, Form, Row, ToggleButton } from 'react-bootstrap'
import useFetchLanguages from "../hooks/useFetchLanguages";
import { useState } from 'react';

export default function CodeQuestionGenerationForm({formState}) {
  const {
    questionDescription, 
        setQuestionDescription, 
        functionSignature, 
        setFunctionSignature, 
        wrapperCode, 
        setWrapperCode, 
        testCases, 
        setTestCases,
        points,
        setPoints,
        addTestCase,
        errors,
        setErrors,
        validate,
        resetForm,
        aiformSelectedLanguage,
        setAiformSelectedLanguage,
        difficulty,
        setDifficulty
    } = formState;

    const {languages, loading} = useFetchLanguages(setErrors);

    const difficultyLevels = ['Easy', 'Medium', 'Hard'];
    

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Question Setup</Form.Label>
        <Card className='p-3'>
          <Form.Label className='fw-bold'>Topic / Concept *</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={2} className="fs-6"
            placeholder='Eg: Recursion, Array, Dynamic Programming, etc.'
          />

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

        <Row className="align-items-center mt-3">
          <Col md={6}>
            <Form.Label className="fw-bold">Difficulty Level *</Form.Label>
            <ButtonGroup className="d-flex">
              {difficultyLevels.map((level) => (
                <ToggleButton
                  key={level}
                  id={`difficulty-${level}`}
                  type="radio"
                  variant={difficulty === level ? 'primary' : 'outline-primary'}
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={(e) => setDifficulty(e.currentTarget.value)}
                >
                  {level}
                </ToggleButton>
              ))}
            </ButtonGroup>
            
          </Col>
        </Row>
        </Card>
      </Form.Group>
    </Form>
  )
}
