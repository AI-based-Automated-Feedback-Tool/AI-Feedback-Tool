import { Card} from "react-bootstrap";
import { useState } from 'react';
import { Nav } from "react-bootstrap";
import ManualMcqQuestionCreation from './ManualMcqQuestionCreation';
import McqQuestionGenerationForm from "./McqQuestionGenerationForm";
import '../../../css/questionCreation.css';
import AICallCount from "../../AIUsage/AICallCount";
import useMcqQuestionForm from "./hooks/useMcqQuestionForm";

export default function McqQuestionForm({onSave, warning, disabled, noOfQuestions, questionCount, loadCount, usageCount, loadingAICount, errorAICallUsage}) {     
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'

    const {
        questionText, 
        setQuestionText,
        answerOptions,
        correctAnswers,
        numOfAnswers,
        points, 
        setPoints,
        errors,
        handleAddQuestion,
        handleAnswerOptionsChange,
        handleCheckboxChange,
        handleNumOfAnswersChange,
        questionTopic, 
        setQuestionTopic,
        questionNo, 
        setQuestionNo,
        questionDifficulty, 
        setQuestionDifficulty,
        guidance, 
        setGuidance,
        keyConcepts, 
        setKeyConcepts,
        doNotInclude, 
        setDoNotInclude,
        generateQuestion,
        generatedQuestions,
        checkedAIQuestions,
        handleCheckboxChangeAIQ,
        saveCheckedQuestions,
        generatedAndSelectedQuestions,
        isGenerating,
        setAiModel,
        aiModel
    } = useMcqQuestionForm(onSave,questionCount,noOfQuestions,loadCount);
  return ( 
    <Card>
        <Card.Header className="bg-primary text-white">
            <h4>📝 Create MCQ Questions</h4>
            <AICallCount 
                usageCount={usageCount}
                loadingAICount={loadingAICount}
                errorAICallUsage={errorAICallUsage}
            />
        </Card.Header>
        <Card.Body>
            <div>
                <div className="flex border-b">
                    <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                        <Nav.Item>
                            <Nav.Link eventKey="manual" className={activeTab === 'manual' ? 'bg-primary text-white' : ''}>
                                Manual Question Creation
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="ai" className={activeTab === 'ai' ? 'bg-primary text-white' : ''}>
                                AI-Assisted Question Creation
                            </Nav.Link>
                        </Nav.Item>
                        </Nav>
                </div>

                <div className="mt-4">
                    {activeTab === 'manual' && (
                        <ManualMcqQuestionCreation 
                            formState={{
                                questionText, 
                                setQuestionText,
                                answerOptions,
                                correctAnswers,
                                numOfAnswers,
                                points, 
                                setPoints,
                                errors,
                                handleAddQuestion,
                                handleAnswerOptionsChange,
                                handleCheckboxChange,
                                handleNumOfAnswersChange
                            }} 
                            warning={warning} 
                            disabled={disabled} 
                        />
                    )}
                    {activeTab === 'ai' && (
                        <McqQuestionGenerationForm 
                            formState={{
                                errors,
                                questionTopic, 
                                setQuestionTopic,
                                questionNo, 
                                setQuestionNo,
                                questionDifficulty, 
                                setQuestionDifficulty,
                                guidance, 
                                setGuidance,
                                keyConcepts, 
                                setKeyConcepts,
                                doNotInclude, 
                                setDoNotInclude,
                                generateQuestion,
                                generatedQuestions,
                                checkedAIQuestions,
                                handleCheckboxChangeAIQ,
                                saveCheckedQuestions,
                                generatedAndSelectedQuestions,
                                isGenerating,
                                setAiModel,
                                aiModel
                            }} 
                            warning={warning} 
                            disabled={disabled}
                        />
                    )}
                </div>
            </div>
        </Card.Body>
    </Card>
  )
}

        