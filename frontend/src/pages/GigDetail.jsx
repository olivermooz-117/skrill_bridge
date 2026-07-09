import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './GigDetail.css';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const response = await api.get(`/gigs/${id}`);
      setGig(response.data);
    } catch (error) {
      setError('Gig not found');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.id === gig?.user_id) {
      alert('You cannot order your own gig');
      return;
    }

    if (!window.confirm('Are you sure you want to order this gig?')) return;

    setOrderLoading(true);
    try {
      await api.post('/orders', { gig_id: gig.id });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="gig-detail-loading">Loading gig...</div>;
  if (error) return <div className="gig-detail-error">{error}</div>;
  if (!gig) return <div className="gig-detail-error">Gig not found</div>;

  return (
    <div className="gig-detail-page">
      <div className="container">
        <div className="gig-detail-container">
          <div className="gig-detail-main">
            <div className="gig-detail-header">
              <h1 className="gig-detail-title">{gig.title}</h1>
              <div className="gig-detail-price">${gig.price}</div>
            </div>

            <div className="gig-detail-meta">
              <span className="meta-item">
                📦 {gig.delivery_days} days delivery
              </span>
              {gig.average_rating && (
                <span className="meta-item">
                  ⭐ {gig.average_rating} average rating
                </span>
              )}
              <span className="meta-item">
                👤 {gig.freelancer?.name || 'Unknown'}
              </span>
            </div>

            <div className="gig-detail-tags">
              {gig.tags?.map(tag => (
                <span key={tag.id} className="detail-tag">#{tag.name}</span>
              ))}
            </div>

            <div className="gig-detail-description">
              <h2>About This Gig</h2>
              <p>{gig.description}</p>
            </div>

            <div className="gig-detail-actions">
              {user?.id === gig.user_id ? (
                <>
                  <Link to={`/gigs/${gig.id}/edit`} className="btn-edit">
                    Edit Gig
                  </Link>
                  <button className="btn-delete" onClick={() => {
                    if (window.confirm('Delete this gig?')) {
                      // Handle delete
                    }
                  }}>
                    Delete Gig
                  </button>
                </>
              ) : (
                <button 
                  className="btn-order"
                  onClick={handleOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? 'Processing...' : 'Order Now'}
                </button>
              )}
            </div>
          </div>

          <div className="gig-detail-sidebar">
            <div className="sidebar-card">
              <h3>About the Freelancer</h3>
              <div className="freelancer-info">
                <div className="freelancer-avatar">
                  {gig.freelancer?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="freelancer-details">
                  <p className="freelancer-name">{gig.freelancer?.name}</p>
                  <p className="freelancer-role">{gig.freelancer?.role}</p>
                </div>
              </div>
              {gig.freelancer?.bio && (
                <p className="freelancer-bio">{gig.freelancer.bio}</p>
              )}
              <Link to={`/profile/${gig.user_id}`} className="btn-view-profile">
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;