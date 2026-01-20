import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'register', 'main'

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setView('main');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setView('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
  };

  return (
    <div className="App">
      <h1>Bulletin Board</h1>
      {!user ? (
        <div>
          <button onClick={() => setView('login')}>Login</button>
          <button onClick={() => setView('register')}>Register</button>
          {view === 'login' && <Login onLogin={handleLogin} />}
          {view === 'register' && <Register />}
        </div>
      ) : (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
          {/* Placeholder for main content */}
          <p>Main app content here...</p>
        </div>
      )}
    </div>
  );
}

export default App;