import McqQuestionForm from './McqQuestionForm';
import { Alert } from 'react-bootstrap';
import QuestionTable from './QuestionTable';
import EditQuestion from './EditQuestion';
import {useMcqQuestion} from './useMcqQuestion';
import { useNavigate } from 'react-router-dom';
import '../../../css/questionCreation/McqCreation.css'
import AICallCount from "../../AIUsage/AICallCount";

export default function CreateMcqQuestionsContent({examId, question_count, loadCount, usageCount, loadingAICount, errorAICallUsage}) {
    
    const navigate = useNavigate();

    const {
        questions,
        showEditQuestion,
        editQuestionIndex,
        addQuestion,
        deleteQuestion,
        editQuestion,
        saveEditedQuestion,
        saveAllQuestions,
        setShowEditQuestion,
        clearQuestions,
        error,
        loading,
        warning
    } = useMcqQuestion(examId, question_count);

    const handleSaveQuestions = async () => {
        await saveAllQuestions();
        if (!error) {
            clearQuestions();
            alert("Questions saved successfully!");
            navigate("/teacher");
        }        
    }

    const isDisabled = () =>{
        if (questions.length >= parseInt(question_count)) {
            return true
        }
        return false
    }

  return (
    <div className="mcq-page">
        <div className="container">

            {/* Header Card */}
            <div className="mcq-top-card mb-5">
                <div className="mcq-top-header">
                    <h1 className="mcq-top-title">Create MCQ Questions</h1>
                    <p className="mcq-top-subtitle">
                        Build high-quality multiple-choice questions for your exam
                    </p>
                </div>

                {/* Progress line */}
                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${(questions.length / parseInt(question_count)) * 100}%`,
                        }}
                    />
                </div>

                <div className="mcq-top-footer">
                    <p className="progress-text">
                        Need <strong>{question_count}</strong> questions • You have{" "}
                        <strong>{questions.length}</strong>
                    </p>

                    {/* AI usage badges – visible & pretty */}
                        <AICallCount
                        usageCount={usageCount}
                        loadingAICount={loadingAICount}
                        errorAICallUsage={errorAICallUsage}
                    />
                </div>
            </div>

            {warning && <Alert variant="warning" className="mb-4">{warning}</Alert>}
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            {/* Question Form */}
            <div className="glass-card mb-5">
                <div className="p-4">
                    <McqQuestionForm
                        onSave={addQuestion}
                        warning={warning}
                        disabled={isDisabled()}
                        noOfQuestions={questions.length}
                        questionCount={question_count}
                        loadCount={loadCount}
                        usageCount={usageCount}
                        loadingAICount={loadingAICount}
                        errorAICallUsage={errorAICallUsage}
                    />
                </div>
            </div>

            {/* Preview Table */}
            {questions.length > 0 && (
                <div className="glass-card">
                    <div className="gradient-header">
                        <h4>
                            <i className="fas fa-eye icon"></i> Preview Questions
                        </h4>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <div className="p-4">
                        <QuestionTable 
                            questions={questions} 
                            onDelete={deleteQuestion} 
                            onEdit={editQuestion} 
                        />
                        {editQuestionIndex !== null && questions[editQuestionIndex] && (
                            <EditQuestion 
                                show={showEditQuestion} 
                                handleClose={() => setShowEditQuestion(false)} 
                                questionDetails={questions[editQuestionIndex]} 
                                onSave={saveEditedQuestion} 
                            />
                        )}

                        {/* Submit Button */}
                        <div className="text-end mt-4">
                            <button 
                                className="action-btn" 
                                onClick={handleSaveQuestions} 
                                disabled={loading}
                            >
                                {loading ? <><span className="spinner"></span> Saving...</> : "Save All"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
