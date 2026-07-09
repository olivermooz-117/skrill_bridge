import React from 'react';
import GigCard from './GigCard';
import './GigList.css';

const GigList = ({ gigs, loading }) => {
  if (loading) {
    return (
      <div className="gig-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading gigs...</p>
      </div>
    );
  }

  if (!gigs || gigs.length === 0) {
    return (
      <div className="gig-list-empty">
        <p>No gigs found</p>
      </div>
    );
  }

  return (
    <div className="gig-list">
      {gigs.map(gig => (
        <GigCard key={gig.id} gig={gig} />
      ))}
    </div>
  );
};

export default GigList;