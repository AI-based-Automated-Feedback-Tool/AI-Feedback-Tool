import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../SupabaseAuth/supabaseClient";
import { MOCK_BASE as API_BASE } from "@/config/api";

/** ----- Helpers ----- */
const normalize = (t = "") => String(t).toLowerCase().replace(/\s+/g, " ").trim();
const formatTime = (totalSeconds) => {
  const s = Math.max(0, totalSeconds | 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
};

// Lightweight local grader (keywords / accepted answers / exact)
function gradeEssayAnswer(userAnswer, key) {
  const u = normalize(userAnswer);

  if (Array.isArray(key?.keywords) && key.keywords.length > 0) {
    const kws = key.keywords.map(normalize);
    const hits = kws.filter((kw) => u.includes(kw)).length;
    const score = hits / kws.length;
    return { correct: score >= 0.6, score, mode: "keywords" };
  }
  if (Array.isArray(key?.answers) && key.answers.length > 0) {
    const set = new Set(key.answers.map(normalize));
    const ok = set.has(u);
    return { correct: ok, score: ok ? 1 : 0, mode: "answers" };
  }
  if (typeof key?.answer === "string" && key.answer) {
    const ok = normalize(key.answer) === u;
    return { correct: ok, score: ok ? 1 : 0, mode: "answer" };
  }
  return { correct: false, score: 0, mode: "none" };
}

/** ----- Filter out coding subjects for essays ----- */
const DISALLOWED_COURSE_KEYWORDS = [
  "code","coding","programming","program","algorithm","data structure","ds & a",
  "software engineering","devops","frontend","backend","web dev","mobile dev",
  "react","node","java","c++","python","golang","typescript","database","sql",
];

export default function EssayExam({ goBack }) {
  const [uid, setUid] = useState("");
  const [courses, setCourses] = useState([]); // [{id,title}]
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.id) === String(selectedCourseId)),
    [courses, selectedCourseId]
  );

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");

  // Questions & answers
  const [questions, setQuestions] = useState([]);  // [{id,question,answer|answers[]|keywords[]}]
  const [answers, setAnswers] = useState({});      // { [qid]: string }

  // Results
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({
    total: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0,
    perQuestion: {}, // { [qid]: { correct, score, mode, key } }
  });

  // Timer UI
  const [presetMinutes, setPresetMinutes] = useState("60");
  const [customMinutes, setCustomMinutes] = useState(60);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const intervalRef = useRef(null);

  // Last 5 attempts
  const [recentResults, setRecentResults] = useState([]);

  // AI grading feedback
  const [aiGrading, setAiGrading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState({}); // { [qid]: { score, verdict, feedback, ideal_answer, matched_keywords } }

  /** ------ Init: auth + essay-eligible courses ------ */
  useEffect(() => {
    let alive = true;
    async function init() {
      try {
        setError(""); setLoadingCourses(true);

        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const userId = userData?.user?.id;
        if (!userId) throw new Error("Not authenticated");
        if (alive) setUid(userId);

        // Optional JWT for your backend (if it checks Authorization)
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

        // Prefer essay-eligible endpoint, fallback to generic
        let res = await fetch(`${API_BASE}/essays/eligible-courses/${userId}`, { headers });
        if (!res.ok) res = await fetch(`${API_BASE}/courses/${userId}`, { headers });
        if (!res.ok) throw new Error((await res.text()) || "Failed to fetch courses");
        const payload = await res.json();

        const filtered = (payload.courses || []).filter((c) => {
          const title = normalize(c.title || c.name || "");
          return !DISALLOWED_COURSE_KEYWORDS.some((kw) => title.includes(kw));
        });

        if (alive) setCourses(filtered);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load courses");
      } finally {
        if (alive) setLoadingCourses(false);
      }
    }
    init();
    return () => { alive = false; };
  }, []);

  /** ------ Load last 5 attempts ------ */
  useEffect(() => {
    async function loadResults() {
      if (!uid) return;
      const { data, error } = await supabase
        .from("mock_exam_results")
        .select("*")
        .eq("user_id", uid)
        .eq("exam_type", "essay")
        .order("submitted_at", { ascending: false })
        .limit(5);
      if (!error && Array.isArray(data)) setRecentResults(data);
    }
    loadResults();
  }, [uid]);

  /** ------ Timer loop ------ */
  useEffect(() => {
    if (!timerActive || submitted || questions.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimerActive(false);
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
  }, [timerActive, submitted, questions.length]);

  function getSelectedMinutes() {
    if (presetMinutes === "custom") {
      const v = Number(customMinutes) || 0;
      return Math.max(1, Math.min(300, v));
    }
    return Number(presetMinutes);
  }

  /** ------ Generate exactly 5 essay questions ------ */
  async function handleGenerate() {
    if (!selectedCourseId) {
      alert("Please select a course first");
      return;
    }
    setLoadingGenerate(true);
    setQuestions([]); setAnswers({}); setAiFeedback({});
    setSubmitted(false);
    setResults({ total: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0, perQuestion: {} });
    setError("");

    const mins = getSelectedMinutes();
    setRemainingSeconds(mins * 60);
    setTimerActive(false);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          courseId: selectedCourse?.id || selectedCourseId,
          courseTitle: selectedCourse?.title || selectedCourseId,
          questionType: "essay",
          count: 5,
          includeAnswers: true,
        }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to generate essay");
      const data = await res.json();

      const qs = (Array.isArray(data.questions) ? data.questions : [])
        .filter((q) => q && (q.type === "essay" || !q.type))
        .slice(0, 5)
        .map((q, idx) => ({
          id: q.id ?? `essay-${idx}`,
          type: "essay",
          question: q.question ?? String(q.prompt ?? q.q ?? q),
          answer: q.answer,
          answers: q.answers,
          keywords: q.keywords,
        }));

      if (qs.length !== 5) throw new Error("Need 5 essay questions; received " + qs.length);

      setQuestions(qs);
      setTimerActive(true);
    } catch (e) {
      setError(e?.message || "Error generating essay questions");
    } finally {
      setLoadingGenerate(false);
    }
  }

  function onChangeAnswer(qid, value) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function pickKey(q) {
    return {
      answer: q.answer,
      answers: Array.isArray(q.answers) ? q.answers : undefined,
      keywords: Array.isArray(q.keywords) ? q.keywords : undefined,
    };
  }

  /** ------ Submit + local grade + save attempt + AI feedback ------ */
  async function handleSubmit(auto = false) {
    if (questions.length === 0 || submitted) return;

    const total = questions.length;
    let correct = 0, incorrect = 0, unanswered = 0;
    const perQuestion = {};

    questions.forEach((q) => {
      const qid = q.id;
      const userAns = answers[qid] ?? "";
      if (normalize(userAns) === "") {
        unanswered += 1;
        perQuestion[qid] = { correct: false, score: 0, mode: "none", key: pickKey(q) };
        return;
      }
      const g = gradeEssayAnswer(userAns, pickKey(q));
      if (g.correct) correct++; else incorrect++;
      perQuestion[qid] = { ...g, key: pickKey(q) };
    });

    const percent = total ? Math.round((correct / total) * 100) : 0;

    setResults({ total, correct, incorrect, unanswered, percent, perQuestion });
    setSubmitted(true);
    setTimerActive(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

    if (auto) alert("⏰ Time is up! Your answers have been auto-submitted.");

    // 1) Save attempt to Supabase, returning the inserted row id
    let attemptId = null;
    try {
      const payload = {
        user_id: uid,
        course_id: selectedCourse?.id || selectedCourseId,
        course_title: selectedCourse?.title || "Unknown Course",
        total_questions: total,
        correct,
        incorrect,
        unanswered,
        percentage: percent,
        duration_minutes: getSelectedMinutes(),
        answers,                   // { qid: text }
        exam_type: "essay",        // filter later
      };

      const { data: inserted, error: insertError } = await supabase
        .from("mock_exam_results")
        .insert([payload])
        .select("id")
        .single();

      if (insertError) {
        console.error("Error saving results:", insertError.message);
      } else {
        attemptId = inserted?.id || null;
        // refresh last 5
        const { data, error } = await supabase
          .from("mock_exam_results")
          .select("*")
          .eq("user_id", uid)
          .eq("exam_type", "essay")
          .order("submitted_at", { ascending: false })
          .limit(5);
        if (!error && Array.isArray(data)) setRecentResults(data);
      }
    } catch (e) {
      console.error("Unexpected error saving to Supabase:", e);
    }

    // 2) Ask backend for descriptive AI feedback and show it (and persist on that attempt)
    try {
      setAiGrading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

      const resp = await fetch(`${API_BASE}/essays/grade`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          courseTitle: selectedCourse?.title || selectedCourseId,
          questions: questions.map(q => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            answers: q.answers,
            keywords: q.keywords
          })),
          answers, // { [qid]: string }
        }),
      });

      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "AI grading failed");

      let json;
      try { json = JSON.parse(text); } catch { json = {}; }
      const map = {};
      (json.graded || []).forEach(item => {
        map[item.id] = {
          score: item.score,
          verdict: item.verdict,
          feedback: item.feedback,
          ideal_answer: item.ideal_answer,
          matched_keywords: item.matched_keywords
        };
      });
      setAiFeedback(map);

      // persist feedback to that attempt row if we have its id
      if (attemptId) {
        const { error: upErr } = await supabase
          .from("mock_exam_results")
          .update({ ai_feedback: map })
          .eq("id", attemptId);
        if (upErr) console.warn("Saving ai_feedback failed:", upErr.message);
      }
    } catch (e) {
      console.error("AI grading error:", e);
      // keep UI silent (local grading already shown), or show a small note if you want
    } finally {
      setAiGrading(false);
    }
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setResults({ total: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0, perQuestion: {} });
    setAiFeedback({});
    const mins = getSelectedMinutes();
    setRemainingSeconds(mins * 60);
    setTimerActive(false);
  }

  const totalAnswered = Object.keys(answers).filter((k) => normalize(answers[k]) !== "").length;
  const minsChosen = getSelectedMinutes();
  const warn = remainingSeconds <= 5 * 60 && timerActive && !submitted;

  return (
    <div className="container py-3">
      <button className="btn btn-outline-secondary mb-3" onClick={goBack}>
        ← Back to Exam Menu
      </button>

      <h2 className="mb-3">Mock Exam (Essay)</h2>
      <p className="text-muted">
        Choose an essay-eligible course (no coding subjects), set a time limit, and generate a 5-question essay exam.
      </p>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Course & Timer controls */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label">Your registered essay courses</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || courses.length === 0 || submitted || timerActive}
          >
            <option value="">{loadingCourses ? "Loading..." : "-- Select a course --"}</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title || c.name}</option>
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
            {loadingGenerate ? "Generating…" : "Generate Essay Exam"}
          </button>
        </div>
      </div>

      {/* Timer & progress */}
      {questions.length > 0 && (
        <div className={`alert ${submitted ? "alert-success" : warn ? "alert-warning" : "alert-info"} d-flex flex-wrap gap-3`} role="status">
          <div><strong>Time:</strong> {formatTime(remainingSeconds)} {!submitted && timerActive && <span className="text-muted">(of {minsChosen} min)</span>}</div>
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
            <span className={`badge ${submitted ? "bg-success" : "bg-secondary"}`}>{totalAnswered}/{questions.length} answered</span>
          </div>
          <hr />

          {questions.map((q, idx) => {
            const qid = q.id;
            const res = results.perQuestion[qid];
            const isCorrect = submitted ? res?.correct : null;
            const key = { answer: q.answer, answers: q.answers, keywords: q.keywords };

            const border =
              submitted && isCorrect === true ? "border border-success rounded p-2" :
              submitted && isCorrect === false ? "border border-danger rounded p-2" : "";

            return (
              <div key={qid} className={`mb-4 ${border}`}>
                <div className="fw-semibold mb-2">{idx + 1}. {q.question}</div>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Write your answer here…"
                  value={answers[qid] || ""}
                  onChange={(e) => onChangeAnswer(qid, e.target.value)}
                  disabled={submitted}
                />

                {submitted && (
                  <div className="mt-2">
                    {isCorrect ? (
                      <span className="badge bg-success">✅ Correct</span>
                    ) : (
                      <>
                        <span className="badge bg-danger">❌ Incorrect</span>
                        <div className="small text-muted mt-1">
                          <em>Accepted/Correct:</em>{" "}
                          {Array.isArray(key.answers) ? key.answers.join(", ")
                            : key.answer ? key.answer
                            : Array.isArray(key.keywords) ? `(keywords) ${key.keywords.join(", ")}`
                            : "—"}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* AI descriptive feedback */}
                {submitted && aiFeedback[qid] && (
                  <div className="mt-2 p-2 rounded" style={{ background: "#f8f9fa" }}>
                    <div className="small text-muted">
                      <strong>AI feedback:</strong>
                      <div className="mt-1">{aiFeedback[qid].feedback}</div>
                      {aiFeedback[qid].ideal_answer && (
                        <div className="mt-1">
                          <em>Ideal answer:</em> {aiFeedback[qid].ideal_answer}
                        </div>
                      )}
                      {Array.isArray(aiFeedback[qid].matched_keywords) && aiFeedback[qid].matched_keywords.length > 0 && (
                        <div className="mt-1">
                          <em>Matched keywords:</em> {aiFeedback[qid].matched_keywords.join(", ")}
                        </div>
                      )}
                      {typeof aiFeedback[qid].score === "number" && (
                        <div className="mt-1">
                          <em>AI score:</em> {(aiFeedback[qid].score * 100).toFixed(0)}%
                          {aiFeedback[qid].verdict ? ` · ${aiFeedback[qid].verdict}` : ""}
                        </div>
                      )}
                    </div>
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
                    setQuestions([]); setAnswers({}); setAiFeedback({});
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
                <button className="btn btn-outline-primary" onClick={handleReset}>
                  Reset (Try Again)
                </button>
                <button className="btn btn-primary ms-auto" onClick={handleGenerate} disabled={loadingGenerate}>
                  {loadingGenerate ? "Generating…" : "Regenerate New Exam"}
                </button>
              </>
            )}
          </div>

          {submitted && aiGrading && (
            <div className="alert alert-secondary mt-3" role="status">
              Generating detailed feedback…
            </div>
          )}
        </div>
      )}

      {/* Recent attempts */}
      {recentResults?.length > 0 && (
        <div className="card mt-4 p-3">
          <h5 className="mb-3">Recent Attempts</h5>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.submitted_at || r.created_at || r.inserted_at || Date.now()).toLocaleString()}</td>
                    <td>{r.course_title || r.course_id}</td>
                    <td>{r.correct}/{r.total_questions} ({r.percentage}%)</td>
                    <td>{r.duration_minutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <small className="text-muted">Only the last 5 attempts are shown.</small>
        </div>
      )}

      {/* Empty state */}
      {!loadingCourses && !loadingGenerate && questions.length === 0 && (
        <div className="text-muted">
          {courses.length === 0
            ? "No essay-eligible courses found for your account."
            : "Pick a course, choose time, and click Generate Essay Exam."}
        </div>
      )}
    </div>
  );
}
