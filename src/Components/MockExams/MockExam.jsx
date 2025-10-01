import React, { useState } from "react";

export default function MockExam() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const courses = ["JavaScript Basics", "Advanced Mathematics"]; // placeholder

  return (
    <div className="container py-3">
      <h1 className="mb-3">Mock Exam</h1>
      <p className="text-muted">Select a course to start a 25-question AI-generated mock exam.</p>

      <div className="d-flex gap-2 align-items-center">
        <select
          className="form-select"
          style={{ maxWidth: 320 }}
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={() => {
            if (!selectedCourse) return alert("Please select a course first!");
            alert(`Starting mock exam for: ${selectedCourse}`);
          }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}
