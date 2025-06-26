import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-blue-600 text-white p-4">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">Home</Link>

        {/* Manager-specific links */}
        {user?.role === "manager" && (
          <>
            <Link to="/submit" className="hover:underline">Submit Feedback</Link>
            <Link to="/manager/dashboard" className="hover:underline">Dashboard</Link>
          </>
        )}

        {/* Employee-specific links */}
        {user?.role === "employee" && (
          <Link to="/employee/timeline" className="hover:underline">Timeline</Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="font-semibold">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
