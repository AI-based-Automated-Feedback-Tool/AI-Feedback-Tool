
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../SupabaseAuth/supabaseClient";


// If your backend runs elsewhere, change this:
const API_BASE = "http://localhost:3000/api/mock-exam";

export default function MockExam() {
  const [uid, setUid] = useState("");                 // Supabase auth user.id (UUID)
  const [courses, setCourses] = useState([]);         // [{ id, title }]
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const selectedCourse = useMemo(
    () => courses.find(c => String(c.id) === String(selectedCourseId)),
    [courses, selectedCourseId]
  );

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");

  const [questions, setQuestions] = useState([]);     // [{id, question, options:[], answer}]
  const [answers, setAnswers] = useState({});         // { [questionId]: "Option A" }

  // 1) Get auth user + fetch their registered courses from backend
  useEffect(() => {
    let alive = true;

    async function init() {
      try {
        setError("");
        setLoadingCourses(true);

        // Get Supabase auth user
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const userId = userData?.user?.id;
        if (!userId) throw new Error("Not authenticated");

        if (alive) setUid(userId);

        // Fetch courses for this student from backend
        const res = await fetch(`${API_BASE}/courses/${userId}`);
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Failed to fetch courses");
        }
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

  // 2) Generate MCQs via backend for the selected course
  async function handleGenerate() {
    if (!selectedCourseId) {
      alert("Please select a course first");
      return;
    }
    setLoadingGenerate(true);
    setQuestions([]);
    setAnswers({});
    setError("");

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: selectedCourse?.title || selectedCourseId,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to generate mock exam");
      }

      const data = await res.json();
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions returned from AI");
      }

      setQuestions(data.questions.slice(0, 25)); // ensure max 25
    } catch (e) {
      setError(e?.message || "Error generating questions");
    } finally {
      setLoadingGenerate(false);
    }
  }

  // 3) Track answers locally
  function onSelectAnswer(qid, option) {
    setAnswers(prev => ({ ...prev, [qid]: option }));
  }

  // 4) (Optional) Submit handler placeholder
  function handleSubmit() {
    if (questions.length === 0) return;
    // In the next phase, you can:
    // - send { uid, selectedCourseId, answers } to backend
    // - store submission in Supabase
    // - call AI for feedback
    const answered = Object.keys(answers).length;
    alert(`Submitted! You answered ${answered}/${questions.length} questions.`);
  }

  return (
    <div className="container py-3">
      <h2 className="mb-3">Mock Exam (AI-Generated MCQs)</h2>
      <p className="text-muted">
        Select a registered course and generate a 25-question mock exam.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Course selector */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Your registered courses</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || courses.length === 0}
          >
            <option value="">
              {loadingCourses ? "Loading..." : "-- Select a course --"}
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-auto">
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loadingCourses || !selectedCourseId || loadingGenerate}
          >
            {loadingGenerate ? "Generating…" : "Generate Mock Exam"}
          </button>
        </div>
      </div>

      {/* Questions */}
      {questions.length > 0 && (
        <div className="card shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="me-2">
              Course: {selectedCourse?.title || "Selected course"}
            </strong>
            <span className="badge bg-secondary">
              {Object.keys(answers).length}/{questions.length} answered
            </span>
          </div>

          <hr />

          {questions.map((q, idx) => (
            <div key={q.id ?? idx} className="mb-4">
              <div className="fw-semibold mb-2">
                {idx + 1}. {q.question}
              </div>
              <div className="ms-2">
                {(q.options || []).map((opt, i) => {
                  // radio group name per question id
                  const name = `q-${q.id ?? idx}`;
                  const checked = answers[q.id ?? idx] === opt;
                  return (
                    <div className="form-check" key={i}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name={name}
                        id={`${name}-${i}`}
                        value={opt}
                        checked={!!checked}
                        onChange={() => onSelectAnswer(q.id ?? idx, opt)}
                      />
                      <label className="form-check-label" htmlFor={`${name}-${i}`}>
                        {opt}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setQuestions([]);
                setAnswers({});
              }}
            >
              Clear
            </button>
            <button className="btn btn-success ms-auto" onClick={handleSubmit}>
              Submit Answers
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loadingCourses && !loadingGenerate && questions.length === 0 && (
        <div className="text-muted">
          {courses.length === 0
            ? "No registered courses found for your account."
            : "Pick a course and click Generate Mock Exam."}
        </div>
      )}
    </div>
  );
}
