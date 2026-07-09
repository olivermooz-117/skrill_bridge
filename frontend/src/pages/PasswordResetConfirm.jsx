import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const PasswordResetConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setValidToken(false);
      setError('No reset token provided');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/password-reset/confirm', {
        token,
        new_password: newPassword
      });
      
      setMessage('Password reset successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h2 className="auth-title">Invalid Reset Link</h2>
            <p className="auth-subtitle">
              The password reset link is invalid or has expired.
            </p>
            <div className="auth-footer">
              <Link to="/password-reset" className="auth-link">
                Request New Link →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Set New Password</h2>
          <p className="auth-subtitle">
            Enter your new password below
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
              />
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;