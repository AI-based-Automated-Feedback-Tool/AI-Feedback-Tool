import React from 'react';
import { Spinner, Card, CardBody } from 'react-bootstrap';

const LoadingCard = () => {
  return (
    <Card className="mt-4 border-0 shadow-sm text-center" style={{ minHeight: '300px', backgroundColor: '#f0f2f5' }}>
      <CardBody className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
        <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
        <div className="mt-3">
          <h5 className="fw-semibold text-muted">Loading user info...</h5>
          <p className="text-muted small">Please wait while we retrieve your data.</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default LoadingCard;