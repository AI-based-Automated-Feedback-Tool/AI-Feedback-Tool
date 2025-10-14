import React from 'react'
import { Card } from "react-bootstrap";
import { useState } from 'react';
import { Nav } from "react-bootstrap";
import ManualCodeQuestionCreationForm from './ManualCodeQuestionCreationForm';
import CodeQuestionGenerationForm from './CodeQuestionGenerationForm';

export default function CodeQuestionForm({setError, onAddQuestion, formState, disabled}) {
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'

    return (
        <Card>
            <Card.Header className='bg-primary text-white'>
                <h4>📝 Create Code Questions</h4>
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
                        <ManualCodeQuestionCreationForm
                            onAddQuestion={onAddQuestion}
                            setError={setError}
                            formState={formState}
                            disabled={disabled}
                        />
                    )}
                    {activeTab === 'ai' && (
                        <CodeQuestionGenerationForm
                            formState={formState}
                        />
                    )}
                </div>
            </div>        
            </Card.Body>
        </Card>
    )
}
