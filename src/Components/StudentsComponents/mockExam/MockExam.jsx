import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../SupabaseAuth/supabaseClient";

// If your backend runs elsewhere, change this:
const API_BASE = "http://localhost:3000/api/mock-exam";

const LETTERS = ["A","B","C","D","E","F","G","H"];

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
function stripPunct(s) {
  return norm(s).replace(/[^a-z0-9 ]/g, "");
}

// Map many answer formats to a **correct option index**
function computeCorrectIndex(options = [], rawAnswer = "") {
  const optsNorm = options.map((o) => stripPunct(o));
  const ans = stripPunct(rawAnswer);

  // 1) Exact text match
  let idx = optsNorm.findIndex((o) => o === ans);
  if (idx !== -1) return idx;

  // 2) Answer text contains option text
  idx = optsNorm.findIndex((o) => ans.includes(o));
  if (idx !== -1) return idx;

  // 3) Single letter A/B/C/D…
  const mLetterSolo = ans.match(/^\s*([a-h])\b/i);
  if (mLetterSolo) {
    const j = mLetterSolo[1].toUpperCase().charCodeAt(0) - 65;
    if (j >= 0 && j < options.length) return j;
  }

  // 4) Formats like "A)", "answer: C"
  const mLetterAny = ans.match(/\b(?:answer|option)?\s*([a-h])\b/i);
  if (mLetterAny) {
    const j = mLetterAny[1].toUpperCase().charCodeAt(0) - 65;
    if (j >= 0 && j < options.length) return j;
  }

  // 5) Numeric 1/2/3 → index 0/1/2
  const mNum = ans.match(/\b([1-9])\b/);
  if (mNum) {
    const j = parseInt(mNum[1], 10) - 1;
    if (j >= 0 && j < options.length) return j;
  }

  return -1;
}

