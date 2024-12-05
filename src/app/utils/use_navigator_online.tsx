"use client";

import { useState, useEffect } from "react";

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { 
    
    // Initialize online status
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      setMessage("You Are Online.");
    } else {
      setMessage("You are offline. Data saved to localStorage.");
    }
  }, []);

  const handleOnline = () => {
    setMessage("You Are Online. Data will be saved in Database");
    setIsOnline(true);
  };

  const handleOffline = () => {
    setMessage("You are offline. Data will be saved to localStorage.");
    setIsOnline(false);
  };

  
  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline); // Corrected event name

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Removed dependency on isOnline to prevent re-adding listeners unnecessarily

  return { isOnline, message, setMessage };
}

export default useOnlineStatus;
