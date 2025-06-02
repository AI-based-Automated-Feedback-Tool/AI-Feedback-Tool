import { Card, CardBody, Row, Col } from 'react-bootstrap';

export default function PerformanceAnalysisCards({ avgTimeInMinutes, avgFocusLoss }) {
  return (
    <CardBody>
        <h5 className='mb-4'>📉 Performance Analysis</h5>
        <Row>
            <Col md={6}>
                <Card className="text-center border-0 shadow-sm bg-light">
                    <CardBody>
                        <p className="text-muted mb-1">Average time taken</p>
                        <h3 className="fw-bold text-primary">     
                            {avgTimeInMinutes} min
                        </h3>
                    </CardBody>
                </Card>
            </Col>
            <Col md={6}>
                <Card className="text-center border-0 shadow-sm bg-light">
                    <CardBody>
                        <p className="text-muted mb-1">Average focus loss per student</p>
                        <h3 className="fw-bold text-primary">
                            {avgFocusLoss}
                        </h3>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </CardBody>
  )
}
