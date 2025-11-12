import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/pages/MainPage.css";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const handleAccess = () => {
    navigate("/logIn");
  };

  return (
    <div className="container py-5 landing-page">
      <div className="landing-grid" aria-hidden="true"></div>

      <div className="landing-hero">
        <div className="landing-left">
          <h1 className="landing-title">AI-Based Automated Feedback Tool</h1>
          <p className="landing-subtitle">
            Empowering teachers and students with intelligent, real-time, and personalized feedback for coding
            and objective exams.
          </p>

          <div className="features">
            <div className="feature-item">
              <i className="fas fa-robot fa-lg"></i>
              <div>
                <strong>Smart Feedback</strong>
                <div style={{fontSize:'0.95rem', color:'rgba(0,0,0,0.65)'}}>AI-generated, actionable feedback for student submissions</div>
              </div>
            </div>

            <div className="feature-item">
              <i className="fas fa-clock fa-lg"></i>
              <div>
                <strong>Timed Exams</strong>
                <div style={{fontSize:'0.95rem', color:'rgba(0,0,0,0.65)'}}>Create and manage secure timed exams with focus tracking</div>
              </div>
            </div>

            <div className="feature-item">
              <i className="fas fa-code fa-lg"></i>
              <div>
                <strong>Code Evaluation</strong>
                <div style={{fontSize:'0.95rem', color:'rgba(0,0,0,0.65)'}}>Automated code analysis and suggestions for programming tasks</div>
              </div>
            </div>

            <div className="feature-item">
              <i className="fas fa-chart-line fa-lg"></i>
              <div>
                <strong>Performance Insights</strong>
                <div style={{fontSize:'0.95rem', color:'rgba(0,0,0,0.65)'}}>Analytics to help teachers spot strengths and gaps</div>
              </div>
            </div>
          </div>

          {/* Primary CTA is shown in the right panel; remove duplicate left CTA */}
        </div>

        <div className="landing-right">
          <div className="glass-panel card shadow-sm">
            <div className="hero-card-body">
              <h4>🔑 Get Started</h4>
              <p>Access smart AI feedback, manage exams, track student progress, and experience automated evaluation with ease.</p>
              <button className="cta-btn w-100" onClick={handleAccess}>Get Started</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-small">Project 39 • React + Vite • Summer 2025</div>
    </div>
  );
};

export default MainPage;
