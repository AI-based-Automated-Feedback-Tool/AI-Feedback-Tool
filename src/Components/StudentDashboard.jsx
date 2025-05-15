const StudentDashboard = () => {
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
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 bg-white">
        <h2>🎓 Welcome to Your Student Dashboard</h2>
        <p>This is the starting layout. Assignment content will go here.</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
