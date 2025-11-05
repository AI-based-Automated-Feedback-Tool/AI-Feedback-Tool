import { Form, Button, Row, Col } from "react-bootstrap";
import useFetchLanguages from "../hooks/useFetchLanguages";
import React from "react";
import '../../../../css/questionCreation/CodeCreation.css';


export default function ManualCodeQuestionCreationForm({onAddQuestion, setError, formState, disabled}) {
    const {languages, loading} = useFetchLanguages(setError);
    const {
        questionDescription, 
        setQuestionDescription, 
        functionSignature, 
        setFunctionSignature, 
        wrapperCode, 
        setWrapperCode, 
        testCases, 
        setTestCases, 
        selectedLanguage, 
        setSelectedLanguage,
        points,
        setPoints,
        addTestCase,
        errors,
        setErrors,
        validate,
        resetForm
    } = formState;

    const handleAddQuestion = () => {
        // Validate and submit the question
        const isValid = validate();
        if (!isValid) {
            setError({"message": "Please fill in all required fields correctly."});
            return;
        }

        const newQuestion = {
            question: questionDescription,
            functionSignature: functionSignature,
            wrapperCode: wrapperCode,
            testCases: testCases,
            language: selectedLanguage,
            points: points
        }
        onAddQuestion(newQuestion);

        // Reset form fields
        resetForm();
    }

  return (
    <Form className="space-y-6">
      <Form.Group className="form-group" controlId="questionDescription">
        <Form.Label className="form-label">
          <i className="fas fa-align-left icon"></i> Question Description*
        </Form.Label>
        <Form.Control 
          as="textarea" 
          className="form-textarea"
          rows={3}
          placeholder='Enter your question here...'
          value={questionDescription}
          onChange={(e) => setQuestionDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="form-group" controlId="functionSignature">
        <Form.Label className="form-label">
          <i className="fas fa-signature icon"></i> Function Signature*
        </Form.Label>
        <Form.Control 
          as="textarea" 
          className="form-textarea"
          rows={3}
          placeholder='e.g. def calculate_sum(a: int, b: int) -> int:'
          value={functionSignature}
          onChange={(e) => setFunctionSignature(e.target.value)}  
        />
      </Form.Group>

      <Form.Group className="form-group" controlId="wrapperCode">
        <Form.Label className="form-label">
          <i className="fas fa-code icon"></i> Wrapper code*
        </Form.Label>
        <Form.Control 
          as="textarea" 
          className="form-textarea"
          rows={4}
          placeholder='Enter the wrapper code here...'
          value={wrapperCode}
          onChange={(e) => setWrapperCode(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="form-group" controlId="testCases">
        <Form.Label className="form-label">
          <i className="fas fa-vial icon"></i> Test Cases *
        </Form.Label>
        
        {testCases.map((testCase, index) => (
          <Row key={index} className="align-items-end mb-3 g-3">
            <Col>
              <Form.Control 
                placeholder='Input'
                type="text"
                className="form-input"
                value={testCase.input}
                onChange={(e) => {
                  const newTestCase = [...testCases];
                  newTestCase[index].input = e.target.value
                  setTestCases(newTestCase)
                } }
              />
            </Col>
            <Col>
              <Form.Control
                placeholder='Output'
                className="form-input"
                value={testCase.output}
                onChange={(e) => {
                  const newTestCase = [...testCases];
                  newTestCase[index].output = e.target.value
                  setTestCases(newTestCase)
                } }
              />
            </Col>
            <Col xs="auto">
              <div className="test-case-add">                
                <Button 
                  variant="outline-secondary" 
                  onClick={addTestCase}
                >
                  <i className="fas fa-plus"></i>
                </Button>
              </div>
            </Col>
          </Row>
        ))}
      </Form.Group>

      <Form.Group className="form-group" controlId="programmingLanguage">
        <Form.Label className="form-label">
          <i className="fas fa-code-branch icon"></i> Programming Language *
        </Form.Label>
        <div className="custom-select">
          <Form.Select
            value={selectedLanguage?.id || ""}
            onChange={(e) => {
              const selectedLang = languages.find(lang => String(lang.id) === e.target.value);
              setSelectedLanguage(selectedLang);
            }}
            className="form-select"
          >
            <option value="">Choose language</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.language_name}
              </option>
            ))}
          </Form.Select>
        </div>
      </Form.Group>

      <Form.Group className="form-group" controlId="points">
        <Form.Label className="form-label">
          <i className="fas fa-coins icon"></i> Number of points *
        </Form.Label>
        <Form.Control
          type="number"
          className="form-input"
          min="1"
          placeholder="Enter points for this question"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          required
        />
      </Form.Group>

      {/* Submit Button */}
      <div className="d-flex justify-content-end" >
        <button 
          type="button"
          className="action-btn"
          onClick={handleAddQuestion} 
          disabled= {loading || disabled}
        >
          {disabled ? (
            <>
              Limit Reached
            </>
          ) : (
            "Create Question"
          )}
        </button>
      </div>

    </Form>
  )
}
