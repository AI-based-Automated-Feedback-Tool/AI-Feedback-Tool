import React, { useState } from "react";
import McqExam from "./McqExam";
import EssayExam from "./EssayExam";
import CodingExam from "./CodingExam";

export default function MockExam() {
  const [examType, setExamType] = useState(""); // "mcq" | "essay" | "coding"

  const goBack = () => setExamType("");

  if (examType === "mcq") return <McqExam goBack={goBack} />;
  if (examType === "essay") return <EssayExam goBack={goBack} />;
  if (examType === "coding") return <CodingExam goBack={goBack} />;

  return (
    <div className="container text-center py-5">
      <h2 className="mb-4">Choose Mock Exam Type</h2>
      <p className="text-muted mb-5">
        Select the type of exam you want to take. Each mode generates AI-based questions for your chosen course.
      </p>

      <div className="d-flex flex-column gap-3 align-items-center">
        <button
          className="btn btn-primary btn-lg w-50"
          onClick={() => setExamType("mcq")}
        >
          🟩 MCQ Exam
        </button>

        <button
          className="btn btn-warning btn-lg w-50"
          onClick={() => setExamType("essay")}
        >
          🟨 Essay Exam
        </button>

        <button
          className="btn btn-info btn-lg w-50"
          onClick={() => setExamType("coding")}
        >
          🟦 Coding Exam
        </button>
      </div>
    </div>
  );
}
