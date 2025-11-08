import {  Alert} from 'react-bootstrap';
import CodeQuestionForm from './components/CodeQuestionForm'
import CodeQuestionTable from './components/CodeQuestionTable';
import EditCodeQuestion from './components/EditCodeQuestion';
import useCodeQuestionForm from './hooks/useCodeQuestionForm';
import AICallCount from '../../AIUsage/AICallCount';
import '../../../css/questionCreation/QuestionCreation.css';

export default function CreateCodeQuestionsContent({examId, question_count, loadCount, usageCount, loadingAICount, errorAICallUsage}) {
  const{
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
    setErrors,
    errors,
    loading,
    questions,
    showEditQuestion,
    setShowEditQuestion,
    editQuestionIndex,
    handleSaveChanges,
    handleAddQuestion,
    handleDeleteQuestion,
    handleEditQuestion,
    saveAllQuestions,
    addTestCase,
    validate,
    resetForm,
    setPoints,
    points,
    warning,
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
  } = useCodeQuestionForm(examId, question_count, loadCount, usageCount);

  const isDisabled = () =>{
        if (questions.length >= parseInt(question_count)) {
            return true
        }
        return false
    }

  return (
    <div className="question-creation-page code-page">
      <div className="container">
        {/* Top Card */}
        <div className="top-card mb-5">
          <div className="top-header">
            <h1 className="top-title">Create Code Questions</h1>
            <p className="top-subtitle">
              Write or generate coding problems with test cases
            </p>
          </div>

          {/* Progress line */}
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${(questions.length / question_count) * 100}%` 
              }} 
            />
          </div>

          <div className="top-footer">
            <p className="progress-text">
              Need <strong>{question_count}</strong> questions • You have <strong>{questions.length}</strong>
            </p>

            {/* AI usage badges */}
            <AICallCount 
              usageCount={usageCount} 
              loadingAICount={loadingAICount} 
              errorAICallUsage={errorAICallUsage} 
            />
          </div>
        </div>

        {/* Question Form */}            
        <div className="glass-card mb-5">
          <div className="p-4">
            {warning && (
              <div className="error-alert mb-4">
                {warning}
              </div>
            )}  
            <CodeQuestionForm 
              onAddQuestion={handleAddQuestion}
              formState={{
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
                resetForm,
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
              }}
              disabled={isDisabled()}
              question_count={question_count}
              usageCount={usageCount}
              loadingAICount={loadingAICount}
              errorAICallUsage={errorAICallUsage}
            />
          </div>
        </div>

        {/* Question Table */}
        {questions.length > 0 && (
          <div className="glass-card">
            <div className="gradient-header">
              <h4>
                <i className="fas fa-eye icon"></i>
                Preview Code Questions
              </h4>
            </div>
            <div className="p-4">
              <CodeQuestionTable 
                questions={questions} 
                onDelete={handleDeleteQuestion}
                onEdit={handleEditQuestion}
              />
              {editQuestionIndex !== null && questions[editQuestionIndex] && (
                <EditCodeQuestion 
                  show={showEditQuestion}
                  handleClose={() => setShowEditQuestion(false)}
                  questionDetails={questions[editQuestionIndex]}
                  handleSaveChanges={handleSaveChanges}
                />
              )}

              {/* Submit Button */}
              <div className="text-end mt-4">
                <button 
                  className="action-btn"
                  onClick={saveAllQuestions} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Saving Questions...
                    </>
                  ) : (
                    "Save All Questions"
                  )}                              
                </button>
              </div> 
            </div>
          </div>
        )}
        {errors?.restriction && (
          <div className="mt-3">
            <Alert variant="danger">{errors.restriction}</Alert>
          </div>
        )}
      </div>
    </div>
  )
}
