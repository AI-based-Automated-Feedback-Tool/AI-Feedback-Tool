import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignmentCard from "./AssignmentCard";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");

  const assignments = [
    {
      title: "Week 01 Exam",
      timeRemaining: "55:30 Remaining",
    },
    {
      title: "Coding Assignment",
      timeRemaining: "2:15:00 Remaining",
    },
    {
      title: "Quiz: JavaScript",
      due: "Due: August 25",
    },
  ];

  const handleStart = (title) => {
    console.log("Start clicked for:", title);
    // Example: navigate(`/exam/${id}`) in the future
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <>
            <h5 className="mb-3">Upcoming Tasks</h5>
            <div className="row">
              {assignments.map((a, i) => (
                <div className="col-md-4 mb-4" key={i}>
                  <AssignmentCard
                    title={a.title}
                    timeRemaining={a.timeRemaining}
                    due={a.due}
                    onStart={() => handleStart(a.title)}
                  />
                </div>
              ))}
            </div>
          </>
        );
      case "feedback":
        return <h5 className="text-muted">🧠 Feedback page (coming soon)</h5>;
      case "exams":
        return <h5 className="text-muted">📚 Past exams will appear here</h5>;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-light p-4 shadow" style={{ width: "250px" }}>
        <h5 className="mb-4">📘 Menu</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button className="nav-link btn text-start" onClick={() => setCurrentView("dashboard")}>
              Dashboard
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="nav-link btn text-start" onClick={() => setCurrentView("feedback")}>
              Feedback
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="nav-link btn text-start" onClick={() => setCurrentView("exams")}>
              Past Exams
            </button>
          </li>
        </ul>
        <button className="btn btn-outline-danger mt-5 w-100" onClick={() => navigate("/")}>
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-white">
        {/* Top blue bar */}
        <div className="bg-primary text-white p-3 rounded-top mb-4 d-flex align-items-center">
          <h5 className="mb-0">Student Dashboard</h5>
        </div>

        {/* Dynamic view content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;
