import { Card} from "react-bootstrap";
import { useState } from 'react';
import { Nav } from "react-bootstrap";
import ManualMcqQuestionCreation from './ManualMcqQuestionCreation';
import McqQuestionGenerationForm from "./McqQuestionGenerationForm";
import '../../../css/questionCreation.css';

export default function McqQuestionForm({onSave, warning, disabled, noOfQuestions, questionCount}) {     
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'
  return ( 
    <Card>
        <Card.Header className="bg-primary text-white">
            <h4>📝 Create MCQ Questions</h4>
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
                            onSave={onSave} 
                            warning={warning} 
                            disabled={disabled} 
                        />
                    )}
                    {activeTab === 'ai' && (
                        <McqQuestionGenerationForm 
                            onSave={onSave} 
                            warning={warning} 
                            disabled={disabled} 
                            noOfQuestions={noOfQuestions} 
                            questionCount={questionCount}
                        />
                    )}
                </div>
            </div>
        </Card.Body>
    </Card>
  )
}

        