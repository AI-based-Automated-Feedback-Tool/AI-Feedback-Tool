import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const LogInPage = () => {
  const navigate = useNavigate();
  //state to store email and pw
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUpClick = () => {
    navigate("/register");
  };

  //handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    //clear previous errors
    setError("");
    try {
      //signin user with provided email
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        //set msg if err occur during login
        setError(error.message);
      } else {
        //redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleBackToMainPageClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="text-center mt-3">
        <button
          className="btn btn-secondary btn-lg"
          onClick={handleBackToMainPageClick}
        >
          Back to Main Page
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow" style={{ width: "24rem" }}>
          <h2 className="card-title text-center mb-4">Log In</h2>
          <form onSubmit={handleLogin}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-success w-100">
              Log In
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogInPage;
