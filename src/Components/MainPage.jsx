import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const studentPageBtn = () => {
    navigate("/logIn");
  };

  const teacherPageBtn = () => {
    navigate("/logIn");
  };

  const skipToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4">🚀 AI-Based Automated Feedback Tool</h1>
        <p className="lead">
          Empowering students and teachers with intelligent, personalized coding feedback.
        </p>
      </header>

      <main>
        <div className="row">
          {/* Card for Students */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-primary">👩‍💻 For Students</h2>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">✔️ Weekly coding assignments and exams</li>
                  <li className="list-group-item">✔️ Real-time AI feedback</li>
                  <li className="list-group-item">✔️ Encouragement and solution suggestions</li>
                </ul>
                <button className="btn btn-primary mt-3 w-100" onClick={studentPageBtn}>
                  Explore Student Features
                </button>
              </div>
            </div>
          </div>

          {/* Card for Instructors */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-success">🧑‍🏫 For Instructors</h2>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">📊 Performance dashboards</li>
                  <li className="list-group-item">🛠️ Task configuration with AI assistance</li>
                  <li className="list-group-item">📁 Exportable student reports</li>
                </ul>
                <button className="btn btn-success mt-3 w-100" onClick={teacherPageBtn}>
                  Explore Instructor Features
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Development-only Skip Button */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-secondary" onClick={skipToDashboard}>
            🚧 Skip Login – Go to Student Dashboard
          </button>
        </div>

        <p className="text-muted text-center mt-4">✅ Initial setup complete. Project ready to build.</p>
      </main>

      <footer className="text-center mt-5">
        <p>Project 39 • React + Vite • Summer 2025</p>
      </footer>
    </div>
  );
};

export default MainPage;
