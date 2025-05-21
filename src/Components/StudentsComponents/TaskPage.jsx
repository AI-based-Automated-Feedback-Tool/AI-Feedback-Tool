// src/Components/TaskPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";

const TaskPage = () => {
  const { id } = useParams(); // exam_id from route
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchExamWithQuestions = async () => {
      try {
        // 1. Fetch the exam
        const { data: examData, error: examError } = await supabase
          .from("exams")
          .select("*")
          .eq("exam_id", id)
          .single();

        if (examError || !examData) {
          console.error("Error fetching exam:", examError);
          setTask(null);
          return;
        }

        // 2. Fetch related MCQ questions
        const { data: questionsData, error: questionsError } = await supabase
          .from("mcq_questions")
          .select("*")
          .eq("exam_id", id);

        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
        }

        const formattedQuestions = (questionsData || []).map((q) => ({
          id: q.id,
          question: q.question_text,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
        }));

        // 3. Set task and answers
        setTask({ ...examData, questions: formattedQuestions });
        setAnswers(new Array(formattedQuestions.length).fill(null));
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamWithQuestions();
  }, [id]);

  const handleAnswerSelect = (index, answer) => {
    const updated = [...answers];
    updated[index] = answer;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (questionIndex < task.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    alert("Submitted! 🎉");
    // TODO: Store results in Supabase or navigate to feedback
  };

  if (loading) return <div className="container mt-4">Loading task...</div>;
  if (!task || !task.questions || task.questions.length === 0)
    return (
      <div className="container mt-4 text-danger">
        ❌ Task or questions not found.
      </div>
    );

  const currentQuestion = task.questions[questionIndex];

  return (
    <div className="container py-4">
      <div className="bg-light p-4 shadow rounded">
        <h2 className="text-primary mb-3">{task.title}</h2>
        <p><strong>Type:</strong> {task.type || "Exam"}</p>

        <hr />
        <h5>Question {questionIndex + 1} of {task.questions.length}</h5>
        <p>{currentQuestion.question}</p>

        {currentQuestion.options.map((opt, idx) => (
          <div key={idx} className="form-check">
            <input
              type="radio"
              id={`q${questionIndex}_${idx}`}
              className="form-check-input"
              name={`q${questionIndex}`}
              value={opt}
              checked={answers[questionIndex] === opt}
              onChange={() => handleAnswerSelect(questionIndex, opt)}
            />
            <label className="form-check-label" htmlFor={`q${questionIndex}_${idx}`}>
              {opt}
            </label>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-secondary" onClick={handleBack} disabled={questionIndex === 0}>
            Back
          </button>

          {questionIndex === task.questions.length - 1 ? (
            <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
