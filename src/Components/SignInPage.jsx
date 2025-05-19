import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  //states to store user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate(); 
  //to submit signup
  const handleSignUp = async (e) => {
    e.preventDefault();

    //trim input values to remove extra spaces
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    try {
      //validate email
      if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
        alert("Please enter a valid email address.");
        return;
      }

      //ensure all required fields are filled
      if (!trimmedName || !role) {
        alert("All fields are required. Please fill out the form completely.");
        return;
      }

      //validate password length and special character
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; //regex to check for special characters
      if (
        trimmedPassword.length < 6 ||
        !specialCharRegex.test(trimmedPassword)
      ) {
        alert(
          "Password must be at least 6 characters long and contain at least one special character."
        );
        return;
      }

      //attempt to sign up the user using Supabase auth
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      //handle err during signUp
      if (error) {
        console.error("Error signing up:", error.message);
        alert("Error: " + error.message);
        return;
      }

      //retrieve the current session to get the user id
      const {
        data: { session },
      } = await supabase.auth.getSession();

      //extract userid from session
      const userId = session?.user?.id;

      //if userid is not found, prompt the user to verify their email
      if (!userId) {
        alert("Sign-up successful! Please verify your email and log in.");
        return;
      }

      //insert user detail to users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          user_id: userId,
          name: trimmedName,
          email: trimmedEmail,
          role,
        },
      ]);

      //handle err during the database insertion
      if (insertError) {
        console.error("Error saving user info:", insertError.message);
        alert("Error saving user info: " + insertError.message);
      } else {
        console.log("User info saved successfully.");
        alert("Sign-up complete!");
        navigate("/logIn");
      }
    } catch (err) {
      //catch any unexpected err
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <div className="card-header text-center">
          <h2>Sign In</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
