import { Row, Col } from 'react-bootstrap';
import '../../../css/Reports/OverallReport/PerformanceAnalysisCards.css';

export default function PerformanceAnalysisCards({ avgTimeInMinutes, avgFocusLoss }) {
  return (
    <div className="performance-analysis-section">
        <h3 className="section-title">
            Performance Analysis
        </h3>
        <p className="section-subtitle">
            Key insights from student behavior during the exam
        </p>
        <Row className="g-4">
            <Col md={6}>
                <div className="analysis-card time">
                    <div className="analysis-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="analysis-content">
                        <div className="analysis-value">
                            {avgTimeInMinutes}
                            <span className="unit">min</span>
                        </div>
                        <div className="analysis-label">Average Time Taken</div>
                    </div>
                </div>
            </Col>
            <Col md={6}>
                <div className="analysis-card focus">
                    <div className="analysis-icon">
                        <i className="fas fa-eye"></i>
                    </div>
                    <div className="analysis-content">
                        <div className="analysis-value">
                            {avgFocusLoss}
                            <span className="unit">times</span>
                        </div>
                        <div className="analysis-label">Avg Focus Loss per Student</div>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
  )
}
