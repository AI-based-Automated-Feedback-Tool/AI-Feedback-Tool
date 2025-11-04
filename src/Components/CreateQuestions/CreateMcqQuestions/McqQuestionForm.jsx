import { useState } from 'react';
import ManualMcqQuestionCreation from './ManualMcqQuestionCreation';
import McqQuestionGenerationForm from "./McqQuestionGenerationForm";
import '../../../css/questionCreation/QuestionCreationTabs.css';

export default function McqQuestionForm({onSave, warning, disabled, noOfQuestions, questionCount, loadCount, usageCount, loadingAICount, errorAICallUsage}) {     
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'

  return ( 
    <div>
      {/* GLASS TABS */}
      <div className="question-tabs" role="tablist" aria-label="MCQ Question Creation Tabs">
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
            onSave={onSave}
            warning={warning}
            disabled={disabled}
            questionCount={questionCount}
            noOfQuestions={noOfQuestions}
            loadCount={loadCount}
          />
        </div>
        <div
          id="ai-panel"
          role="tabpanel"
          aria-labelledby='tab-ai'
          hidden={activeTab !== 'ai'}
        >
          <McqQuestionGenerationForm
            onSave={onSave}
            warning={warning}
            disabled={disabled}
            questionCount={questionCount}
            noOfQuestions={noOfQuestions}
            loadCount={loadCount}
          />
        </div>
    </div>
  );
}

        