import React, { useEffect, useState } from "react";
import { useCodeQuestions } from "../../../Context/QuestionsContext/CodeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import QuestionsNavigator from "../features/QuestionsNavigator";
import PaginationControls from "../features/Pagination";

const CodeQuestionsList = () => {
  //fetch questions and message from the context
  const { fetchCodeQuestions, questions = [], message } = useCodeQuestions();

  //to store student answers for each question
  const [studentAnswers, setStudentAnswers] = useState({});

  //to track the current question index for navigation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //fetch code questions when the component is mounted
  useEffect(() => {
    fetchCodeQuestions();
  }, [fetchCodeQuestions]);

  //handle changes in the student code input
  const handleChange = (id, code) => {
    setStudentAnswers((prev) => ({ ...prev, [id]: code }));
  };

  //handle submission of a student's answer for a specific question
  const handleSubmit = (id) => {
    const answer = studentAnswers[id];
    console.log("Submitting answer for question", id, answer);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Practice Code Questions</h1>

      {/*display message if available */}
      {message && <div className="alert alert-info">{message}</div>}

      {questions.length > 0 ? (
        <div className="row">
          {/* Main content area */}
          <div className="col-md-8 mb-5">
            <div className="card shadow-sm">
              {/*card header with question number*/}
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">
                  Question {currentQuestionIndex + 1}
                </h5>
              </div>
              <div className="card-body">
                {/*display question*/}
                <p>
                  <strong>{currentQuestionIndex + 1})</strong>{" "}
                  {questions[currentQuestionIndex].question_description}
                </p>
                {/*textarea for student to write their code*/}
                <label>
                  <strong>Your Code:</strong>
                </label>
                <textarea
                  className="form-control"
                  rows={10}
                  value={
                    studentAnswers[questions[currentQuestionIndex].id] ||
                    `${
                      questions[currentQuestionIndex].function_signature || ""
                    }\n\n# Write your code here\n`
                  }
                  onChange={(e) =>
                    handleChange(
                      questions[currentQuestionIndex].id,
                      e.target.value
                    )
                  }
                ></textarea>

                {/*display wrapper code for reference if available*/}
                {questions[currentQuestionIndex].wrapper_code && (
                  <>
                    <label className="mt-3">
                      <strong>Wrapper Code (for reference):</strong>
                    </label>
                    <pre className="bg-light p-3 rounded">
                      {questions[currentQuestionIndex].wrapper_code}
                    </pre>
                  </>
                )}

                {/* Conditional rendering for buttons */}
                {questions.length === 1 ? (
                  // Show only Submit button if there's one question
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-success"
                      onClick={() => handleSubmit(questions[currentQuestionIndex].id)}
                    >
                      Submit
                    </button>
                  </div>
                ) : currentQuestionIndex === questions.length - 1 ? (
                  //show Back and Submit buttons for the last question
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setCurrentQuestionIndex(currentQuestionIndex - 1)
                      }
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleSubmit(questions[currentQuestionIndex].id)}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  //show pagination controls for navigating questions
                  <PaginationControls
                    currentQuestionIndex={currentQuestionIndex}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                    questions={questions}
                  />
                )}
              </div>
            </div>
          </div>
          {/*sidebar for QuestionsNavigator */}
          <div className="col-md-4">
            <QuestionsNavigator
              questions={questions}
              questionIndex={currentQuestionIndex}
              setQuestionIndex={setCurrentQuestionIndex}
            />
          </div>
        </div>
      ) : (
        //display message if no questions are available
        <div className="text-center">
          <p className="text-muted">No questions available</p>
        </div>
      )}
    </div>
  );
};

export default CodeQuestionsList;