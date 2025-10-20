import { Card, Nav } from "react-bootstrap";
import { useState } from "react";
import ManualMcqQuestionCreation from "./ManualEssayQuestionCreation";
import EssayQuestionGenerationForm from "./EssayQuestionGenerationForm";

export default function EssayQuestionForm({ formState }) {  
    const [activeTab, setActiveTab] = useState('manual');
  return (
    <Card>
        <Card.Header className='bg-primary text-white'>
            <h4>Essay Question</h4>
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
                            formState={formState} 
                        />
                    )}
                    {activeTab === 'ai' && (
                        <EssayQuestionGenerationForm 
                            formState={formState} 
                        />
                    )}
                </div>
            </div>
        </Card.Body>
    </Card>
  )
}
