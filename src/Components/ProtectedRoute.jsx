// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import {auth , db} from "../firebase-config"
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  // Check if the user is an admin
  const checkAdmin = async () => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    return userDoc.exists() && userDoc.data().role === "admin";
  };

  const isAdmin = checkAdmin();

  if (!isAdmin) {
    return <Navigate to="/" />; // Redirect to home if not an admin
  }

  return children; // Render the admin component
};

export default ProtectedRoute;
