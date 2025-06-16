import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import { useCodeQuestions } from "../../../Context/QuestionsContext/CodeContext";
import { useTask } from "../../../Context/taskContext";
import "bootstrap/dist/css/bootstrap.min.css";
import QuestionsNavigator from "../features/QuestionsNavigator";

const CodeQuestionsList = () => {
  //get exam id from URL params
  const { id } = useParams();

  //get user info and methods from context
  const { userId, fetchUserData, userData } = useContext(UserContext);

  //get question-related methods and data
  const {
    fetchCodeQuestions,
    questions = [],
    message,
    submitAllAnswers,
    handleCodeChange,
    studentAnswers,
  } = useCodeQuestions();

  //get exam and timer methods from task context
  const { fetchExamWithQuestions, timeLeft, formatTime, task } = useTask();

  //state for current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  //to control review screen visibility
  const [reviewMode, setReviewMode] = useState(false);
  //to track submission
  const [submitted, setSubmitted] = useState(false);
  //to show tab switch warning
  const [showTabWarning, setShowTabWarning] = useState(false);
  //to store code output
  const [runOutput, setRunOutput] = useState("");

  //load questions and exam data when component mounts or id changes
  useEffect(() => {
    fetchCodeQuestions({ examId: id });
    fetchExamWithQuestions(id);
  }, [id]);

  //fetch user data if userId is available
  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  //monitor tab switching and show warning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 3000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  //update student answer for a question
  const handleChange = (id, code) => {
    handleCodeChange(id, code);
  };

  //enter review mode before final submission
  const handleInitialSubmit = () => {
    setReviewMode(true);
  };

  //finalize submission and record time taken
  const handleFinalSubmit = async () => {
    if (!userId) {
      alert("You must be logged in to submit.");
      return;
    }

    const timeTaken = task.duration - timeLeft;

    await submitAllAnswers({
      userId,
      examId: id,
      timeTaken,
      focusLossCount: 0,
    });

    setSubmitted(true);
  };

  //simulate running code and show output placeholder
  const handleRunCode = () => {
    setRunOutput("⏳ Running code...\n\n(Output will appear here later)");
  };

  //show thank you message on submission
  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-success mb-4">✅ Submission Successful</h2>
        <p>Thank you for submitting your answers.</p>
      </div>
    );
  }

  //show review screen before final submission
  if (reviewMode) {
    return (
      <div className="container mt-5">
        <h3 className="text-primary text-center mb-4">
          📝 Review Your Answers
        </h3>
        <ul className="list-group">
          {questions.map((q, idx) => (
            <li key={q.id} className="list-group-item">
              <strong>Q{idx + 1}:</strong> {q.question_description}
              <br />
              <strong>Your Code:</strong>
              <pre className="bg-light p-2 mt-2 rounded">
                {studentAnswers[q.id] || "Not answered"}
              </pre>
            </li>
          ))}
        </ul>

        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-secondary me-3"
            onClick={() => setReviewMode(false)}
          >
            Back to Questions
          </button>
          <button className="btn btn-success" onClick={handleFinalSubmit}>
            ✅ Confirm & Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/*show warning when tab is switched*/}
      {!reviewMode && showTabWarning && (
        <div className="fixed-top bg-danger text-white text-center py-2 fw-bold">
          ⚠️ You switched tabs. This is being monitored.
        </div>
      )}

      <h1 className="text-center mb-4">Practice Code Questions</h1>

      {/*show welcome message*/}
      {userData && (
        <div className="mb-3 text-center">
          <strong>Welcome, {userData.name}!</strong>
        </div>
      )}

      {/*show countdown timer*/}
      {timeLeft !== null ? (
        <div className="alert alert-info text-center">
          Time Remaining: <strong>{formatTime(timeLeft)}</strong>
        </div>
      ) : (
        <div className="text-center text-muted">Loading timer...</div>
      )}

      {/*show any message from context*/}
      {message && <div className="alert alert-info">{message}</div>}

      {/*render question section if questions are available*/}
      {questions.length > 0 ? (
        <div className="row">
          <div className="col-md-8 mb-5">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">
                  Question {currentQuestionIndex + 1}
                </h5>
              </div>
              <div className="card-body">
                {/*show question description*/}
                <p>
                  <strong>{currentQuestionIndex + 1})</strong>{" "}
                  {questions[currentQuestionIndex].question_description}
                </p>

                {/*code input area*/}
                <label>
                  <strong>Your Code:</strong>
                </label>
                <textarea
                  className="form-control"
                  rows={15}
                  value={
                    studentAnswers[questions[currentQuestionIndex].id] ||
                    `${questions[currentQuestionIndex].function_signature || ""}
                    # Write your code here
                    ${questions[currentQuestionIndex].wrapper_code || ""}`
                  }
                  onChange={(e) =>
                    handleChange(
                      questions[currentQuestionIndex].id,
                      e.target.value
                    )
                  }
                ></textarea>

                {/* run code button */}
                <button
                  className="btn btn-warning mt-3"
                  onClick={handleRunCode}
                >
                  ▶️ Run Code
                </button>

                {/*output display area*/}
                <div className="mt-3">
                  <strong>Output:</strong>
                  <pre className="bg-light p-2 rounded">
                    {runOutput || "Output will appear here..."}
                  </pre>
                </div>

                {/*navigation buttons*/}
                <div className="d-flex justify-content-between mt-4">
                  {currentQuestionIndex > 0 && (
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setCurrentQuestionIndex(currentQuestionIndex - 1)
                      }
                    >
                      Back
                    </button>
                  )}

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      className="btn btn-primary ms-auto"
                      onClick={() =>
                        setCurrentQuestionIndex(currentQuestionIndex + 1)
                      }
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="btn btn-success ms-auto"
                      onClick={handleInitialSubmit}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/*question navigator panel*/}
          <div className="col-md-4">
            <QuestionsNavigator
              questions={questions}
              questionIndex={currentQuestionIndex}
              setQuestionIndex={setCurrentQuestionIndex}
            />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted">No questions available</p>
        </div>
      )}
    </div>
  );
};

export default CodeQuestionsList;
