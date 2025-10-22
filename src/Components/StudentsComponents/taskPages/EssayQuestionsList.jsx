// src/Components/StudentsComponents/taskPages/EssayQuestionsList.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useEssayQuestions } from "../../../Context/QuestionsContext/EssayContext";
import { UserContext } from "../../../Context/UserContext";
import QuestionsNavigator from "../features/QuestionsNavigator";
import { supabase } from "../../../SupabaseAuth/supabaseClient";
import ChartUploadSection from "../Chart/ChartUploadSection.jsx";

// services used at final submit time
import { uploadImage } from "../Feedback/uploadImageService";
import { submitChartAnswer } from "../Feedback/generateChartAnalysisService";

const EssayQuestionsList = () => {
  const { id: examId } = useParams();
  const { search } = useLocation();
  const forceChart = new URLSearchParams(search).get("chart") === "1";

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
  const [timeLeft, setTimeLeft] = useState(null);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [showWarningBanner, setShowWarningBanner] = useState(false);

  const [finalFeedback, setFinalFeedback] = useState([]); // [{question_id, channel:'essay'|'chart', text}]

  // load questions
  useEffect(() => {
    if (examId) fetchEssayQuestions(examId);
  }, [examId, fetchEssayQuestions]);

  // load duration
  useEffect(() => {
    if (!examId) return;
    (async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("duration")
        .eq("exam_id", examId)
        .single();
      if (error) {
        console.error("Error fetching exam duration:", error);
        setTimeLeft(30 * 60);
      } else {
        setTimeLeft(((typeof data?.duration === "number" ? data.duration : 30)) * 60);
      }
    })();
  }, [examId]);

  // timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0 && !submitted) {
      handleFinalSubmit();
      return;
    }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted]);

  // tab-focus monitor
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        setFocusLossCount(c => c + 1);
        setShowWarningBanner(true);
        setTimeout(() => setShowWarningBanner(false), 3000);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => console.log("forceChart =", forceChart), [forceChart]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // ---------- unified setters per question ----------
  const setAnswerType = (qid, nextType) => {
    const prev = studentEssayAnswers[qid] ?? {};
    handleEssayAnswerChange(qid, {
      type: nextType, // 'text'|'chart'|'both'
      text: nextType === "chart" ? "" : (prev.text || ""),
      chart: nextType === "text" ? undefined : (prev.chart || undefined),
    });
  };

  const setTextAnswer = (qid, text) => {
    const prev = studentEssayAnswers[qid] ?? { type: "text" };
    handleEssayAnswerChange(qid, { ...prev, type: prev.type || "text", text });
  };

  const setChartAttachment = (qid, payload) => {
    // payload from ChartUploadSection: { file? , url? , mime? }
    const prev = studentEssayAnswers[qid] ?? { type: "chart" };
    handleEssayAnswerChange(qid, {
      ...prev,
      type: prev.type || "chart",
      chart: {
        file: payload?.file || null,
        imageUrl: payload?.url || null,
        imageMime: payload?.mime || null,
      },
    });
  };

  const handleInitialSubmit = () => setReviewMode(true);

  // ---------- FINAL SUBMIT ----------
  const handleFinalSubmit = async () => {
    try {
      // Submit the *structured* answers. (Your context already knows how to persist.)
      const submissionId = await submitEssayAnswers({
        studentId: userId,
        examId,
        answers: studentEssayAnswers,
      });

      if (submissionId) {
        await supabase
          .from("exam_submissions")
          .update({ focus_loss_count: focusLossCount })
          .eq("id", submissionId);
      }

      // Essay feedback (for questions that have text or type includes text)
      let essayRows = [];
      try {
        const res = await fetch("http://localhost:3000/api/essay-feedback/generate-essay-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId }),
        });
        const json = await res.json();
        if (!json.success) console.warn("Essay feedback:", json.error);

        // fetch persisted feedback
        const { data: rows, error: rowsErr } = await supabase
          .from("essay_exam_submissions_answers")
          .select("question_id, ai_feedback, student_answer")
          .eq("submission_id", submissionId);

        if (!rowsErr && Array.isArray(rows)) {
          essayRows = rows
            .filter(r => {
              // Only keep ones that included text
              const sa = r.student_answer;
              if (sa && typeof sa === "object") {
                return sa?.type === "text" || sa?.type === "both";
              }
              // legacy plain string means text
              return typeof r.student_answer === "string";
            })
            .map(r => ({
              question_id: r.question_id,
              channel: "essay",
              text: r?.ai_feedback?.comment || "",
            }));
        }
      } catch (e) {
        console.error("Essay feedback error:", e);
      }

      // Chart feedback (for questions that include chart)
      const chartFeedback = [];
      for (const q of essayQuestions) {
        const ans = studentEssayAnswers[q.question_id];
        if (!ans) continue;

        const needsChart =
          ans.type === "chart" || ans.type === "both";

        if (!needsChart || !ans.chart) continue;

        let { imageUrl, imageMime, file } = ans.chart;

        if (!imageUrl && file) {
          const uploaded = await uploadImage(
            file,
            q.allowed_formats || ["png", "jpg", "jpeg", "svg"]
          );
          imageUrl = uploaded.url;
          imageMime = uploaded.mime;
        }

        if (!imageUrl) continue;

        const res = await submitChartAnswer({
          questionId: q.question_id,
          userId,
          imageUrl,
          imageMime,
          questionText: q.question_text,
        });

        chartFeedback.push({
          question_id: q.question_id,
          channel: "chart",
          text: res?.ai_feedback || "",
        });
      }

      setFinalFeedback([...essayRows, ...chartFeedback]);
      setSubmitted(true);
    } catch (err) {
      console.error("Final submit error:", err);
      alert("Submission failed. Please try again.");
    }
  };

  // ---------- RENDER ----------
  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-success mb-4">Submission Successful</h2>
        <p>Thanks for submitting your answers.</p>

        <h4 className="mt-4">📌 AI Feedback</h4>
        {finalFeedback.length === 0 ? (
          <p className="text-muted">No feedback available.</p>
        ) : (
          <ul className="list-group text-start">
            {finalFeedback.map((f, i) => (
              <li key={i} className="list-group-item">
                <strong>{f.channel === "chart" ? "Diagram" : "Essay"}:</strong>{" "}
                {f.text || "—"}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (reviewMode) {
    return (
      <div className="container mt-5">
        <h3>📝 Review Your Answers</h3>
        <ul className="list-group">
          {essayQuestions.map((q, idx) => {
            const ans = studentEssayAnswers[q.question_id];
            return (
              <li key={q.question_id} className="list-group-item">
                <strong>Q{idx + 1}:</strong> {q.question_text}
                <div className="mt-2">
                  <div><em>Type:</em> {ans?.type || "(none)"}</div>
                  {ans?.text ? <div className="mt-1">{ans.text}</div> : null}
                  {ans?.chart ? (
                    <div className="text-muted mt-1">Diagram: {ans.chart.imageUrl ? "uploaded" : ans.chart.file ? "attached (local)" : "missing"}</div>
                  ) : null}
                </div>
              </li>
            );
          })}
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

  if (!essayQuestions.length || timeLeft === null) {
    return <p>Loading essay questions...</p>;
  }

  const q = essayQuestions[currentQuestionIndex];
  const ans = studentEssayAnswers[q.question_id] || {};
  const type = ans.type || (forceChart ? "chart" : "text"); // default

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
          <p>{q.question_text}</p>

          {/* Answer Type selector */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Answer Type</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`type-${q.question_id}`}
                  id={`type-text-${q.question_id}`}
                  checked={type === "text"}
                  onChange={() => setAnswerType(q.question_id, "text")}
                />
                <label className="form-check-label" htmlFor={`type-text-${q.question_id}`}>Text</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`type-${q.question_id}`}
                  id={`type-chart-${q.question_id}`}
                  checked={type === "chart"}
                  onChange={() => setAnswerType(q.question_id, "chart")}
                />
                <label className="form-check-label" htmlFor={`type-chart-${q.question_id}`}>Diagram / Image</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`type-${q.question_id}`}
                  id={`type-both-${q.question_id}`}
                  checked={type === "both"}
                  onChange={() => setAnswerType(q.question_id, "both")}
                />
                <label className="form-check-label" htmlFor={`type-both-${q.question_id}`}>Both</label>
              </div>
            </div>
          </div>

          {/* Text editor (shown when type includes text) */}
          {(type === "text" || type === "both") && (
            <>
              <p className="mb-1"><strong>Grading Note:</strong> {q.grading_note}</p>
              <textarea
                rows={10}
                className="form-control"
                placeholder="Write your answer here..."
                value={ans.text || ""}
                onChange={(e) => setTextAnswer(q.question_id, e.target.value)}
              />
              <div className="mt-2">
                Word Count: {(ans.text || "").trim().split(/\s+/).filter(Boolean).length}
              </div>
            </>
          )}

          {/* Diagram uploader (shown when type includes chart) */}
          {(type === "chart" || type === "both") && (
            <div className="mt-3">
              <ChartUploadSection
                mode="attach" // attach only; AI runs after final submit
                question={{
                  id: q.question_id,
                  question_text: q.question_text,
                  allowed_formats: q.allowed_formats || ["png", "jpg", "jpeg", "svg"],
                  max_file_size_mb: q.max_file_size_mb || 5,
                }}
                userId={userId}
                onAttached={(payload) => setChartAttachment(q.question_id, payload)}
              />
              <small className="text-muted d-block mt-1">
                Diagram will be analyzed after you submit the whole exam.
              </small>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between">
        {currentQuestionIndex > 0 && (
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
          >
            Back
          </button>
        )}
        {currentQuestionIndex < essayQuestions.length - 1 ? (
          <button
            className="btn btn-primary ms-auto"
            onClick={() => setCurrentQuestionIndex(i => Math.min(essayQuestions.length - 1, i + 1))}
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
