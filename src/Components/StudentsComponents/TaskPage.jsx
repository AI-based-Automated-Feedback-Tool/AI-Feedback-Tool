import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔧 Replace this mock with Supabase fetch later
  useEffect(() => {
    const dummyTasks = [
      { id: "exam01", title: "Week 01 Exam", type: "exam", dueDate: "2025-06-01" },
      { id: "assignment01", title: "JavaScript Assignment", type: "assignment", dueDate: "2025-06-03" },
      { id: "quiz01", title: "HTML/CSS Quiz", type: "quiz", dueDate: "2025-06-05" }
    ];
    const found = dummyTasks.find((t) => t.id === id);
    setTask(found || null);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="container mt-4">Loading task...</div>;
  if (!task) return <div className="container mt-4 text-danger">❌ Task not found.</div>;

  return (
    <div className="container py-4">
      <div className="bg-light p-4 shadow rounded">
        <h2 className="text-primary mb-3">📝 {task.title}</h2>
        <p><strong>Type:</strong> {task.type}</p>
        <p><strong>Due Date:</strong> {task.dueDate}</p>
        <hr />
        <p>This is where task content (questions, editor, options) will be rendered.</p>
        <button className="btn btn-success mt-3">Submit</button>
      </div>
    </div>
  );
};

export default TaskPage;
