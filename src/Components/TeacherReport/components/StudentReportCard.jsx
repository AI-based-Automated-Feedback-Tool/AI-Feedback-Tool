import React from 'react'
import { Row, Col, CardHeader, CardBody, Card } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import StudentReportTable from './StudentReportTable';
import '../../../css/Reports/StudentReportCard.css';


export default function StudentReportCard({ studentReportData, examType }) {
    const formatDateTime = (rawTime) => {
        return new Date(rawTime).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    let reportData = studentReportData[0];

    if (examType === 'mcq') {
        reportData = studentReportData[0]?.exam_submissions_answers;

    } else if (examType === 'essay') {
        reportData = studentReportData[0]?.essay_exam_submissions_answers;
    } else if (examType === 'code') {
        reportData = studentReportData[0]?.code_submissions_answers;
    } else {
        reportData = [];
    }
    
    return (
        <>
            {(!studentReportData || studentReportData.length === 0)? (
                <div className="modern-empty-state">
                    <i className="fas fa-user-graduate fa-3x text-muted mb-3"></i>
                    <p>No report data available for this student.</p>
                </div>
            ):( 
                <div className="student-report-modern">
                    <div className="student-name-card">
                        <div className="student-avatar">
                            <i className="fas fa-user-graduate"></i>
                        </div>
                        <div>
                            <h2 className="student-name">{studentReportData[0].users.name}</h2>
                            <p className="student-subtitle">Individual Performance Report</p>
                        </div>
                    </div>

                    <Row className="g-4 mb-5">
                        <Col md={6}>
                            <div className='info-card'>
                                <div className='info-icon submitted'>
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <div>
                                    <p className='info-label'>Submitted On</p>
                                    <h4 className='info-value'>{formatDateTime(studentReportData[0].submitted_at)}</h4>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className='info-card'>
                                <div className='info-icon score'>
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div>
                                    <p className='info-label'>Time Taken per Question</p>
                                    <h4 className='info-value'>{((studentReportData[0].time_taken/60)/reportData.length).toFixed(2)} minutes</h4>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row className="g-4 mb-4">
                        <Col md={4}>
                            <div className="metric-card score">
                                <div className="metric-icon">
                                    <i className="fas fa-trophy"></i>
                                </div>
                                <h3>{studentReportData[0].total_score}</h3>
                                <p>Total Score</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="metric-card duration">
                                <div className="metric-icon">
                                    <i className="fas fa-stopwatch"></i>
                                </div>
                                <h3>{(studentReportData[0].time_taken / 60).toFixed(1)} min</h3>
                                <p>Duration</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="metric-card focus">
                                <div className="metric-icon">
                                    <i className="fas fa-eye"></i>
                                </div>
                                <h3>{studentReportData[0].focus_loss_count}</h3>
                                <p>Focus Loss</p>
                            </div>
                        </Col>
                    </Row>

                    
                        <div className="feedback-card">
                            <h3 className="feedback-title">
                                <i className="fas fa-comment-dots me-3"></i>
                                AI Feedback Summary
                            </h3>
                            <div className='feedback-content'>
                                {studentReportData[0].feedback_summary ? (
                                    typeof studentReportData[0].feedback_summary === "string" ? (
                                        <p className="feedback-text">
                                            {studentReportData[0].feedback_summary}
                                        </p>
                                    ) : (
                                        <div>
                                            {studentReportData[0].feedback_summary.summary && (
                                                <p className="feedback-summary">
                                                    {studentReportData[0].feedback_summary.summary}
                                                </p>
                                            )}

                                            {studentReportData[0].feedback_summary.areas_of_strength && (
                                                <div className="strengths">
                                                    <strong>Strengths:</strong>{" "}
                                                    {studentReportData[0].feedback_summary.areas_of_strength.join(", ")}
                                                </div>
                                            )}

                                            {studentReportData[0].feedback_summary.areas_for_improvement && (
                                                <div className="improvements">
                                                    <strong>Areas to Improve:</strong>{" "}
                                                    {studentReportData[0].feedback_summary.areas_for_improvement.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="feedback-placeholder">
                                        <i className="fas fa-robot fa-2x text-muted mb-3"></i>
                                        <p className="text-muted mb-0">
                                            AI feedback is not available for this submission.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    <div className="questions-section mt-5">
                        <h3 className="section-title full-width-title">
                            <i className="fas fa-list-ol me-3"></i>
                            Question-wise Performance
                        </h3>
                        <StudentReportTable studentReportTableData={reportData} examType={examType} />
                    </div>
                </div>
            )}        
        </>
    
    )
}
