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
          {questions.map((question) => (
            <div className="col-md-6 mb-4" key={question.id}>
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Question ID: {question.id}</h5>
                </div>
                <div className="card-body">
                  <p><strong>Title:</strong> {question.description}</p>
                  <p><strong>Function Signature:</strong> {question.function_signature}</p>
                  <p><strong>Wrapper Code:</strong> {question.wrapper_code}</p>
                  <p><strong>Test Cases:</strong> {question.test_cases}</p>
                  <p><strong>Language ID:</strong> {question.language_id}</p>
                  <p><strong>Exam ID:</strong> {question.exam_id}</p>
                  <p><strong>Points:</strong> {question.points}</p>
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