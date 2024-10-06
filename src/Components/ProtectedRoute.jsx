import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null); // Start with null
  const user = auth.currentUser;

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === "admin");
      } else {
        setIsAdmin(false); // User not logged in
      }
    };

    checkAdmin();
  }, [user]); // Only run effect if 'user' changes

  if (isAdmin === null) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!isAdmin) {
    return <Navigate to={user ? "/" : "/login"} />; // Redirect based on admin status
  }

  return children; // Render children if user is admin
};

export default ProtectedRoute;
