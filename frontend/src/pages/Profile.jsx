import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profile_picture: user?.profile_picture || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.put(`/users/${user.id}`, formData);
      setUser(response.data.user);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Your Profile</h1>
            <p>Manage your personal information</p>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            {error && <div className="profile-error">{error}</div>}
            {message && <div className="profile-success">{message}</div>}

            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <p className="avatar-label">{user?.email}</p>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell people about yourself..."
              />
            </div>

            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value">{user?.role || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Joined</span>
                <span className="info-value">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="profile-submit-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;