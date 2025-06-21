import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login">
        <button style={{ padding: 10, fontSize: 16, marginRight: 10 }}>Login</button>
      </Link>
      <Link to="/signup">
        <button style={{ padding: 10, fontSize: 16 }}>Sign Up</button>
      </Link>
    </div>
  );
}

function Login({ setJwt }) {
  return (
    <div>
      <AuthForm mode="login" onLogin={setJwt} />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        Don&apos;t have an account?{' '}
        <Link to="/signup" style={{ color: '#0070f3', textDecoration: 'underline' }}>Sign up</Link>
      </div>
    </div>
  );
}

function Signup({ setJwt }) {
  return (
    <div>
      <AuthForm mode="signup" onLogin={setJwt} />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#0070f3', textDecoration: 'underline' }}>Login</Link>
      </div>
    </div>
  );
}

function Profile({ jwt }) {
  const fetchMe = async () => {
    if (!jwt) return;
    const res = await fetch('/api/auth?action=me', {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return jwt ? (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <button onClick={fetchMe}>Show My Info (Protected Route)</button>
    </div>
  ) : null;
}

function App() {
  const [jwt, setJwt] = useState(() => localStorage.getItem('jwt_token') || "");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<><Login setJwt={setJwt}/><Profile jwt={jwt} /></>} />
        <Route path="/signup" element={<><Signup setJwt={setJwt}/><Profile jwt={jwt} /></>} />
      </Routes>
    </Router>
  );
}

export default App;
