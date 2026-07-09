import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateGig.css';

const CreateGig = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    delivery_days: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const gigData = {
        ...formData,
        price: parseFloat(formData.price),
        delivery_days: parseInt(formData.delivery_days),
      };
      
      await api.post('/gigs', gigData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-gig-page">
      <div className="container">
        <div className="create-gig-container">
          <div className="create-gig-header">
            <h1>Create a New Gig</h1>
            <p>List your service and start earning</p>
          </div>

          <form className="create-gig-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Gig Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., I will build a stunning website"
                maxLength="200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your service in detail..."
                rows="6"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="49.99"
                />
              </div>

              <div className="form-group">
                <label htmlFor="delivery_days">Delivery Days</label>
                <input
                  type="number"
                  id="delivery_days"
                  name="delivery_days"
                  value={formData.delivery_days}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="3"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags (e.g., web-design)"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                />
                <button onClick={handleAddTag} type="button" className="tag-add-btn">
                  Add Tag
                </button>
              </div>
              <div className="tags-display">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-item">
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Gig'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;