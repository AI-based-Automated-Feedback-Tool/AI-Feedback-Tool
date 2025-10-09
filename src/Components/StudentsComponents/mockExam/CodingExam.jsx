import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../SupabaseAuth/supabaseClient";

const API_BASE = "http://localhost:3000/api/mock-exam";

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

  const [questions, setQuestions] = useState([]); // [{ id, type: "coding", question, language? }]
  const [answers, setAnswers] = useState({});     // { [qid]: code string }
  const [submitted, setSubmitted] = useState(false);

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
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: selectedCourse?.title || selectedCourseId,
          questionType: "coding",
        }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to generate coding questions");
      const data = await res.json();

      const qs = (Array.isArray(data.questions) ? data.questions : [])
        .filter(q => q && (q.type === "coding" || !q.type))
        .slice(0, 5)
        .map((q, idx) => ({
          id: q.id ?? `code-${idx}`,
          type: "coding",
          question: q.question ?? String(q),
          language: q.language ?? "javascript",
          starter: q.starter ?? "", // optional starter code
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

    // OPTIONAL: Save to Supabase (uncomment after adding exam_type column)
    // try {
    //   const payload = {
    //     user_id: uid,
    //     course_id: selectedCourse?.id || selectedCourseId,
    //     course_title: selectedCourse?.title || "Unknown Course",
    //     total_questions: questions.length,
    //     correct: null,
    //     incorrect: null,
    //     unanswered: questions.filter(q => !answers[q.id])?.length ?? 0,
    //     percentage: null,
    //     duration_minutes: null,
    //     answers,            // code strings
    //     exam_type: "coding" // <<< add this column to table if you want
    //   };
    //   const { error: insertError } = await supabase.from("mock_exam_results").insert([payload]);
    //   if (insertError) console.error("Error saving coding attempt:", insertError.message);
    // } catch (e) {
    //   console.error("Unexpected error saving coding attempt:", e);
    // }
  }

  return (
    <div className="container py-3">
      <button className="btn btn-outline-secondary mb-3" onClick={goBack}>
        ← Back to Exam Menu
      </button>

      <h2 className="mb-3">Coding Exam</h2>
      <p className="text-muted">
        Generate coding tasks for the selected course. Students write code solutions.
      </p>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Course selector + actions */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Your registered courses</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || courses.length === 0 || submitted}
          >
            <option value="">{loadingCourses ? "Loading..." : "-- Select a course --"}</option>
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
            {loadingGenerate ? "Generating…" : "Generate Coding Questions"}
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
            ? "No registered courses found for your account."
            : "Pick a course and click Generate Coding Questions."}
        </div>
      )}
    </div>
  );
}
