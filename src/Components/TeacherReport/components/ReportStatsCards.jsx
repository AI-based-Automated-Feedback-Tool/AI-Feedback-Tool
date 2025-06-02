import { Row, Col, CardHeader, CardBody, Card } from 'react-bootstrap';

export default function ReportStatsCards({ noOfStudentsDoneExam, avgScore, highestScore }) {
  return (
    <CardBody>
        <Row className="mb-4 mt-4">
            <Col md={4}>
                <Card className="text-center border-0 shadow-sm bg-light">
                    <CardBody>
                        <p className="text-muted mb-1">Total Students Attempted</p>
                        <h3 className="fw-bold text-primary">{noOfStudentsDoneExam}</h3>
                    </CardBody>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="text-center border-0 shadow-sm bg-light">
                    <CardBody>
                        <p className="text-muted mb-1">Average Score</p>
                        <h3 className="fw-bold text-primary">{avgScore}</h3>
                    </CardBody>
                </Card>
            </Col> 
            <Col md={4}>
                <Card className="text-center border-0 shadow-sm bg-light">
                    <CardBody>
                        <p className="text-muted mb-1">Highest Score</p>
                        <h3 className="fw-bold text-primary">{highestScore}</h3>
                    </CardBody>
                </Card>
            </Col>                                                         
        </Row>
    </CardBody>
  )
}
