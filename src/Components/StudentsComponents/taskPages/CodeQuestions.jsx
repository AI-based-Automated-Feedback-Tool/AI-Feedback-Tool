import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCodeQuestions } from "../../../Context/QuestionsContext/CodeContext";
import { useTask } from "../../../Context/taskContext";
import "bootstrap/dist/css/bootstrap.min.css";
import QuestionsNavigator from "../features/QuestionsNavigator";
import PaginationControls from "../features/Pagination";

const CodeQuestionsList = () => {
  const { id } = useParams();

  // Fetch code questions from context
  const { fetchCodeQuestions, questions = [], message } = useCodeQuestions();

  // Fetch timeLeft and formatTime from useTask context
  const { fetchExamWithQuestions, timeLeft, formatTime } = useTask();

  // To store student answers for each question
  const [studentAnswers, setStudentAnswers] = useState({});

  // To track the current question index for navigation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch code questions and exam metadata (for timer) when the component is mounted
  useEffect(() => {
    fetchCodeQuestions({ examId: id });
    fetchExamWithQuestions(id);
  }, [id, fetchCodeQuestions, fetchExamWithQuestions]);

  // Handle changes in the student code input
  const handleChange = (id, code) => {
    setStudentAnswers((prev) => ({ ...prev, [id]: code }));
  };

  // Handle submission of a student's answer for a specific question
  const handleSubmit = (id) => {
    const answer = studentAnswers[id];
    console.log("Submitting answer for question", id, answer);
    // TODO: Connect to backend or store submission
  };

  // Handle running the code
  const handleRun = (id) => {
    const codeToRun = studentAnswers[id];
    console.log("Running code for question", id, codeToRun);
    // TODO: Integrate with backend or code execution service
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Practice Code Questions</h1>

      {/* Display remaining time like in TaskPage */}
      {timeLeft !== null ? (
        <div className="alert alert-info text-center">
          Time Remaining: <strong>{formatTime(timeLeft)}</strong>
        </div>
      ) : (
        <div className="text-center text-muted">Loading timer...</div>
      )}

      {/* Display message if available */}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Render questions if available */}
      {questions.length > 0 ? (
        <div className="row">
          {/* Main content area */}
          <div className="col-md-8 mb-5">
            <div className="card shadow-sm">
              {/* Card header with question number */}
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">
                  Question {currentQuestionIndex + 1}
                </h5>
              </div>
              <div className="card-body">
                {/* Display question */}
                <p>
                  <strong>{currentQuestionIndex + 1})</strong>{" "}
                  {questions[currentQuestionIndex].question_description}
                </p>

                {/* Textarea for student to write their code */}
                <label>
                  <strong>Your Code:</strong>
                </label>
                <textarea
                  className="form-control"
                  rows={15}
                  value={
                    studentAnswers[questions[currentQuestionIndex].id] ||
                    `${
                      questions[currentQuestionIndex].function_signature || ""
                    }\n\n# Write your code here\n\n${
                      questions[currentQuestionIndex].wrapper_code || ""
                    }`
                  }
                  onChange={(e) =>
                    handleChange(
                      questions[currentQuestionIndex].id,
                      e.target.value
                    )
                  }
                ></textarea>

                {/* Conditional rendering for buttons */}
                {questions.length === 1 ? (
                  // Show only Submit and Run buttons if there's one question
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() =>
                        handleRun(questions[currentQuestionIndex].id)
                      }
                    >
                      Run
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleSubmit(questions[currentQuestionIndex].id)
                      }
                    >
                      Submit
                    </button>
                  </div>
                ) : currentQuestionIndex === questions.length - 1 ? (
                  // Show Back, Run, and Submit buttons for the last question
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setCurrentQuestionIndex(currentQuestionIndex - 1)
                      }
                    >
                      Back
                    </button>
                    <div>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                          handleRun(questions[currentQuestionIndex].id)
                        }
                      >
                        Run
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleSubmit(questions[currentQuestionIndex].id)
                        }
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  // Show pagination controls for navigating questions
                  <PaginationControls
                    currentQuestionIndex={currentQuestionIndex}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                    questions={questions}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar for QuestionsNavigator */}
          <div className="col-md-4">
            <QuestionsNavigator
              questions={questions}
              questionIndex={currentQuestionIndex}
              setQuestionIndex={setCurrentQuestionIndex}
            />
          </div>
        </div>
      ) : (
        // Display message if no questions are available
        <div className="text-center">
          <p className="text-muted">No questions available</p>
        </div>
      )}
    </div>
  );
};

export default CodeQuestionsList;