import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useEssayQuestions } from "../../../Context/QuestionsContext/EssayContext";
import { UserContext } from "../../../Context/UserContext";
import QuestionsNavigator from "../features/QuestionsNavigator";
import { supabase } from '../../../SupabaseAuth/supabaseClient';



const EssayQuestionsList = () => {
  // Get the exam ID from the URL params
  const { id: examId } = useParams();

   // Get the logged-in user ID from context
  const { userId } = useContext(UserContext);

   // Extract state and functions from EssayContext
  const {
    fetchEssayQuestions,
    essayQuestions = [],
    studentEssayAnswers,
    handleEssayAnswerChange,
    submitEssayAnswers,
  } = useEssayQuestions();

   // Local states for managing the UI
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [essayFeedback, setEssayFeedback] = useState([]);

  //  Fetch essay questions when component mounts
  useEffect(() => {
    fetchEssayQuestions(examId);
  }, [examId]);

  //  Fetch the exam duration (in minutes) from Supabase
  useEffect(() => {
    const fetchExamDuration = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("duration")
        .eq("exam_id", examId)
        .single();

      if (error) {
        console.error("Error fetching exam duration:", error);
        setTimeLeft(30 * 60);  // fallback to 30 mins
      } else {
        const minutes = data?.duration;
        setTimeLeft(typeof minutes === "number" ? minutes * 60 : 30 * 60);
      }
    };
    fetchExamDuration();
  }, [examId]);

  //  Countdown timer that auto-submits when time is up
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0 && !submitted) {
      console.log("⏰ Time's up. Submitting...");
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

   // Track if student switches browser tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFocusLossCount((prev) => prev + 1);
        setShowWarningBanner(true);
        setTimeout(() => setShowWarningBanner(false), 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  //  Format timer from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  //  Handle input change for each question
  const handleChange = (questionId, text) => {
    handleEssayAnswerChange(questionId, text);
  };
   //  Trigger review mode before final submission
  const handleInitialSubmit = () => {
    setReviewMode(true);
  };
    //  Submit answers and request AI feedback
  const handleFinalSubmit = async () => {
    // Submit essay answers and get back submissionId
    const id = await submitEssayAnswers({
      studentId: userId,
      examId,
      answers: studentEssayAnswers,
    });
    setSubmissionId(id);

    //  Call backend to generate feedback
    try {
      const res = await fetch("http://localhost:3000/api/essay-feedback/generate-essay-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id }),
      });

      const result = await res.json();
      console.log(" AI feedback result:", result);

      if (result.success) {
        // Fetch updated answers with feedback
        const { data, error } = await supabase
          .from("essay_exam_submissions_answers")
          .select("question_id, student_answer, ai_feedback")
          .eq("submission_id", id);

        if (!error) {
          setEssayFeedback(data);
        } else {
          console.error(" Error fetching saved feedback:", error);
        }
      } else {
        console.warn(" Feedback result:", result.error);
      }
    } catch (err) {
      console.error(" Error fetching feedback:", err);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-success mb-4">Submission Successful</h2>
        <p>Thank you for submitting your essay answers.</p>
        <h4 className="mt-5">📌 AI Feedback</h4>
        <ul className="list-group">
          {essayFeedback.map((item, index) => {
             const parsed = item.student_answer;
            return (
              <li key={index} className="list-group-item text-start">
                <strong>Q{index + 1}:</strong> {parsed.text}
                <br />
                <strong>AI Feedback:</strong> {item.ai_feedback?.comment || "No feedback"}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
    //  Review screen before final submit
  if (reviewMode) {
    return (
      <div className="container mt-5">
        <h3>📝 Review Your Answers</h3>
        <ul className="list-group">
          {essayQuestions.map((q, idx) => (
            <li key={q.question_id} className="list-group-item">
              <strong>Q{idx + 1}:</strong> {q.question_text}
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
  //  Loading state before data is ready
  if (!essayQuestions.length || timeLeft === null) {
    return <p>Loading essay questions...</p>;
  }

  const currentQuestion = essayQuestions[currentQuestionIndex];
   //  Main essay question UI
  return (
    <div className="container mt-5">
      {showWarningBanner && (
        <div
          style={{
            backgroundColor: "#d9534f",
            color: "white",
            fontWeight: "bold",
            padding: "12px",
            textAlign: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 9999,
          }}
        >
          ⚠️ You switched tabs. This behavior is being monitored.
        </div>
      )}

      <h2>Essay Questions</h2>
      <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>

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
            Word Count:{" "}
            {studentEssayAnswers[currentQuestion.question_id]
              ?.split(/\s+/)
              .filter((word) => word).length || 0}
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