function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds | 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${String(h)}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function MockExam() {
  const [uid, setUid] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.id) === String(selectedCourseId)),
    [courses, selectedCourseId]
  );

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");

  // Questions & answers
  const [questions, setQuestions] = useState([]);   // [{id, question, options:[], answer, correctIndex}]
  const [answers, setAnswers] = useState({});       // { [qid]: number }

  // Results
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({
    total: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0,
    perQuestion: {}, // { [qid]: { isCorrect, selectedIndex, correctIndex } }
  });

  // === Timer state ===
  const [presetMinutes, setPresetMinutes] = useState("60"); // "45" | "60" | "120" | "custom"
  const [customMinutes, setCustomMinutes] = useState(60);   // used when presetMinutes === "custom"
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const intervalRef = useRef(null);

  // Get user & courses
  useEffect(() => {
    let alive = true;
    async function init() {
      try {
        setError("");
        setLoadingCourses(true);

        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const userId = userData?.user?.id;
        if (!userId) throw new Error("Not authenticated");
        if (alive) setUid(userId);

        const res = await fetch(`${API_BASE}/courses/${userId}`);
        if (!res.ok) throw new Error((await res.text()) || "Failed to fetch courses");
        const payload = await res.json();
        if (alive) setCourses(payload.courses || []);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load courses");
      } finally {
        if (alive) setLoadingCourses(false);
      }
    }
    init();
    return () => { alive = false; };
  }, []);

  // Timer tick
  useEffect(() => {
    if (!timerActive || submitted || questions.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimerActive(false);
          // Auto-submit when time is up
          setTimeout(() => handleSubmit(true), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, submitted, questions.length]);

  function getSelectedMinutes() {
    if (presetMinutes === "custom") {
      const val = Number(customMinutes) || 0;
      return Math.max(1, Math.min(300, val)); // clamp 1..300 mins
    }
    return Number(presetMinutes);
  }

  async function handleGenerate() {
    if (!selectedCourseId) {
      alert("Please select a course first");
      return;
    }
    setLoadingGenerate(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setResults({
      total: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0, perQuestion: {},
    });
    setError("");

    // Prepare timer
    const mins = getSelectedMinutes();
    setRemainingSeconds(mins * 60);
    setTimerActive(false); // will activate after questions load

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: selectedCourse?.title || selectedCourseId,
        }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to generate mock exam");
      const data = await res.json();

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions returned from AI");
      }

      const qs = data.questions.slice(0, 25).map((q, idx) => {
        const id = q.id ?? `q-${idx}`;
        const options = Array.isArray(q.options) ? q.options : [];
        const answer = q.answer ?? "";
        const correctIndex = computeCorrectIndex(options, answer);
        return { ...q, id, options, answer, correctIndex };
      });

      setQuestions(qs);
      // Start countdown once questions are ready
      setTimerActive(true);
    } catch (e) {
      setError(e?.message || "Error generating questions");
    } finally {
      setLoadingGenerate(false);
    }
  }

  function onSelectAnswer(qid, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: optionIndex }));
  }

  function handleSubmit(auto = false) {
    if (questions.length === 0 || submitted) return;

    const total = questions.length;
    let correct = 0, incorrect = 0, unanswered = 0;
    const perQuestion = {};

    questions.forEach((q) => {
      const qid = q.id;
      const selectedIndex = answers[qid];
      const correctIndex = q.correctIndex ?? computeCorrectIndex(q.options, q.answer);

      if (selectedIndex === undefined) {
        unanswered += 1;
        perQuestion[qid] = { isCorrect: false, selectedIndex: undefined, correctIndex };
        return;
      }

      const isCorrect = selectedIndex === correctIndex;
      isCorrect ? correct++ : incorrect++;
      perQuestion[qid] = { isCorrect, selectedIndex, correctIndex };
    });

    const percent = total ? Math.round((correct / total) * 100) : 0;

    setResults({ total, correct, incorrect, unanswered, percent, perQuestion });
    setSubmitted(true);
    setTimerActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (auto) {
      // Optional: toast/alert when auto-submitted
      // eslint-disable-next-line no-alert
      alert("⏰ Time is up! Your answers have been auto-submitted.");
    }

    // OPTIONAL: Persist submission to backend/Supabase here
    // fetch(`${API_BASE}/submit`, {...})
  }

  function handleResetAnswers() {
    setAnswers({});
    setSubmitted(false);
    setResults({
      total: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0, perQuestion: {},
    });
    // Reset timer to the chosen minutes (but not started until Regenerate)
    const mins = getSelectedMinutes();
    setRemainingSeconds(mins * 60);
    setTimerActive(false);
  }

  const totalAnswered = Object.keys(answers).length;
  const minsChosen = getSelectedMinutes();
  const warn = remainingSeconds <= 5 * 60 && timerActive && !submitted; // < 5 min

  return (
    <div className="container py-3">
      <h2 className="mb-3">Mock Exam (AI-Generated MCQs)</h2>
      <p className="text-muted">
        Select a registered course, choose a time limit, and generate a 25-question mock exam.
      </p>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Course & Timer controls */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label">Your registered courses</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || courses.length === 0 || submitted || timerActive}
          >
            <option value="">{loadingCourses ? "Loading..." : "-- Select a course --"}</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label">Time limit</label>
          <select
            className="form-select"
            value={presetMinutes}
            onChange={(e) => setPresetMinutes(e.target.value)}
            disabled={timerActive || submitted}
          >
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="custom">Custom…</option>
          </select>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label">Custom (mins)</label>
          <input
            type="number"
            min={1}
            max={300}
            className="form-control"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            disabled={presetMinutes !== "custom" || timerActive || submitted}
          />
        </div>

        <div className="col-12 col-md-auto">
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loadingCourses || !selectedCourseId || loadingGenerate || submitted || timerActive}
          >
            {loadingGenerate ? "Generating…" : "Generate Mock Exam"}
          </button>
        </div>
      </div>

      {/* Timer & progress */}
      {(questions.length > 0) && (
        <div className={`alert ${submitted ? "alert-success" : warn ? "alert-warning" : "alert-info"} d-flex flex-wrap gap-3`} role="status">
          <div>
            <strong>Time:</strong>{" "}
            {formatTime(remainingSeconds)}{" "}
            {!submitted && timerActive && <span className="text-muted">(of {minsChosen} min)</span>}
          </div>
          <div><strong>Score:</strong> {submitted ? `${results.correct} / ${results.total} (${results.percent}%)` : "—"}</div>
          <div><strong>Answered:</strong> {totalAnswered}/{questions.length}</div>
          {!submitted && (
            <div className="ms-auto">
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleSubmit(false)}>
                Submit Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <div className="card shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="me-2">Course: {selectedCourse?.title || "Selected course"}</strong>
            <span className={`badge ${submitted ? "bg-success" : "bg-secondary"}`}>
              {totalAnswered}/{questions.length} answered
            </span>
          </div>

          <hr />

          {questions.map((q, idx) => {
            const qid = q.id;
            const selectedIndex = answers[qid];
            const res = results.perQuestion[qid];
            const correctIndex = q.correctIndex ?? computeCorrectIndex(q.options, q.answer);
            const isCorrect = submitted ? res?.isCorrect : null;

            const border =
              submitted && isCorrect === true
                ? "border border-success rounded p-2"
                : submitted && isCorrect === false
                ? "border border-danger rounded p-2"
                : "";

            return (
              <div key={qid} className={`mb-4 ${border}`}>
                <div className="fw-semibold mb-2">
                  {idx + 1}. {q.question}
                </div>

                <div className="ms-2">
                  {(q.options || []).map((opt, i) => {
                    const name = `q-${qid}`;
                    const checked = selectedIndex === i;
                    const letter = LETTERS[i] ?? String(i + 1);
                    return (
                      <div className="form-check" key={i}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={name}
                          id={`${name}-${i}`}
                          value={i}
                          checked={!!checked}
                          disabled={submitted}
                          onChange={() => onSelectAnswer(qid, i)}
                        />
                        <label className="form-check-label" htmlFor={`${name}-${i}`}>
                          <strong>{letter})</strong> {opt}
                        </label>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback after submit */}
                {submitted && (
                  <div className="mt-2">
                    {isCorrect ? (
                      <span className="badge bg-success">✅ Correct</span>
                    ) : (
                      <div className="d-flex flex-column gap-1">
                        <span className="badge bg-danger">❌ Incorrect</span>
                        <small className="text-muted">
                          Your answer:{" "}
                          {selectedIndex === undefined
                            ? <em>Not answered</em>
                            : <strong>{LETTERS[selectedIndex]}) {q.options[selectedIndex]}</strong>}
                        </small>
                        <small className="text-muted">
                          Correct answer:{" "}
                          {correctIndex >= 0
                            ? <strong>{LETTERS[correctIndex]}) {q.options[correctIndex]}</strong>
                            : <strong>{q.answer ?? "—"}</strong>}
                        </small>
                        {correctIndex === -1 && (
                          <small className="text-warning">
                            ⚠️ Couldn’t map the provided answer to options; showing raw answer text.
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="d-flex gap-2">
            {!submitted ? (
              <>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setQuestions([]);
                    setAnswers({});
                    setSubmitted(false);
                    setResults({ total: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0, perQuestion: {} });
                    setTimerActive(false);
                    const mins = getSelectedMinutes();
                    setRemainingSeconds(mins * 60);
                  }}
                >
                  Clear
                </button>
                <button className="btn btn-success ms-auto" onClick={() => handleSubmit(false)}>
                  Submit Answers
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-primary" onClick={handleResetAnswers}>
                  Reset (Try Again)
                </button>
                <button
                  className="btn btn-primary ms-auto"
                  onClick={handleGenerate}
                  disabled={loadingGenerate}
                >
                  {loadingGenerate ? "Generating…" : "Regenerate New Exam"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loadingCourses && !loadingGenerate && questions.length === 0 && (
        <div className="text-muted">
          {courses.length === 0
            ? "No registered courses found for your account."
            : "Pick a course, choose time, and click Generate Mock Exam."}
        </div>
      )}
    </div>
  );
}
