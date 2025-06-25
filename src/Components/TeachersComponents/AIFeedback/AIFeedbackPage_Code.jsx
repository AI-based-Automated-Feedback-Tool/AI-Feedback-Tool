import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const AIFeedbackPage_Code = () => {
  const { examId } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder: this useEffect will later be used to fetch exam data
  useEffect(() => {
    const init = async () => {
      try {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    init();
  }, [examId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading code feedback...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>AI Feedback for Code Questions</h2>
      <p>This page will show AI-generated feedback for student code submissions.</p>
    </div>
  );
};

export default AIFeedbackPage_Code;
