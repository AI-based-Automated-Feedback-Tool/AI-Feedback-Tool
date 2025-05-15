import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-light p-4 shadow" style={{ width: "250px" }}>
        <h5 className="mb-4">📘 Menu</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a className="nav-link" href="#">Dashboard</a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link" href="#">Feedback</a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link" href="#">Past Exams</a>
          </li>
        </ul>
        <button className="btn btn-outline-danger mt-5 w-100" onClick={() => navigate("/")}>
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-white">
        {/* Top bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Welcome, Student’s Name</h3>
          <button className="btn btn-outline-secondary d-md-none">☰</button>
        </div>

        <h5 className="mb-3">Available Assignments</h5>

        <div className="row">
          {assignments.map((a, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{a.title}</h5>
                  {a.timeRemaining && (
                    <p className="card-text text-muted">⏰ {a.timeRemaining}</p>
                  )}
                  {a.due && (
                    <p className="card-text text-muted">📅 {a.due}</p>
                  )}
                  <button className="btn btn-primary mt-auto">Start</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
