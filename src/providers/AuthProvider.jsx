"use client";

import { app } from "@/firebase/firebase.config";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";


const auth = getAuth(app);

export const AuthContext = createContext(null);

export default function AuthProvider({
  children,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  // Login with google
  const LoginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Sign Out
  const Logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Manage user
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User in Auth state change ", currentUser);
        setUser(currentUser);
        setLoading(false);
      }
      else {
        console.log("User logged out");
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  const authInfo= {
    LoginWithGoogle,
    Logout,
    loading,
    user,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}