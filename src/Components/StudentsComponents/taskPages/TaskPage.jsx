import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "../../../Context/taskContext.jsx";
import PopUp from "../PopUp.jsx";
import QuestionsNavigator from "../features/QuestionsNavigator.jsx";
import EssayQuestionsList from "./EssayQuestionsList.jsx"; 

const TaskPage = () => {
  const [showTabWarning, setShowTabWarning] = useState(false);
  const {
    task,
    loading,
    questionIndex,
    answers,
    reviewMode,
    alreadySubmitted,
    setReviewMode,
    fetchExamWithQuestions,
    handleAnswerSelect,
    handleNext,
    handleBack,
    handleSubmit,
    setQuestionIndex,
    showPopup,
    popupMessage,
    setShowPopup,
    formatTime,
    timeLeft,
  } = useTask();

  //get task id from url
  const { id } = useParams();
  const navigate = useNavigate();

  //fetch the exam and its questions when the component mounts or the ID changes
  useEffect(() => {
    fetchExamWithQuestions(id);
  }, [id, fetchExamWithQuestions]);

  // Add visibilitychange listener to detect tab switches
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

  if (loading) return <div className="container mt-4">⏳ Loading task...</div>;
  //display a message if the exam has already been submitted
  if (alreadySubmitted) {
    return (
      <div className="container mt-4 text-danger">
        You have already submitted this exam. You cannot retake it.
      </div>
    );
  }

   //  Render EssayQuestionsList if task type is essay
  if (task.task_type === "essay") {
    return <EssayQuestionsList />;
  }
  //handle cases where the task or its questions are not found
  if (!task || !task.questions || task.questions.length === 0)
    return (
      <div className="container mt-4 text-danger">
        Task or questions not found.
      </div>
    );

  //get the current question based on the question index
  const currentQuestion = task.questions[questionIndex];


  return (
    <>
      {/*  Add warning banner UI for tab switching */}
      {/*  Only show during active exam (not review) */}
      {!reviewMode && showTabWarning && (
        <div
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            backgroundColor: "#d32f2f",
            color: "white",
            padding: "10px",
            textAlign: "center",
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          ⚠️ You switched tabs. This behavior is being monitored.
        </div>
      )}

      <div className="container-fluid py-4 taskContainer">
        <div className="row">
          {/*left side: Question area*/}
          <div className="col-lg-9 col-md-8 mb-4">
            <div className="bg-light p-4 shadow rounded h-100">
              <h2 className="text-primary mb-3">{task.title}</h2>
              <p>
                <strong>Type:</strong> {task.type || "Exam"}
              </p>

              {timeLeft !== null && (
                <div className="alert alert-info text-center">
                  Time Remaining: <strong>{formatTime(timeLeft)}</strong>
                </div>
              )}
              <hr />

              {reviewMode ? (
                <>
                  <h4 className="mb-3">📝 Review Your Answers</h4>
                  <ul className="list-group">
                    {task.questions.map((q, idx) => (
                      <li key={q.id} className="list-group-item">
                        <strong>
                          Q{idx + 1}: {q.question}
                        </strong>
                        <br />
                        <span className="text-primary">
                          Answer: {answers[idx] || "Not answered"}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setReviewMode(false)}
                    >
                      Go Back
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleSubmit(navigate)}
                    >
                      Confirm Submit
                    </button>
                    <PopUp
                      message={popupMessage}
                      isVisible={showPopup}
                      onClose={() => setShowPopup(false)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h5>
                    Question {questionIndex + 1} of {task.questions.length}
                  </h5>
                  <p className="mb-4">{currentQuestion.question}</p>

                  {currentQuestion.options.map((opt, idx) => (
                    <div key={idx} className="form-check mb-2">
                      <input
                        type="radio"
                        id={`q${questionIndex}_${idx}`}
                        className="form-check-input"
                        name={`q${questionIndex}`}
                        value={opt}
                        checked={answers[questionIndex] === opt}
                        onChange={() => handleAnswerSelect(questionIndex, opt)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`q${questionIndex}_${idx}`}
                      >
                        {opt}
                      </label>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn btn-secondary"
                      onClick={handleBack}
                      disabled={questionIndex === 0}
                    >
                      Back
                    </button>

                    {questionIndex === task.questions.length - 1 ? (
                      <button
                        className="btn btn-warning"
                        onClick={() => setReviewMode(true)}
                      >
                        Review Answers
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={handleNext}>
                        Next
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/*right side: Question navigator*/}
          <div className="col-lg-3 col-md-4">
            <QuestionsNavigator
              questions={task.questions}
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskPage;
