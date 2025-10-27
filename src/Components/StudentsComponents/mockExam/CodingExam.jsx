import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../SupabaseAuth/supabaseClient";
import { MOCK_BASE as API_BASE } from "@/config/api";

// --- Helpers: detect coding courses & infer language ---
const CODING_KEYWORDS = [
  "javascript","typescript","python","java","c#","c++","golang","go","rust",
  "php","ruby","kotlin","swift","sql","bash","shell","powershell",
  "html","css","sass","react","node","express","django","spring",
  "flutter","dart","angular","vue",".net","mongodb","postgres","mysql"
];

function isCodingCourse(title = "") {
  const t = (title || "").toLowerCase();
  return CODING_KEYWORDS.some(k => t.includes(k.toLowerCase()));
}

function inferLanguageFromTitle(title = "") {
  const t = (title || "").toLowerCase();
  if (t.includes("typescript")) return "typescript";
  if (t.includes("python") || t.includes("django")) return "python";
  if (t.includes("java") && !t.includes("javascript")) return "java";
  if (t.includes("c#") || t.includes(".net")) return "csharp";
  if (t.includes("c++")) return "cpp";
  if (t.includes("golang") || t.includes(" go ")) return "go";
  if (t.includes("rust")) return "rust";
  if (t.includes("php")) return "php";
  if (t.includes("kotlin")) return "kotlin";
  if (t.includes("swift")) return "swift";
  if (t.includes("sql") || t.includes("postgres") || t.includes("mysql")) return "sql";
  if (t.includes("bash") || t.includes("shell")) return "bash";
  if (t.includes("dart") || t.includes("flutter")) return "dart";
  if (t.includes("css") || t.includes("html")) return "html";
  return "javascript";
}

