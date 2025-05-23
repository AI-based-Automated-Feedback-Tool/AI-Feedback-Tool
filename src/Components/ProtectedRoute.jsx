// Import necessary hooks and components from React and React Router
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
// Import the Supabase client for authentication and database operations
import { supabase } from "../SupabaseAuth/supabaseClient";

const ProtectedRoute = ({ allowedRoles }) => {
  //to store the current user session
  const [session, setSession] = useState(null);
  //to track whether the component is loading data
  const [loading, setLoading] = useState(true);
  //to store the role of the current user
  const [userRole, setUserRole] = useState(null);
  //to control the visibility of the error message
  const [showError, setShowError] = useState(false);
  //to get the current location object from React Router
  const location = useLocation();
  const navigate = useNavigate();

  //to handle session checking and role fetching
  useEffect(() => {
    //to check the current session and fetch user role
    const checkSession = async () => {
      //get the current session from Supabase
      const { data } = await supabase.auth.getSession();
      //update the session state
      setSession(data.session);

      if (data.session) {
        //if a session exists, get the user id
        const userId = data.session.user.id;

        //fetch the user's role from the db
        const { data: userData, error } = await supabase
          .from("users")
          .select("role")
          .eq("user_id", userId)
          .single();

        //if no error and user data exists, update the userRole state
        if (!error && userData) {
          setUserRole(userData.role);
        }
      }

      //oading to false after session and role checks are complete
      setLoading(false);
    };

    //call the checkSession function
    checkSession();

    //set up a listener for auth state change
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session); //update the session state when it change
    });

    //cleanup function to unsubscribe from the listener when the component unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  //if the component is still loading, display a loading message
  if (loading) return <div>Loading...</div>;

  //if no session exists, redirect the user to the login page
  if (!session) {
    return <Navigate to="/logIn" replace />;
  }

  //if the user's role is not allowed, handle err mesg and redirection
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    //if the error message is not already shown, show it and set a timeout to hide it
    if (!showError) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    }

    //conditionally render the error message or redirect to the home page
    return showError ? (
      <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <p className="text-danger">
          You do not have permission to access this page.
        </p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Main Page
        </button>
      </div>
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    );
  }

  // If the user is authorized, render the child components using Outlet
  return <Outlet />;
};

// Export the ProtectedRoute component as the default export
export default ProtectedRoute;
