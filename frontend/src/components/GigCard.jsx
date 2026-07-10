import React from 'react';
import { Link } from 'react-router-dom';
import './GigCard.css';

const GigCard = ({ gig }) => {
  return (
    <div className="gig-card">
      <div className="gig-card-header">
        <h3 className="gig-title">{gig.title}</h3>
        <div className="gig-price">${gig.price}</div>
      </div>
      
      <div className="gig-card-body">
        <p className="gig-description">{gig.description?.slice(0, 150)}...</p>
        
        <div className="gig-meta">
          <span className="gig-delivery">
            📦 {gig.delivery_days} days
          </span>
          {gig.average_rating && (
            <span className="gig-rating">
              ⭐ {gig.average_rating}
            </span>
          )}
        </div>
        
        <div className="gig-tags">
          {gig.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} className="gig-tag">
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
      
      <div className="gig-card-footer">
        <span className="gig-freelancer">
          By {gig.freelancer?.name || 'Unknown'}
        </span>
        <Link to={`/gigs/${gig.id}`} className="gig-view-btn">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default GigCard;