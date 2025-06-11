import React, { useState } from 'react';

const LoginDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Add your login logic here
    alert('Logged in!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2067d1 0%, #f8faff 100%)'
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem 2.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        minWidth: '320px'
      }}>
        <h2 className="mb-3" style={{ color: '#2067d1', fontWeight: 700 }}>Login Dashboard</h2>
        <p className="mb-4" style={{ color: '#555' }}>Please log in to access your account.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button type="submit" className="btn btn-primary w-100" style={{ background: '#2067d1', border: 'none' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginDashboard;