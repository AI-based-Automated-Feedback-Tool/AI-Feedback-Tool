import React from 'react';

const FeedbackCard = ({ feedback }) => {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}>
      <h3>AI Feedback</h3>
      <p>{feedback}</p>
    </div>
  );
};

export default FeedbackCard;
