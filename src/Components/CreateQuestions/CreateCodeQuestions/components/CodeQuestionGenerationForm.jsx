import { Card, Col, Form, Row } from 'react-bootstrap'
import useFetchLanguages from "../hooks/useFetchLanguages";

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
        setAiformSelectedLanguage
    } = formState;

    const {languages, loading} = useFetchLanguages(setErrors);

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

        <Row>
          <Col className="text-end mt-3">
            {/*Radio buttons to select difficulty level*/}
            <Form.Label className="fw-bold">Difficulty Level *</Form.Label>
            
          </Col>
        </Row>
        </Card>
      </Form.Group>
    </Form>
  )
}
