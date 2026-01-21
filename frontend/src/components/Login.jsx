import { useState } from "react";

const Login = ({ onLogin }) => {
  // Form state: stores email and password inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // State for displaying login success/error messages to user
  const [message, setMessage] = useState("");

  // Updates form state as user types - uses spread operator to preserve other fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sends credentials to backend, stores JWT token & user data on success
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    try {
      // Make POST request to backend login endpoint
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        // Store JWT token and user data in localStorage for persistence
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful!");
        // Call parent callback to update App component state
        onLogin(data.user);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      // Handle network errors
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
