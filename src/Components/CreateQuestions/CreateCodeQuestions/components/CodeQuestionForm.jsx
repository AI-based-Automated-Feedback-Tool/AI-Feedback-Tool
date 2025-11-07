import { useState } from 'react';
import ManualCodeQuestionCreationForm from './ManualCodeQuestionCreationForm';
import CodeQuestionGenerationForm from './CodeQuestionGenerationForm';
import '../../../../css/questionCreation/QuestionCreationTabs.css';

export default function CodeQuestionForm({onAddQuestion, formState, disabled, question_count, usageCount, loadingAICount, errorAICallUsage}) {
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'

    return (
        <div>
            <div className="question-tabs" role="tablist">
                <button 
                    type='button'
                    id="tab-manual"
                    className={`question-tab ${activeTab === 'manual' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('manual')}
                    aria-selected={activeTab === 'manual'}
                    aria-controls="manual-panel"
                    role="tab"
                >
                    Manual Creation
                </button>
                <button 
                    type='button'
                    id="tab-ai"
                    className={`question-tab ${activeTab === 'ai' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('ai')}
                    aria-selected={activeTab === 'ai'}
                    aria-controls="ai-panel"
                    role="tab"
                >
                    AI Generation
                </button>
            </div>

            <div
                id="manual-panel"
                role="tabpanel"
                aria-labelledby='tab-manual'
                hidden={activeTab !== 'manual'}
            >            
                <ManualCodeQuestionCreationForm
                    onAddQuestion={onAddQuestion}
                    formState={formState}
                    disabled={disabled}
                />
            </div>
            <div
                id="ai-panel"
                role="tabpanel"
                aria-labelledby='tab-ai'
                hidden={activeTab !== 'ai'}
            >
                <CodeQuestionGenerationForm
                    formState={formState}
                    question_count={question_count}
                />
            </div>
        </div>
    )
}
