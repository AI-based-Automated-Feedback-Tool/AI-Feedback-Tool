import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const Profile = () => {
  //to store user details
  const [userDetails, setUserDetails] = useState(null);
  //to track loading
  const [loading, setLoading] = useState(true);
  //to track errors
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
          //get the current session
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }
        //extract user ID from the session
        const userId = session?.user?.id;
        if (!userId) {
          throw new Error("User is not logged in.");
        }

        //fetch user details from the users table using the userId from the session
        const { data: userData, error } = await supabase
          .from("users")
          .select("name, email, role")
          //ensure userId is passed correctly
          .eq("user_id", userId)
          .single();

        if (error) {
          throw error;
        }
        //set the user details in state
        setUserDetails(userData);
      } catch (err) {
        console.error("Error fetching user details:", err.message);
        //set error message
        setError(err.message);
      } finally {
        //set loading to false
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ); //show loading spinner
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    ); //show err msg
  }

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg mx-auto"
        style={{
          maxWidth: "500px",
          borderRadius: "15px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: "#007bff", borderRadius: "15px 15px 0 0" }}
        >
          <h4 className="mb-0">User Profile</h4>
        </div>
        <div className="card-body text-center">
          {/*icon*/}
          <i
            className="fas fa-user mb-3"
            style={{ fontSize: "40px", color: "#007bff" }}
          ></i>
          <h5 className="card-title mb-3">{userDetails?.name || "N/A"}</h5>
          <p className="card-text text-muted">
            <strong>Email:</strong> {userDetails?.email || "N/A"}
          </p>
          <p className="card-text text-muted">
            <strong>Role:</strong> {userDetails?.role || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
