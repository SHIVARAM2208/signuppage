import React, { useState } from 'react';

export default function AuthForm({ mode, onLogin, setMode }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await fetch(`/api/auth?action=${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMsg(data.message || data.error);
      if (data.token && mode === 'login') {
        localStorage.setItem('jwt_token', data.token);
        if (onLogin) onLogin(data.token);
      }
    } catch {
      setMsg('Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 300, margin: '2rem auto', padding: 24,
      border: '1px solid #ccc', borderRadius: 8, background: '#fafafa'
    }}>
      <h2>{mode === 'signup' ? 'Sign Up' : 'Login'}</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        style={{ display: 'block', marginBottom: 12, width: '100%', padding: 8 }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        style={{ display: 'block', marginBottom: 12, width: '100%', padding: 8 }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: 10, background: "#0070f3", color: "#fff", border: 0, borderRadius: 4 }}
      >
        {loading ? 'Please wait...' : (mode === 'signup' ? 'Sign Up' : 'Login')}
      </button>
      <div style={{ marginTop: 12, color: msg.includes('success') ? 'green' : 'red' }}>{msg}</div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {mode === 'login' ? (
          <span>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Sign up
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Login
            </button>
          </span>
        )}
      </div>
    </form>
  );
}
