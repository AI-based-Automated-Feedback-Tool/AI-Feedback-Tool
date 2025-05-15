import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseAuth/supabaseClient";

const ProtectedRoute = ({ children }) => {
  //to store current user session
  const [session, setSession] = useState(null);
  //to track loading status
  const [loading, setLoading] = useState(true);
  //to navigate
  const navigate = useNavigate();

  useEffect(() => {
    //fun to check the current seesion
    const checkSession = async () => {
      //fetch current session
      const { data } = await supabase.auth.getSession();
      //update session state
      setSession(data.session);
      //set load false once session fetched
      setLoading(false);

      if (!data.session) {
        //redirect if no session
        navigate("/logIn");
      }
    };
    //call session check function
    checkSession();

    //listen authentication state
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      //update session state on auth state change
      setSession(session);
      if (!session) {
        //redirect on logout
        navigate("/logIn");
      }
    });

    //cleanup the listener when component unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  //while session is fetched
  if (loading) {
    return <div>Loading...</div>;
  }
  //render children if session exists
  return session ? children : null;
};

export default ProtectedRoute;
