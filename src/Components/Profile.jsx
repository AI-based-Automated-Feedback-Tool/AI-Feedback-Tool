import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

const Profile = () => {
  //to store user details
  const [userDetails, setUserDetails] = useState(null);
  //to track loading
  const [loading, setLoading] = useState(true);
  //to track errors
  const [error, setError] = useState(null);
  //to toggle edit mode
  const [isEditing, setIsEditing] = useState(false);
  //form data for editing
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        //get current session
        const {
          data: { session },
          error: sessionError,
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
          .select("user_id, name, email, role")
          //ensure userId is passed correctly
          .eq("user_id", userId)
          .single();

        if (error) {
          throw error;
        }
        //set the user details in state
        setUserDetails(userData);
        setFormData({ name: userData.name, email: userData.email });
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      //create an update object with only the changed fields
      const updates = {};
      if (formData.name !== userDetails.name) updates.name = formData.name;
      if (formData.email !== userDetails.email) updates.email = formData.email;

      // Only proceed if there are changes to update
      if (Object.keys(updates).length === 0) {
        setIsEditing(false);
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("user_id", userDetails.user_id);

      if (error) {
        throw error;
      }

      //update the local state with the new values
      setUserDetails({ ...userDetails, ...updates });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating user details:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <i
            className="fas fa-user mb-3"
            style={{ fontSize: "40px", color: "#007bff" }}
          ></i>
          {isEditing ? (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Email"
                />
              </div>
              <button
                className="btn btn-success me-2"
                onClick={handleSave}
                disabled={loading}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h5 className="card-title mb-3">{userDetails?.name || "N/A"}</h5>
              <p className="card-text text-muted">
                <strong>Email:</strong> {userDetails?.email || "N/A"}
              </p>
              <p className="card-text text-muted">
                <strong>Role:</strong> {userDetails?.role || "N/A"}
              </p>
              <button
                className="btn btn-primary"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
