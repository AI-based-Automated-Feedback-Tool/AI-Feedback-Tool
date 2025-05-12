import { useNavigate } from "react-router-dom";

const LogInPage = () => {
    const navigate = useNavigate()
    
    const handleSignUpClick = () => {
        navigate('/register')
    }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '24rem' }}>
        <h2 className="card-title text-center mb-4">Log In</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Log In
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <button
            type="button"
            className="btn btn-link p-0"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LogInPage;