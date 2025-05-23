// src/Components/TaskPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";

const TaskPage = () => {
  const { id } = useParams(); // exam_id from URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const fetchExamWithQuestions = async () => {
      console.log("🔎 Route exam ID:", id);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;

      // 🔒 Check if already submitted
      const { data: existingSubmissions } = await supabase
        .from("exam_responses")
        .select("id")
        .eq("exam_id", id)
        .eq("user_id", userId)
        .limit(1);

      if (existingSubmissions?.length > 0) {
        setAlreadySubmitted(true);
        setLoading(false);
        return;
      }

      try {
        const { data: examData, error: examError } = await supabase
          .from("exams")
          .select("*")
          .eq("exam_id", id)
          .single();

        if (examError || !examData) {
          console.error("❌ Exam not found");
          return;
        }

        const { data: questionsData, error: questionsError } = await supabase
          .from("mcq_questions")
          .select("question_id, question_text, options")
          .filter("exam_id", "eq", id);

        if (questionsError || !questionsData || questionsData.length === 0) {
          console.error("❌ Questions not found");
          return;
        }

        const formattedQuestions = questionsData.map((q) => ({
          id: q.question_id,
          question: q.question_text,
          options: Array.isArray(q.options) ? q.options : [],
        }));

        setTask({ exam_id: examData.exam_id, ...examData, questions: formattedQuestions });
        setAnswers(new Array(formattedQuestions.length).fill(null));
      } catch (error) {
        console.error("🔥 Unexpected error:", error);
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

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    const responses = task.questions.map((question, index) => ({
      user_id: userId,
      exam_id: task.exam_id,
      question_id: question.id,
      selected_option: answers[index],
    }));

    const { error } = await supabase.from("exam_responses").insert(responses);

    if (error) {
      console.error("❌ Error saving responses:", error);
      alert("Failed to submit answers. Please try again.");
    } else {
      console.log("✅ Responses submitted successfully");
      alert("Answers submitted!");
      
    }
  };

  if (loading) return <div className="container mt-4">⏳ Loading task...</div>;

  if (alreadySubmitted) {
    return (
      <div className="container mt-4 text-danger">
        ❌ You have already submitted this exam. You cannot retake it.
      </div>
    );
  }

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
        <p>
          <strong>Type:</strong> {task.type || "Exam"}
        </p>

        <hr />

        {reviewMode ? (
          <div>
            <h4 className="mb-3">📝 Review Your Answers</h4>
            <ul className="list-group">
              {task.questions.map((q, idx) => (
                <li key={q.id} className="list-group-item">
                  <strong>Q{idx + 1}: {q.question}</strong>
                  <br />
                  <span className="text-primary">
                    Answer: {answers[idx] || "Not answered"}
                  </span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary" onClick={() => setReviewMode(false)}>
                Go Back
              </button>
              <button className="btn btn-success" onClick={handleSubmit}>
                Confirm Submit
              </button>
            </div>
          </div>
        ) : (
          <>
            <h5>
              Question {questionIndex + 1} of {task.questions.length}
            </h5>
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
              <button
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={questionIndex === 0}
              >
                Back
              </button>

              {questionIndex === task.questions.length - 1 ? (
                <button className="btn btn-warning" onClick={() => setReviewMode(true)}>
                  Review Answers
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
