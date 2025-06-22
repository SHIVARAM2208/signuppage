import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  const [me, setMe] = React.useState(null);

  const fetchMe = async () => {
    if (!jwt) return;
    const res = await fetch('/api/auth?action=me', {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    const data = await res.json();
    setMe(data.user || data);
  };

  return jwt ? (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <button onClick={fetchMe}>Show My Info (Protected Route)</button>
      {me && (
        <div style={{ marginTop: 20 }}>
          <h3>My Profile Info</h3>
          <pre style={{ textAlign: 'left', display: 'inline-block', background: '#f5f5f5', padding: 12, borderRadius: 6 }}>
            {JSON.stringify(me, null, 2)}
          </pre>
        </div>
      )}
    </div>
  ) : null;
}

function App() {
  const [jwt, setJwt] = useState(() => localStorage.getItem('jwt_token') || "");

  // Save jwt to localStorage for persistence
  React.useEffect(() => {
    if (jwt) {
      localStorage.setItem('jwt_token', jwt);
    } else {
      localStorage.removeItem('jwt_token');
    }
  }, [jwt]);

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
