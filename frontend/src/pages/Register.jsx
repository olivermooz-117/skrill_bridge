import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setError('');
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'client',
      bio: data.bio || '',
    };
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Join SkillBridge</h2>
          <p className="auth-subtitle">Create your account and start working</p>
          
          <AuthForm
            type="register"
            onSubmit={handleSubmit}
            error={error}
          />
          
          <div className="auth-footer">
            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;