import EssayQuestionForm from './components/EssayQuestionForm';
import useEssayQuestionCreation from './hooks/useEssayQuestionCreation';
import EssayQuestionTable from './components/EssayQuestionTable';
import EditEssayQuestion from './components/EditEssayQuestion';
import '../../../css/questionCreation/QuestionCreation.css';
import AICallCount from '../../AIUsage/AICallCount';

export default function CreateEssayQuestionsContent({examId, question_count, loadCount, usageCount, loadingAICount, errorAICallUsage}) { 
  const {
    question,
    questionText,
    attachments,
    wordLimit,
    points,
    gradingNotes,
    setQuestionText,
    setAttachments, 
    setWordLimit,
    setPoints,
    setGradingNotes,
    onSaveQuestion,
    error,
    fileInputRef,
    handleDeleteQuestion,
    handleEditQuestion,
    editQuestionIndex,
    showEditQuestion,
    setShowEditQuestion,
    handleSaveChanges,
    validate,
    resetForm,
    setError,
    saveAllQuestions,
    loading,
    warning,
    isDisabled,
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
    generatedQuestions,
    checkedQuestions,
    setCheckedQuestions,
    handleCheckboxChangeEssay,
    saveCheckedQuestions,
    isGenerating,
    generateError,
    aiModel,
    setAiModel
  } = useEssayQuestionCreation(examId, question_count, loadCount, usageCount);
    
    
  return (
    <div className="question-creation-page essay-page"> 
        <div className="container"> 
          {/* Top Card */}
          <div className="top-card mb-5">
            <div className="top-header">
              <h1 className="top-title">Create Essay Questions</h1>
              <p className="top-subtitle">
                Write or generate essay questions with detailed prompts
              </p>
            </div>
          
            {/* Progress line */}
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${(question.length / question_count) * 100}%` 
                }} 
              />
            </div>
          
            <div className="top-footer">
              <p className="progress-text">
                Need <strong>{question_count}</strong> questions • You have <strong>{question.length}</strong>
              </p>
          
              {/* AI usage badges */}
              <AICallCount 
                usageCount={usageCount} 
                loadingAICount={loadingAICount} 
                errorAICallUsage={errorAICallUsage} 
              />
            </div>
          </div>  
          
          {/*Question Form */}
          <div className="glass-card mb-5">
            <div className="p-4">
              {warning && (
                <div className="error-alert mb-4">
                  {warning}
                </div>
              )}
              <EssayQuestionForm 
                formState={{
                  questionText,
                  attachments,
                  wordLimit,
                  points,
                  gradingNotes,
                  setQuestionText,
                  setAttachments,
                  setWordLimit,
                  setPoints,
                  setGradingNotes,
                  onSaveQuestion,
                  error,
                  fileInputRef,
                  handleDeleteQuestion,
                  handleEditQuestion,
                  editQuestionIndex,
                  showEditQuestion,
                  setShowEditQuestion,
                  isDisabled,
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
                  generatedQuestions,
                  checkedQuestions,
                  setCheckedQuestions,
                  handleCheckboxChangeEssay,
                  saveCheckedQuestions,
                  isGenerating,
                  generateError,
                  aiModel,
                  setAiModel
                }}
                usageCount={usageCount}
                loadingAICount={loadingAICount}
                errorAICallUsage={errorAICallUsage}
              />
            </div>
          </div>                  
          {/* Question Table */}   
          {question.length > 0 && (
            <div className="glass-card">
              <div className="gradient-header">
                <h4>
                  <i className="fas fa-eye icon"></i>
                  Preview Essay Questions
                </h4>
              </div>

              <div className="p-4">
                <EssayQuestionTable
                  questions={question}
                  onDelete={handleDeleteQuestion}
                  onEdit={handleEditQuestion}
                />
                {editQuestionIndex !== null && question[editQuestionIndex] && (
                  <EditEssayQuestion 
                    show={showEditQuestion}
                    handleClose={() => setShowEditQuestion(false)}
                    questionDetails={question[editQuestionIndex]}
                    handleSaveChanges={handleSaveChanges}
                    formState={{
                      questionText,
                      attachments,
                      wordLimit,
                      points,
                      gradingNotes,
                      setQuestionText,
                      setAttachments,
                      setWordLimit,
                      setPoints,
                      setGradingNotes,
                      error,
                      fileInputRef,
                      validate,
                      resetForm,
                      setError
                    }}
                  />
                )}
                
                {/* Submit Button */}
                <div className="text-end mt-4" >
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
                      "➕ Save All Questions"
                    )}                              
                  </button>
                </div> 
              </div>
            </div>
          )}  
          {error?.restriction && (
            <div className="error-alert mt-4 text-center">
              <i className="fas fa-exclamation-triangle icon"></i>
              {error.restriction}
            </div>
          )}
      </div>             
    </div>
  );
}
