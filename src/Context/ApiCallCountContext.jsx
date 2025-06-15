// src/context/ApiCallCountContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const ApiCallCountContext = createContext();

export const ApiCallCountProvider = ({ children }) => {
  const MAX_CALLS_PER_DAY = 10;
  const [count, setCount] = useState(0);

  // Helper to get today's date string (yyyy-mm-dd)
  const getToday = () => new Date().toISOString().slice(0, 10);

  // Initialize count and date from localStorage or reset if it's a new day
  useEffect(() => {
    const storedDate = localStorage.getItem('apiCallCountDate');
    const storedCount = parseInt(localStorage.getItem('apiCallCount') || '0', 10);
    const today = getToday();

    if (storedDate === today) {
      setCount(storedCount);
    } else {
      localStorage.setItem('apiCallCountDate', today);
      localStorage.setItem('apiCallCount', '0');
      setCount(0);
    }
  }, []);

  // Function to increment count and update localStorage
  const incrementCount = () => {
    setCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('apiCallCount', newCount.toString());
      localStorage.setItem('apiCallCountDate', getToday());
      return newCount;
    });
  };

  return (
    <ApiCallCountContext.Provider value={{ count, incrementCount, MAX_CALLS_PER_DAY }}>
      {children}
    </ApiCallCountContext.Provider>
  );
};
