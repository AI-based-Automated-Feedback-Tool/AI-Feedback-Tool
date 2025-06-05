// Import necessary modules from React and Supabase client
import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../SupabaseAuth/supabaseClient";

// Create a context for user-related data and actions
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  //to store the current user's ID
  const [userId, setUserId] = useState(() => {
    // Initialize userId from localStorage if available
    return localStorage.getItem("userId") || null;
  });
  //o store the current user data
  const [userData, setUserData] = useState(null);

  //to fetch user data from the database based on user id
  const fetchUserData = async (id) => {
    try {
      //o get the user's role and name
      const { data, error } = await supabase
        .from("users")
        .select("role, name")
        //filter by user ID
        .eq("user_id", id)
        //expect a single result
        .single();

      //handle errors
      if (error) {
        console.error("Error fetching user data:", error.message);
        return null;
      }

      //update the userData state with the fetched data
      setUserData(data);
      return data;
    } catch (err) {
      //handle unexpected errors
      console.error("Unexpected error fetching user data:", err);
      return null;
    }
  };

   //effect to persist userId in localStorage whenever it changes
   useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  //provide the user-related state and actions to child components
  return (
    <UserContext.Provider
      value={{ userId, setUserId, userData, fetchUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};
