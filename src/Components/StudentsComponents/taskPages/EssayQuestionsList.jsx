import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useEssayQuestions } from "../../../Context/QuestionsContext/EssayContext";
import { UserContext } from "../../../Context/UserContext";
import { useTask } from "../../../Context/taskContext";
import QuestionsNavigator from "../features/QuestionsNavigator";

const EssayQuestionsList = () => {
  const { id: examId } = useParams();
  const { userId } = useContext(UserContext);
  const { timeLeft, formatTime } = useTask();

  console.log("Rendering EssayQuestionsList for examId:", examId);

  const {
    fetchEssayQuestions,
    essayQuestions = [],
    studentEssayAnswers,
    handleEssayAnswerChange,
    submitEssayAnswers,
  } = useEssayQuestions();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchEssayQuestions(examId);
  }, [examId]);

  const handleChange = (questionId, text) => {
    handleEssayAnswerChange(questionId, text);
  };

  const handleInitialSubmit = () => {
    setReviewMode(true);
  };

  const handleFinalSubmit = async () => {
    await submitEssayAnswers({
      studentId: userId,
      examId,
      answers: studentEssayAnswers,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-success mb-4"> Submission Successful</h2>
        <p>Thank you for submitting your essay answers.</p>
      </div>
    );
  }

  if (reviewMode) {
    return (
      <div className="container mt-5">
        <h3>📝 Review Your Answers</h3>
        <ul className="list-group">
          {essayQuestions.map((q, idx) => (
            <li key={q.question_id} className="list-group-item">
              <strong>Q{idx + 1}:</strong> {q.question_text}
              <br />
              <strong>Your Answer:</strong>
              <p>{studentEssayAnswers[q.question_id] || "Not answered"}</p>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-secondary me-3" onClick={() => setReviewMode(false)}>
            Back to Questions
          </button>
          <button className="btn btn-success" onClick={handleFinalSubmit}>
             Confirm & Submit
          </button>
        </div>
      </div>
    );
  }

  if (!essayQuestions.length) {
    return <p>Loading essay questions...</p>;
  }

  const currentQuestion = essayQuestions[currentQuestionIndex];

  return (
    <div className="container mt-5">
      <h2>Essay Questions</h2>
      <p>Time Left: {formatTime(timeLeft)}</p>

      <div className="card mb-3">
        <div className="card-header">
          <strong>Question {currentQuestionIndex + 1}:</strong>
        </div>
        <div className="card-body">
          <p>{currentQuestion.question_text}</p>
          <p><strong>Word Limit:</strong> {currentQuestion.word_limit}</p>
          <p><strong>Grading Note:</strong> {currentQuestion.grading_note}</p>

          <textarea
            rows={10}
            className="form-control"
            placeholder="Write your answer here..."
            value={studentEssayAnswers[currentQuestion.question_id] || ""}
            onChange={(e) => handleChange(currentQuestion.question_id, e.target.value)}
          />

          <div className="mt-3">
            Word Count: {studentEssayAnswers[currentQuestion.question_id]?.split(/\s+/).length || 0}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        {currentQuestionIndex > 0 && (
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >
            Back
          </button>
        )}
        {currentQuestionIndex < essayQuestions.length - 1 ? (
          <button
            className="btn btn-primary ms-auto"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
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

      <QuestionsNavigator
        questions={essayQuestions}
        questionIndex={currentQuestionIndex}
        setQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default EssayQuestionsList;
