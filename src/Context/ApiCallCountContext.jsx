// src/context/ApiCallCountContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const ApiCallCountContext = createContext();

export const ApiCallCountProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  // Helper to get today's date string (yyyy-mm-dd)
  const getToday = () => new Date().toISOString().slice(0, 10);

  // Initialize count and date from localStorage or reset if new day
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

  
};
