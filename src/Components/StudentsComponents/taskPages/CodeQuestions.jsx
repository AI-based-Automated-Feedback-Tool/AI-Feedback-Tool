import React, { useEffect } from "react";
import { useCodeQuestions } from "../../../Context/QuestionsContext/CodeContext";
import "bootstrap/dist/css/bootstrap.min.css";

const CodeQuestionsList = () => {
  //default value for questions is an empty array
  const { fetchCodeQuestions, questions = [], message } = useCodeQuestions();

  useEffect(() => {
    fetchCodeQuestions();
  }, [fetchCodeQuestions]);

  return (
    <div className="container mt-5">
    <h1 className="text-center mb-4">Code Questions</h1>
    {message && <div className="alert alert-info">{message}</div>}
    {questions.length > 0 ? (
      <div className="row">
        {questions.map((question, index) => (
          <div className="col-md-6 mb-4" key={question.id || index}>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Question ID: {question.id || "N/A"}</h5>
              </div>
              <div className="card-body">
                <p><strong>Title:</strong> {question.description || "No description available"}</p>
                <p><strong>Function Signature:</strong> {question.function_signature || "N/A"}</p>
                <p><strong>Wrapper Code:</strong> {question.wrapper_code || "N/A"}</p>
                <p>
                  <strong>Test Cases:</strong>{" "}
                  {typeof question.test_cases === "object"
                    ? JSON.stringify(question.test_cases)
                    : question.test_cases || "N/A"}
                </p>
                <p><strong>Language ID:</strong> {question.language_id || "N/A"}</p>
                <p><strong>Exam ID:</strong> {question.exam_id || "N/A"}</p>
                <p><strong>Points:</strong> {question.points || "N/A"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center">
        <p>No questions available</p>
      </div>
    )}
  </div>
);
};

export default CodeQuestionsList;