const formatTime = (totalSeconds) => {
  const s = Math.max(0, totalSeconds | 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
};

export default function CodingExam({ goBack }) {
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

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState({});
  const [aiGrading, setAiGrading] = useState(false);
  const [results, setResults] = useState({ total: 0, correct: 0, incorrect: 0, percent: 0 });

  // Timer
  const [presetMinutes, setPresetMinutes] = useState("60");
  const [customMinutes, setCustomMinutes] = useState(60);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const intervalRef = useRef(null);

  // Fetch user + courses
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
        const onlyCoding = (payload.courses || []).filter(c => isCodingCourse(c.title || ""));
        if (alive) setCourses(onlyCoding);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load courses");
      } finally {
        if (alive) setLoadingCourses(false);
      }
    }
    init();
    return () => { alive = false; };
  }, []);

  // Timer logic
  useEffect(() => {
    if (!timerActive || submitted) return;
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
    return () => clearInterval(intervalRef.current);
  }, [timerActive, submitted]);

  const getSelectedMinutes = () => {
    if (presetMinutes === "custom") {
      const v = Number(customMinutes) || 0;
      return Math.max(1, Math.min(300, v));
    }
    return Number(presetMinutes);
  };

  // Generate questions
  async function handleGenerate() {
    if (!selectedCourseId) {
      alert("Please select a course first");
      return;
    }
    setLoadingGenerate(true);
    setQuestions([]); setAnswers({});
    setSubmitted(false); setAiFeedback({});
    setResults({ total: 0, correct: 0, incorrect: 0, percent: 0 });
    const mins = getSelectedMinutes();
    setRemainingSeconds(mins * 60);
    setTimerActive(false);

    try {
      const lang = inferLanguageFromTitle(selectedCourse?.title || "");
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: selectedCourse?.title || selectedCourseId,
          questionType: "code",
          language: lang,
          count: 10
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const qs = (data.questions || []).slice(0, 10);
      setQuestions(qs);
      setTimerActive(true);
    } catch (e) {
      setError(e?.message || "Error generating coding questions");
    } finally {
      setLoadingGenerate(false);
    }
  }

  function onChangeCode(qid, value) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }

  // Submit and AI grade
  async function handleSubmit(auto = false) {
    if (questions.length === 0 || submitted) return;

    const total = questions.length;
    const answered = Object.keys(answers).length;
    const unanswered = total - answered;
    setSubmitted(true);
    setTimerActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (auto) alert("⏰ Time is up! Auto-submitting your answers.");

    try {
      setAiGrading(true);
      const resp = await fetch(`${API_BASE}/code/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          answers,
        }),
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text);
      const json = JSON.parse(text);

      const map = {};
      let correct = 0;
      (json.graded || []).forEach(item => {
        map[item.id] = item;
        if (item.score >= 0.6) correct++;
      });
      setAiFeedback(map);
      const percent = total ? Math.round((correct / total) * 100) : 0;
      setResults({ total, correct, incorrect: total - correct - unanswered, percent });

      // Save to Supabase
      await supabase.from("mock_exam_results").insert([{
        user_id: uid,
        course_id: selectedCourse?.id || selectedCourseId,
        course_title: selectedCourse?.title || "Unknown Course",
        total_questions: total,
        correct,
        incorrect: total - correct - unanswered,
        unanswered,
        percentage: percent,
        answers,
        exam_type: "code",
      }]);
    } catch (e) {
      console.error("AI grading error:", e);
    } finally {
      setAiGrading(false);
    }
  }

  return (
    <div className="container py-3">
      <button className="btn btn-outline-secondary mb-3" onClick={goBack}>← Back to Exam Menu</button>

      <h2>Coding Mock Exam</h2>
      <p className="text-muted">Write your solutions, auto-submit after timer ends, and get AI feedback!</p>

      {/* Course & Timer */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-4">
          <label className="form-label">Your Coding Courses</label>
          <select className="form-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || submitted}>
            <option value="">{loadingCourses ? "Loading..." : "-- Select a course --"}</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Time limit</label>
          <select className="form-select"
            value={presetMinutes}
            onChange={(e) => setPresetMinutes(e.target.value)}
            disabled={timerActive || submitted}>
            <option value="45">45 min</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Custom (mins)</label>
          <input type="number" className="form-control" min={1} max={300}
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            disabled={presetMinutes !== "custom" || timerActive || submitted}/>
        </div>

        <div className="col-md-auto">
          <button className="btn btn-info"
            onClick={handleGenerate}
            disabled={!selectedCourseId || loadingGenerate || submitted}>
            {loadingGenerate ? "Generating…" : "Generate Code Exam"}
          </button>
        </div>
      </div>

      {/* Timer + Progress */}
      {questions.length > 0 && (
        <div className="alert alert-info d-flex justify-content-between">
          <div><strong>Time:</strong> {formatTime(remainingSeconds)}</div>
          <div><strong>Answered:</strong> {Object.keys(answers).length}/{questions.length}</div>
          {submitted ? (
            <div><strong>Score:</strong> {results.percent}%</div>
          ) : (
            <button className="btn btn-sm btn-danger" onClick={() => handleSubmit(false)}>Submit</button>
          )}
        </div>
      )}

      {/* Questions */}
      {questions.map((q, i) => {
        const fb = aiFeedback[q.id];
        return (
          <div key={q.id} className="card mb-3 p-3">
            <div className="fw-semibold">{i + 1}. {q.question}</div>
            <textarea className="form-control font-monospace mt-2"
              rows={8}
              placeholder={`Write ${q.language || "code"} here...`}
              value={answers[q.id] || ""}
              onChange={(e) => onChangeCode(q.id, e.target.value)}
              disabled={submitted}/>
            {submitted && fb && (
              <div className="mt-2 small text-muted">
                <strong>AI Verdict:</strong> {fb.verdict || "—"}<br/>
                <strong>Score:</strong> {(fb.score * 100).toFixed(0)}%<br/>
                {fb.feedback && <div><em>Feedback:</em> {fb.feedback}</div>}
                {fb.ideal_answer && <div><em>Ideal:</em> {fb.ideal_answer}</div>}
              </div>
            )}
          </div>
        );
      })}

      {aiGrading && <div className="alert alert-secondary">AI grading in progress…</div>}
    </div>
  );
}
