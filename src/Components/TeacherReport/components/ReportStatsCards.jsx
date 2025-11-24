import { Row, Col, CardHeader, CardBody, Card } from 'react-bootstrap';
import '../../../css/Reports/OverallReport/ReportStatsCards.css';

export default function ReportStatsCards({ noOfStudentsDoneExam, avgScore, highestScore }) {
  return (
    <div className="stats-cards-section">
        <Row className="g-4">
            <Col md={4}>
                <div className="stat-card students">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-value">{noOfStudentsDoneExam}</div>
                    <div className="stat-label">Students Attempted</div>
                </div>
            </Col>
            <Col md={4}>
                <div className="stat-card average">
                    <div className="stat-icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-value">{avgScore}</div>
                    <div className="stat-label">Average Score</div>
                </div>
            </Col> 
            <Col md={4}>
                <div className="stat-card highest">
                    <div className="stat-icon">
                        <i className="fas fa-trophy"></i>
                    </div>
                    <div className="stat-value">{highestScore}</div>
                    <div className="stat-label">Highest Score</div>
                </div>
            </Col>                                                         
        </Row>
    </div>
  )
}
