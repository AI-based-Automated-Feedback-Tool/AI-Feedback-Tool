import { Card, Nav } from "react-bootstrap";
import { useState } from "react";
import ManualMcqQuestionCreation from "./ManualEssayQuestionCreation";
import EssayQuestionGenerationForm from "./EssayQuestionGenerationForm";
import '../../../../css/questionCreation/QuestionCreationTabs.css';

export default function EssayQuestionForm({ formState, usageCount, loadingAICount, errorAICallUsage}) {  
    const [activeTab, setActiveTab] = useState('manual');
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
            <ManualMcqQuestionCreation 
                formState={formState} 
            />
        </div>
        <div 
            id="ai-panel"
            role="tabpanel"
            aria-labelledby='tab-ai'
            hidden={activeTab !== 'ai'}
        >
            <EssayQuestionGenerationForm 
                formState={formState} 
            />
        </div>
    </div>
  )
}
