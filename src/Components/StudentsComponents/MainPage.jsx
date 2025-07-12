import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const handleAccess = () => {
    navigate("/logIn");
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">
          🚀 AI-Based Automated Feedback Tool
        </h1>
        <p className="lead mt-3">
          Empowering teachers and students with intelligent, real-time, and personalized feedback 
          for coding and objective exams.
        </p>
      </header>

      <main>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h2 className="h4 text-secondary mb-3">🔑 Get Started</h2>
                <p className="text-muted">
                  Access smart AI feedback, manage exams, track student progress,
                  and experience automated evaluation with ease.
                </p>
                <button
                  className="btn btn-primary btn-lg mt-3 w-100"
                  onClick={handleAccess}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center mt-5 text-muted small">
        <p>Project 39 • React + Vite • Summer 2025</p>
      </footer>
    </div>
  );
};

export default MainPage;
