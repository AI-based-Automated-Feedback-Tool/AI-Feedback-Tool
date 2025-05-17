import React from 'react';
import { supabase } from '../SupabaseAuth/supabaseClient';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
    const navigate = useNavigate()

    //to handle logout
  const handleLogout = async () => {
    //ask for confirm to logout
    const confirmLogout = window.confirm("Do you want to log out?");
    //exit if user cancel
    if (!confirmLogout) return;

    try {
        //to sign out user using supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        //err if logout fails
        console.error('Error logging out:', error.message);
      } else {
        //log msg if success
        console.log('Logged out successfully');
        navigate("/login")
      }
    } catch (err) {
        //handle unexpected err
      console.error('Unexpected error during logout:', err);
    }
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
    Log Out
  </button>
  );
};

export default LogOut;