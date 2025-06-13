import React from "react";

const PaginationControls = ({ currentQuestionIndex, setCurrentQuestionIndex, questions }) => {
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="d-flex justify-content-between mt-3">
      <button
        className="btn btn-secondary"
        onClick={handleBack}
        disabled={currentQuestionIndex === 0}
      >
        Back
      </button>
      <button
        className="btn btn-primary"
        onClick={handleNext}
        disabled={currentQuestionIndex === questions.length - 1}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;