import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../SupabaseAuth/supabaseClient";

const ProtectedRoute = () => {
  //to store current user session
  const [session, setSession] = useState(null);
  //to track loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //fun to check the current seesion
    const checkSession = async () => {
      //fetch current session
      const { data } = await supabase.auth.getSession();
      //update session state
      setSession(data.session);
      //set load false once session fetched
      setLoading(false);
    }

    //call session check function
    checkSession();

    //listen authentication state
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      //update session state on auth state change
      setSession(session);
    });

    //cleanup the listener when component unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

   //if no session, redirect to login
   if (!session) {
    //use replace to replace current history entry
    return <Navigate to="/logIn" replace />;
  }
    //render child routes
    return <Outlet />;
};

export default ProtectedRoute;
