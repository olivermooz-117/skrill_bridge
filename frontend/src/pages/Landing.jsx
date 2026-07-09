import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GigList from '../components/GigList';
import api from '../services/api';
import './Landing.css';

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredGigs, setFeaturedGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedGigs();
  }, []);

  const fetchFeaturedGigs = async () => {
    try {
      const response = await api.get('/gigs?per_page=6');
      setFeaturedGigs(response.data.gigs);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to gigs page with search query
    window.location.href = `/gigs?search=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Find the Perfect <span className="highlight">Freelancer</span> for Your Project
          </h1>
          <p className="hero-subtitle">
            Connect with talented freelancers and get your work done efficiently.
            Post a project or find your next gig today!
          </p>
          
          <form onSubmit={handleSearch} className="hero-search">
            <input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Gigs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Freelancers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gigs Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Gigs</h2>
            <Link to="/gigs" className="view-all-link">View All →</Link>
          </div>
          
          {loading ? (
            <div className="loading-placeholder">Loading featured gigs...</div>
          ) : (
            <GigList gigs={featuredGigs} />
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of freelancers and clients already using SkillBridge</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Get Started Free
              </Link>
              <Link to="/gigs" className="cta-btn secondary">
                Browse Gigs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;