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
        <h1 className="display-4">🚀 AI-Based Automated Feedback Tool</h1>
        <p className="lead">
          Empowering users with intelligent, personalized coding feedback.
        </p>
      </header>

      <main>
        <div className="row justify-content-center">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body text-center">
                <h2 className="card-title text-primary">🔑 Get Started</h2>
                <p className="card-text">
                  Access all features, including coding assignments, real-time
                  AI feedback, and more.
                </p>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={handleAccess}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <p className="text-muted text-center mt-4">
        ✅ Initial setup complete. Project ready to build.
      </p>

      <footer className="text-center mt-5">
        <p>Project 39 • React + Vite • Summer 2025</p>
      </footer>
    </div>
  );
};

export default MainPage;
