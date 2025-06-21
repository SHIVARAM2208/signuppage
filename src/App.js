import React, { useState } from 'react';
import AuthForm from './AuthForm';

function App() {
  const [mode, setMode] = useState('home'); // default is home screen
  const [jwt, setJwt] = useState(() => localStorage.getItem('jwt_token') || "");

  // Example: fetch user info with token
  const fetchMe = async () => {
    if (!jwt) return;
    const res = await fetch('/api/auth?action=me', {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  if (mode === 'home') {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <h1>Welcome to the Home Page</h1>
        <button
          style={{ padding: 10, fontSize: 16, marginRight: 10 }}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          style={{ padding: 10, fontSize: 16 }}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button
          onClick={() => setMode('login')}
          style={{
            marginRight: 10,
            padding: 8,
            background: mode === 'login' ? '#0070f3' : '#eee',
            color: mode === 'login' ? '#fff' : '#333',
            border: 0,
            borderRadius: 4,
          }}
        >
          Login
        </button>
        <button
          onClick={() => setMode('signup')}
          style={{
            padding: 8,
            background: mode === 'signup' ? '#0070f3' : '#eee',
            color: mode === 'signup' ? '#fff' : '#333',
            border: 0,
            borderRadius: 4,
          }}
        >
          Sign Up
        </button>
      </div>
      <AuthForm mode={mode} onLogin={setJwt} setMode={setMode} />
      {jwt && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={fetchMe}>Show My Info (Protected Route)</button>
        </div>
      )}
    </div>
  );
}

export default App;
