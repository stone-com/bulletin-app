import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import "./App.css";

// Protected route component - redirects to login if user is not authenticated
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [user, setUser] = useState(null); // Stores logged-in user data
  const navigate = useNavigate(); // Hook for programmatic navigation

  // On component mount, check if user was previously logged in and still has a valid token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    // If both token and user exist, restore the session automatically
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Parse JSON string back to object
      navigate("/dashboard"); // Navigate to main app
    }
  }, [navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard"); // Navigate to dashboard after login
  };

  // Clears user session data from both state and browser storage
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    localStorage.removeItem("user"); // Remove user data
    setUser(null); // Clear user from state
    navigate("/login"); // Navigate to login screen
  };

  return (
    <div className="App">
      <h1>Bulletin Board</h1>
      <Routes>
        {/* Public routes - only accessible if NOT logged in */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Protected route - only accessible if logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Home user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Redirect root path to login or dashboard based on auth status */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />

        {/* Catch-all for undefined routes */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
