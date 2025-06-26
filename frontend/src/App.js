import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import SubmitFeedback from "./manager/SubmitFeedback";
import Navbar from "./components/Navbar";
import FeedbackTimeline from "./employee/FeedbackTimeline";
import ManagerDashboard from "./pages/ManagerDashboard";
import "./styles/main.css";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/submit" : "/login"} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/employee/timeline" element={<FeedbackTimeline />} />
        <Route path="/submit" element={user?.role === "manager" ? <SubmitFeedback /> : <Navigate to="/login" />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

