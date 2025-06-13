import React from "react";

const QuestionsNavigator = ({
  questions,
  questionIndex,
  handleQuestionJump,
}) => {
  return (
    <div
      className="bg-white p-3 shadow rounded sticky-top"
      style={{ top: "80px", maxHeight: "80vh", overflowY: "auto" }}
    >
      <h6 className="text-center mb-3">Questions</h6>
      <div className="d-flex flex-row flex-wrap justify-content-center gap-2">
        {questions.map((_, idx) => (
          <button
            key={idx}
            className={`btn ${
              idx === questionIndex ? "btn-primary" : "btn-outline-secondary"
            } rounded-circle`}
            style={{
              width: "40px",
              height: "40px",
              fontWeight: "bold",
            }}
            onClick={() => handleQuestionJump(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionsNavigator;
