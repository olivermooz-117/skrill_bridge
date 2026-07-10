import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ type, onSubmit, error }) => {
  const isLogin = type === 'login';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    bio: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (!isLogin && formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {(error || validationError) && (
        <div className="auth-error">
          {error || validationError}
        </div>
      )}
      
      {!isLogin && (
        <>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="client">Client - Looking to hire</option>
              <option value="freelancer">Freelancer - Looking for work</option>
            </select>
          </div>
          
          {formData.role === 'freelancer' && (
            <div className="form-group">
              <label htmlFor="bio">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell clients about your skills and experience..."
                rows="3"
              />
            </div>
          )}
        </>
      )}
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'}
          minLength={isLogin ? undefined : 6}
        />
      </div>
      
      {!isLogin && (
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </div>
      )}
      
      <button type="submit" className="auth-submit-btn">
        {isLogin ? 'Login' : 'Create Account'}
      </button>
    </form>
  );
};

export default AuthForm;