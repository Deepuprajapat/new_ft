import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {login} from "../../../apis/api";

const LoginDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await login(email, password);
      console.log(response)
      if (response && response.data && response.data.access_token) {
        localStorage.setItem("auth-token", response.data.access_token);
        
        // Store user role if provided in response
        if (response.data.role) {
          localStorage.setItem("user-role", response.data.role);
        }
        // Redirect based on user role
        const userRole = response.data.role;
        if (userRole === 'dm') {
          navigate('/admin/leads/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
        window.location.reload();
        } else {
        setError('Login failed. Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
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
        width: '100%',
        maxWidth: '500px', // Increased from 410px to 500px
        background: '#fff',
        padding: '2.5rem 2.5rem 2.5rem 2.5rem',
        borderRadius: '22px',
        boxShadow: '0 8px 32px rgba(32,103,209,0.13)',
        minWidth: '340px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <img
            src="/images/login.png"
            alt="Logo"
            style={{
              width: 90,
              height: 90,
              borderRadius: '22px',
              boxShadow: '0 4px 24px rgba(32,103,209,0.13)',
              objectFit: 'contain',
              background: '#f8faff',
              display: 'block',
              margin: '0 auto'
            }}
            loading="eager"
            
          />
        </div>
        <h2 className="mb-3" style={{ color: '#2067d1', fontWeight: 700, textAlign: 'center', letterSpacing: '1px' }}>Login Dashboard</h2>
        <p className="mb-4" style={{ color: '#555', textAlign: 'center' }}>Please log in to access your account.</p>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
              style={{
                borderRadius: '12px',
                border: '1.5px solid #dbeafe',
                boxShadow: '0 2px 10px rgba(32,103,209,0.07)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                fontSize: '17px',
                height: '54px',
                padding: '0 18px',
                marginTop: '8px'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#2067d1';
                e.target.style.boxShadow = '0 4px 16px rgba(32,103,209,0.13)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#dbeafe';
                e.target.style.boxShadow = '0 2px 10px rgba(32,103,209,0.07)';
              }}
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
              style={{
                borderRadius: '12px',
                border: '1.5px solid #dbeafe',
                boxShadow: '0 2px 10px rgba(32,103,209,0.07)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                fontSize: '17px',
                height: '54px',
                padding: '0 18px',
                marginTop: '8px'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#2067d1';
                e.target.style.boxShadow = '0 4px 16px rgba(32,103,209,0.13)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#dbeafe';
                e.target.style.boxShadow = '0 2px 10px rgba(32,103,209,0.07)';
              }}
            />
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              background: '#2067d1',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '18px',
              right: '10px',
              height: '54px',
              marginTop: '16px',
              boxShadow: '0 4px 16px rgba(56, 69, 89, 0.13)',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={e => {
              e.target.style.background = '#1857b0';
              e.target.style.boxShadow = '0 8px 24px rgba(32,103,209,0.18)';
            }}
            onMouseOut={e => {
              e.target.style.background = '#2067d1';
              e.target.style.boxShadow = '0 4px 16px rgba(32,103,209,0.13)';
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginDashboard;