import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useEssayQuestions } from "../../../Context/QuestionsContext/EssayContext";
import { UserContext } from "../../../Context/UserContext";
import QuestionsNavigator from "../features/QuestionsNavigator";

const EssayQuestionsList = () => {
  const { id: examId } = useParams();
  const { userId } = useContext(UserContext);

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
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [startTime] = useState(new Date()); // optional: exam start time

  // Fetch questions
  useEffect(() => {
    fetchEssayQuestions(examId);
  }, [examId]);

  // Initialize timer after questions are fetched
  useEffect(() => {
    if (essayQuestions.length > 0) {
      const durationInMinutes = essayQuestions[0]?.duration;
      if (durationInMinutes && typeof durationInMinutes === "number") {
        setTimeLeft(durationInMinutes * 60); // convert minutes to seconds
      } else {
        console.warn("❗ Essay question duration missing or invalid. Defaulting to 30 minutes.");
        setTimeLeft(30 * 60); // fallback to 30 minutes
      }
    }
  }, [essayQuestions]);

  // Timer countdown with auto-submit
  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      console.log("⏰ Time's up! Auto-submitting answers.");
      (async () => {
        await handleFinalSubmit();
      })();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
        <h2 className="text-success mb-4">✅ Submission Successful</h2>
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
            ✅ Confirm & Submit
          </button>
        </div>
      </div>
    );
  }

  if (!essayQuestions.length && !submitted) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading essay questions...</p>
      </div>
    );
  }

  const currentQuestion = essayQuestions[currentQuestionIndex];

  return (
    <div className="container mt-5">
      <h2>📝 Essay Questions</h2>
      <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>
      <p><small>🕒 Exam started at: {startTime.toLocaleTimeString()}</small></p>

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
            ← Back
          </button>
        )}
        {currentQuestionIndex < essayQuestions.length - 1 ? (
          <button
            className="btn btn-primary ms-auto"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next →
          </button>
        ) : (
          <button className="btn btn-success ms-auto" onClick={handleInitialSubmit}>
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
