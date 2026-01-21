import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Stores logged-in user data
  const [view, setView] = useState("login"); // Controls which screen to show: 'login', 'register', or 'main'

  // On component mount, check if user was previously logged in and still has a valid token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    // If both token and user exist, restore the session automatically
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Parse JSON string back to object
      setView("main");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setView("main");
  };

  // Clears user session data from both state and browser storage
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    localStorage.removeItem("user"); // Remove user data
    setUser(null); // Clear user from state
    setView("login"); // Redirect to login screen
  };

  return (
    <div className="App">
      <h1>Bulletin Board</h1>
      {!user ? (
        // Display login/register screen if not logged in
        <div>
          <button onClick={() => setView("login")}>Login</button>
          <button onClick={() => setView("register")}>Register</button>
          {view === "login" && <Login onLogin={handleLogin} />}
          {view === "register" && <Register />}
        </div>
      ) : (
        // Display main app if user is logged in
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
          {/* TODO: Add PostList component and main content here */}
          <p>Main app content here...</p>
        </div>
      )}
    </div>
  );
}

export default App;
