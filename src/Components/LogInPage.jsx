import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";
import { UserContext } from "../Context/userContext";

const LogInPage = () => {
  const navigate = useNavigate();
  //state to store email and pw
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //destructure value from context
  const { setUserId, fetchUserData } = useContext(UserContext);

  const handleSignUpClick = () => {
    navigate("/register");
  };

  //handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      // Sign in user
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      //const userId = session?.user?.id;
      const userId = signInData?.session?.user?.id;

      if (!userId) {
        setError("User session not found.");
        return;
      }
      //set the userId in the context
      setUserId(userId);

      console.log("User ID from signInData:", signInData?.session?.user?.id);

      //fetch user role from your users table
      const userData = await fetchUserData(userId);
      if (!userData) {
        setError("Could not retrieve user data.");
        return;
      }
      sessionStorage.setItem("userId", userId);

      //redirect based on role
      if (userData.role === "teacher") {
        navigate("/teacher", { state: { userName: userData.name } });
      } else if (userData.role === "student") {
        navigate(`/student/courses/${userId}`, {
          state: { userName: userData.name },
        });
      } else {
        //fallback if role is unknown
        navigate("/");
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
