import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    try {
      const unsubscribe = onAuthStateChanged(
        auth, 
        (user) => {
          console.log("AuthProvider: Auth state changed", user ? `User ID: ${user.uid}` : "No user");
          initializeUser(user);
        },
        (error) => {
          console.error("AuthProvider: Auth state error", error);
          setAuthError(error);
          setLoading(false);
        }
      );
      
      return () => {
        console.log("AuthProvider: Cleanup auth state listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("AuthProvider: Error setting up auth state listener", error);
      setAuthError(error);
      setLoading(false);
    }
  }, []);

  async function initializeUser(user) {
    try {
      if (user) {
        console.log("AuthProvider: Initializing user", user.uid);
        setCurrentUser({ ...user });
        setUserLoggedIn(true);
      } else {
        console.log("AuthProvider: No user to initialize");
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
    } catch (error) {
      console.error("AuthProvider: Error initializing user", error);
      setAuthError(error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    userLoggedIn,
    currentUser,
    loading,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}