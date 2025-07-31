import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useEssayQuestions } from "../../../Context/QuestionsContext/EssayContext";
import { UserContext } from "../../../Context/UserContext";
import QuestionsNavigator from "../features/QuestionsNavigator";
import supabase from "../../../supabaseClient";

const EssayQuestionsList = () => {
    // Get exam ID from URL parameters
  const { id: examId } = useParams();
    // Get logged-in user ID from context
  const { userId } = useContext(UserContext);
   
   // Destructure methods and state from EssayContext
  const {
    fetchEssayQuestions,
    essayQuestions = [],
    studentEssayAnswers,
    handleEssayAnswerChange,
    submitEssayAnswers,
  } = useEssayQuestions();

  // Component state management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [focusLossCount, setFocusLossCount] = useState(0); // Number of times tab was switched
  const [showWarningBanner, setShowWarningBanner] = useState(false); // Show tab switch warning
  const [feedbackList, setFeedbackList] = useState([]);
  //  Fetch essay questions
  useEffect(() => {
    fetchEssayQuestions(examId);
  }, [examId]);

  //  Fetch exam duration from "exams" table
  useEffect(() => {
    const fetchExamDuration = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("duration")
        .eq("exam_id", examId)
        .single();

      if (error) {
        console.error("Error fetching exam duration:", error);
        setTimeLeft(30 * 60);  // Default to 30 minutes
      } else {
        const minutes = data?.duration;
        if (typeof minutes === "number") {
          setTimeLeft(minutes * 60); // Convert to seconds
        } else {
          console.warn("Invalid duration. Defaulting to 30 min.");
          setTimeLeft(30 * 60);
        }
      }
    };

    fetchExamDuration();
  }, [examId]);

  // ✅ Timer logic
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0 && !submitted) {
      console.log("⏰ Time's up. Submitting...");
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // Track when user switches tabs and show warning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFocusLossCount((prev) => prev + 1);
        setShowWarningBanner(true);

        setTimeout(() => {
          setShowWarningBanner(false);
        }, 3000); // Show banner for 3 seconds
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

   // Format remaining time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Update answer state on text input change
  const handleChange = (questionId, text) => {
    handleEssayAnswerChange(questionId, text);
  };
  
    // Show review mode before final submission
  const handleInitialSubmit = () => {
    setReviewMode(true);
  };
 
   // Submit essay answers to database
  const handleFinalSubmit = async () => {
    await submitEssayAnswers({
      studentId: userId,
      examId,
      answers: studentEssayAnswers,
    });
    setSubmitted(true);
  };

   // Display thank you message after submission
  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-success mb-4">Submission Successful</h2>
        <p>Thank you for submitting your essay answers.</p>
      </div>
    );
  }

  // Review screen for checking answers before final submit
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
          <button
            className="btn btn-secondary me-3"
            onClick={() => setReviewMode(false)}
          >
            Back to Questions
          </button>
          <button className="btn btn-success" onClick={handleFinalSubmit}>
            Confirm & Submit
          </button>
        </div>
      </div>
    );
  }
    // Loading state before questions are ready
  if (!essayQuestions.length || timeLeft === null) {
    return <p>Loading essay questions...</p>;
  }
    // Get currently selected question
  const currentQuestion = essayQuestions[currentQuestionIndex];

  return (
    <div className="container mt-5">
         {/* Display tab switch warning banner */}
      {showWarningBanner && (
        <div 
         style={{
      backgroundColor: "#d9534f", // Bootstrap danger red
      color: "white",
      fontWeight: "bold",
      padding: "12px",
      textAlign: "center",
      position: "fixed", //  Keep it on top
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 9999,
    }}
  >
    ⚠️ You switched tabs. This behavior is being monitored.
        </div>
      )}
       {/* Display question UI */}
      <h2>Essay Questions</h2>
      <p>
        <strong>Time Left:</strong> {formatTime(timeLeft)}
      </p>

      <div className="card mb-3">
        <div className="card-header">
          <strong>Question {currentQuestionIndex + 1}:</strong>
        </div>
        <div className="card-body">
          <p>{currentQuestion.question_text}</p>
          <p>
            <strong>Word Limit:</strong> {currentQuestion.word_limit}
          </p>
          <p>
            <strong>Grading Note:</strong> {currentQuestion.grading_note}
          </p>

          <textarea
            rows={10}
            className="form-control"
            placeholder="Write your answer here..."
            value={studentEssayAnswers[currentQuestion.question_id] || ""}
            onChange={(e) =>
              handleChange(currentQuestion.question_id, e.target.value)
            }
          />

          <div className="mt-3">
            Word Count:{" "}
            {studentEssayAnswers[currentQuestion.question_id]?.split(/\s+/)
              .filter((word) => word).length || 0}
          </div>
        </div>
      </div>

        {/* Navigation buttons */}
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
          <button className="btn btn-success ms-auto" onClick={handleInitialSubmit}>
            Submit
          </button>
        )}
      </div>

      {/* Question Navigator component */}
      <QuestionsNavigator
        questions={essayQuestions}
        questionIndex={currentQuestionIndex}
        setQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default EssayQuestionsList;
