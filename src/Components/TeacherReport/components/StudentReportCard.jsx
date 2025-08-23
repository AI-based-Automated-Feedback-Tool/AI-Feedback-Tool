import React from 'react'
import { Row, Col, CardHeader, CardBody, Card } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import StudentReportTable from './StudentReportTable';


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
            <Alert variant="info">
                <p className="mb-0">
                    No report available to for this student.
                </p>
            </Alert>
        ):( 
            <div>
                <Row className="mb-4 mt-4">
                    <Card className="text-start border-0 shadow-sm bg-light">
                        <CardBody>
                            <h5>
                                <span className="text-muted mb-1">🧑‍🎓 Student Name: </span>
                                <span className="fw-bold text-primary">{studentReportData[0].users.name}</span>
                            </h5>                    
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-4 mt-4">
                    <Card className="text-start border-0 shadow-sm bg-light">
                        <CardBody>
                            <h5>
                                <span className="text-muted mb-1">⏱ Submission date and time: </span>
                                <span className="fw-bold text-primary">{formatDateTime(studentReportData[0].submitted_at)}</span>
                            </h5>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-4 mt-4">
                    <Col md={4}>
                        <Card className="text-center border-0 shadow-sm bg-light">
                            <CardBody>
                                <p className="text-muted mb-1">Score</p>
                                <h3 className="fw-bold text-primary">{studentReportData[0].total_score}</h3>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center border-0 shadow-sm bg-light">
                            <CardBody>
                                <p className="text-muted mb-1">Duration</p>
                                <h3 className="fw-bold text-primary">{(studentReportData[0].time_taken/60).toFixed(2)} minutes</h3>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center border-0 shadow-sm bg-light">
                            <CardBody>
                                <p className="text-muted mb-1">Focus loss count</p>
                                <h3 className="fw-bold text-primary">{studentReportData[0].focus_loss_count}</h3>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="mb-4 mt-4">
                    <Card className="text-start border-0 shadow-sm bg-light">
                        <CardBody>
                            <h5>
                                <span className="text-muted mb-3">💬 Overall Feedback: </span>
                            </h5>
                            {studentReportData[0].feedback_summary ? (
                                typeof studentReportData[0].feedback_summary === "string" ? (
                                <p className="fw-normal text-dark ms-4">
                                    {studentReportData[0].feedback_summary}
                                </p>
                                ) : (
                                <div className="ms-4">
                                    {studentReportData[0].feedback_summary.summary && (
                                    <p className="fw-normal text-dark">
                                        {studentReportData[0].feedback_summary.summary}
                                    </p>
                                    )}

                                    {studentReportData[0].feedback_summary.areas_of_strength && (
                                    <p className="fw-normal text-dark">
                                        <strong>Strengths:</strong>{" "}
                                        {studentReportData[0].feedback_summary.areas_of_strength.join(", ")}
                                    </p>
                                    )}

                                    {studentReportData[0].feedback_summary.areas_for_improvement && (
                                    <p className="fw-normal text-dark">
                                        <strong>Improvements:</strong>{" "}
                                        {studentReportData[0].feedback_summary.areas_for_improvement.join(", ")}
                                    </p>
                                    )}
                                </div>
                                )
                            ) : (
                                <span className="fw-normal text-dark ms-4">No feedback available</span>
                            )}
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-4 mt-4">
                    <Card className="border-0 shadow-sm bg-light">
                        <CardHeader className="bg-white border-0 mt-3">
                        <h5 className="text-muted mb-1">📊 Question Details :</h5>
                        </CardHeader>
                    <CardBody>
                        <StudentReportTable studentReportTableData={reportData} examType={examType} />
                    </CardBody>
                    </Card>
                </Row>
            </div>
        )}
    </>
    
  )
}
