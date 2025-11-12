import { Collapse} from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import '../../../../css/questionCreation/AIGeneratedCodeQuestions.css';
export default function AIGeneratedCodeQuestions({ questions, onCheck, checkedQuestions, onSaveChecked, hasReachedLimit ,question_count, errors}) {
  const [showTestCases, setShowTestCases] = useState({});

  return (
    <div className="glass-card mt-5 overflow-visible">
        <div className="gradient-header">
            <h4>
                <i className='fas fa-brain me-2'></i>
                Generated Questions by AI
            </h4>
        </div>
        
        <div className="p-4">
            <p className="text-muted small mb-4">
                Select the questions you want to add to your exam.
            </p>

            {questions.length > 0 ? (
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div key={index} className="d-flex align-items-start gap-3">
                            <div
                                className="custom-checkbox mt-1"
                                onClick={() => onCheck(index)}
                            >
                                <input
                                    type="checkbox"
                                    className="d-none"
                                    checked={!!checkedQuestions[index]}
                                    readOnly
                                />
                                <i className={`fas ${checkedQuestions[index] ? 'fa-check-square text-primary' : 'fa-square'} fa-lg`}></i>
                            </div>

                            <div className="glass-card flex-grow-1 hover-lift w-100">
                                <div className="p-4 p-md-4">
                                    <div className="fw-bold fs-5 mb-3 text-dark">
                                        {question.question_description}
                                    </div>

                                    {question.points && (
                                        <div className="mb-3">
                                            <span className="badge bg-gradient-primary">
                                                Points: {question.points}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <div className="text-muted small fw-bold mb-1">Function Signature</div>
                                        <div className="code-block">
                                            <SyntaxHighlighter
                                                language={question.language?.language_name?.toLowerCase() || "python"}
                                                style={coy}
                                                customStyle={{borderRadius: '0.75rem', fontSize: '0.9rem'}}
                                            >
                                                {question.function_signature}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small fw-bold mb-1">Wrapper Code</div>
                                        <div className="code-block">
                                            <SyntaxHighlighter
                                                language={question.language?.language_name?.toLowerCase() || "python"}
                                                style={coy}
                                                customStyle={{borderRadius: '0.75rem', fontSize: '0.9rem'}}
                                            >
                                                {question.wrapper_code}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>

                                    <button
                                        className="btn-toggle-testcases d-flex align-items-center gap-2 text-primary fw-medium"
                                        onClick={() => {
                                            setShowTestCases(prev => ({
                                                ...prev,
                                                [index]: !prev[index]
                                            }));
                                        }}
                                    >
                                        <i className={`fas fa-chevron-${showTestCases[index] ? 'up' : 'down'}`}></i>
                                        {showTestCases[index] ? "Hide Test Cases" : "Show Test Cases"}
                                    </button>

                                {question.test_cases?.length > 0 && (   
                                    <Collapse in={showTestCases[index]}>
                                        <div className="mt-3 space-y-2">
                                            {question.test_cases?.map((tc, idx) => (
                                                <div key={idx} className="test-case-card p-3">
                                                    <div>
                                                        <strong>Input:</strong>
                                                        <code className="ms-2 text-success">
                                                            {typeof tc.input === 'object' ? JSON.stringify(tc.input) : tc.input}
                                                        </code>
                                                    </div>
                                                    <div className="mt-2">
                                                        <strong>Output:</strong>
                                                        <code className="ms-2 text-success">
                                                            {typeof tc.output === 'object' ? JSON.stringify(tc.output) : tc.output}
                                                        </code>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Collapse>
                                )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-muted text-center py-5">
                    <i className="fas fa-info-circle fa-lg mb-3"></i>
                    <div>No AI-generated code questions available. Please generate questions first.</div>
                </div>
            )}
        </div>
    
        {
            <div className="info-banner mt-3 mx-3">
                <i className="fas fa-edit me-2"></i>
                <span>You can edit points for each question after adding them to the exam.</span>
            </div>
        }            

        {/* Add Questions Button */}
        <div className="text-end my-5" >
            <button 
                type="button"
                className="action-btn mx-3"
                onClick={onSaveChecked} 
                disabled={questions.length === 0 || !!hasReachedLimit}
            >
                Add Questions to the Exam
            </button>
        </div>
        
        {hasReachedLimit && (
            <div className="warning-alert my-3 text-center">
                <i className="fas fa-exclamation-circle icon"></i> You’ve reached the limit of {question_count} questions. Delete one to add more.
            </div>
        )}
        {errors.limit && (
            <div className="warning-alert mt-3 text-center">
                <i className="fas fa-exclamation-circle icon"></i>
                {errors.limit}
            </div>
        )}
    </div>
  )
}
