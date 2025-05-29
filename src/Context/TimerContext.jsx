import React, { createContext, useContext, useState, useEffect } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ task, alreadySubmitted, loading, handleSubmit, navigate, children }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  //initialize the timer when the task data is loaded
  useEffect(() => {
    if (task && task.duration) {
        //convert duration from minutes to seconds
      setTimeLeft(task.duration * 60); 
    }
  }, [task]);

  //countdown timer logic to decrement time every second
  useEffect(() => {
    if (timeLeft === null || alreadySubmitted || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
             //stop the timer when time runs out
          clearInterval(timer);
           //auto-submit the task
          handleSubmit(navigate);
          return 0;
        }
        //decrement the remaining time
        return prev - 1; 
      });
    }, 1000);

    //cleanup the timer when the component unmounts or dependencies change
    return () => clearInterval(timer);
  }, [timeLeft, alreadySubmitted, loading, handleSubmit, navigate]);

  //helper function to format time in MM:SS format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <TimerContext.Provider value={{ timeLeft, formatTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);