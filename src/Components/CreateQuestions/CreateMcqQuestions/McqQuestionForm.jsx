import { Card} from "react-bootstrap";
import { useState } from 'react';
import ManualMcqQuestionCreation from './ManualMcqQuestionCreation';
import McqQuestionGenerationForm from "./McqQuestionGenerationForm";

export default function McqQuestionForm({onSave, warning, disabled}) {     
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'
  return ( 
    <Card>
        <Card.Header className="bg-primary text-white">
            <h4>📝 Create MCQ Questions</h4>
        </Card.Header>
        <Card.Body>
            <div>
                <div className="flex border-b">
                    <button
                        className={`p-2 ${activeTab === 'manual' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('manual')}
                    >
                        Manual Question
                    </button>
                    <button
                        className={`p-2 ${activeTab === 'ai' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('ai')}
                    >
                        AI-Assisted Question
                    </button>
                </div>
            </div>
        </Card.Body>
    </Card>
  )
}

        