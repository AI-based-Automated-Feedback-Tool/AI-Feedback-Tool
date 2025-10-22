import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../SupabaseAuth/supabaseClient";

const API_BASE = "http://localhost:3000/api/mock-exam";

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

  const [questions, setQuestions] = useState([]); // [{ id, type:"coding", question, language, starter, tests? }]
  const [answers, setAnswers] = useState({});     // { [qid]: code string }
  const [submitted, setSubmitted] = useState(false);

  // Load user + courses (filter to coding courses)
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
        const all = payload.courses || [];
        const onlyCoding = all.filter(c => isCodingCourse(c.title || ""));
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

  // Generate 10 coding questions for the selected course
  async function handleGenerate() {
    if (!selectedCourseId) {
      alert("Please select a course first");
      return;
    }
    setLoadingGenerate(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setError("");

    try {
      const lang = inferLanguageFromTitle(selectedCourse?.title || "");
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: selectedCourse?.title || selectedCourseId,
          questionType: "coding",
          language: lang, // hint to backend/AI
          count: 10       // ask for 10 coding questions
        }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to generate coding questions");
      const data = await res.json();

      const qs = (Array.isArray(data.questions) ? data.questions : [])
        .filter(q => q && (q.type === "coding" || !q.type))
        .slice(0, 10)
        .map((q, idx) => ({
          id: q.id ?? `code-${idx}`,
          type: "coding",
          question: q.question ?? String(q),
          language: q.language ?? lang,
          starter: q.starter ?? "",
          tests: q.tests ?? q.test_cases ?? []
        }));

      if (qs.length === 0) throw new Error("No coding questions returned from AI");

      setQuestions(qs);
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

  async function handleSubmit() {
    if (questions.length === 0 || submitted) return;
    setSubmitted(true);

    // (Optional) save attempt to Supabase — enable if table has exam_type/grading
    // try {
    //   const payload = {
    //     user_id: uid,
    //     course_id: selectedCourse?.id || selectedCourseId,
    //     course_title: selectedCourse?.title || "Unknown Course",
    //     total_questions: questions.length,
    //     correct: null, // will be set after AI grading if you add it later
    //     incorrect: null,
    //     unanswered: questions.filter(q => !answers[q.id])?.length ?? 0,
    //     percentage: null,
    //     duration_minutes: null,
    //     answers,
    //     exam_type: "coding"
    //   };
    //   const { error: insertError } = await supabase.from("mock_exam_results").insert([payload]);
    //   if (insertError) console.error("Error saving results:", insertError.message);
    // } catch (e) {
    //   console.error("Unexpected error saving:", e);
    // }
  }

  return (
    <div className="container py-3">
      <button className="btn btn-outline-secondary mb-3" onClick={goBack}>
        ← Back to Exam Menu
      </button>

      <h2 className="mb-3">Coding Exam</h2>
      <p className="text-muted">
        Pick a coding-related course, generate 10 coding tasks, and write your solutions.
      </p>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Course selector + actions */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Your registered coding courses</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || courses.length === 0 || submitted}
          >
            <option value="">
              {loadingCourses ? "Loading..." : "-- Select a coding course --"}
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-auto">
          <button
            className="btn btn-info"
            onClick={handleGenerate}
            disabled={loadingCourses || !selectedCourseId || loadingGenerate || submitted}
          >
            {loadingGenerate ? "Generating…" : "Generate 10 Coding Questions"}
          </button>
        </div>
      </div>

      {/* Questions */}
      {questions.length > 0 && (
        <div className="card shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="me-2">Course: {selectedCourse?.title || "Selected course"}</strong>
            <span className="badge bg-secondary">
              {Object.keys(answers).length}/{questions.length} answered
            </span>
          </div>
          <hr />

          {questions.map((q, idx) => (
            <div key={q.id} className="mb-4">
              <div className="fw-semibold mb-2">
                {idx + 1}. {q.question}
                {q.language && (
                  <span className="badge bg-light text-dark ms-2">{q.language}</span>
                )}
              </div>

              {q.starter && (
                <pre className="bg-light p-2 rounded small mb-2" style={{ whiteSpace: "pre-wrap" }}>
{q.starter}
                </pre>
              )}

              <textarea
                className="form-control font-monospace"
                rows={8}
                placeholder={`Write your ${q.language || "code"} here…`}
                value={answers[q.id] || ""}
                onChange={(e) => onChangeCode(q.id, e.target.value)}
                disabled={submitted}
              />
            </div>
          ))}

          <div className="d-flex gap-2">
            {!submitted ? (
              <>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => { setQuestions([]); setAnswers({}); }}
                >
                  Clear
                </button>
                <button className="btn btn-success ms-auto" onClick={handleSubmit}>
                  Submit Answers
                </button>
              </>
            ) : (
              <button className="btn btn-outline-primary" onClick={() => setSubmitted(false)}>
                Reset (Edit Again)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loadingCourses && !loadingGenerate && questions.length === 0 && (
        <div className="text-muted">
          {courses.length === 0
            ? "No coding-related courses found in your registrations."
            : "Pick a coding course and click Generate 10 Coding Questions."}
        </div>
      )}
    </div>
  );
}
