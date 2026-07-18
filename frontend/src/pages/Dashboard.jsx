import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeGigs: 0,
    completedOrders: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const ordersResponse = await api.get('/orders');
      const orders = ordersResponse.data.orders || [];
      
      const pending = orders.filter(o => o.status === 'pending').length;
      const completed = orders.filter(o => o.status === 'completed').length;
      
      setStats({
        totalOrders: orders.length,
        completedOrders: completed,
        pendingOrders: pending,
        activeGigs: 0
      });
      
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p className="dashboard-role">{user?.role === 'freelancer' ? 'Freelancer' : 'Client'}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <span className="stat-number">{stats.completedOrders}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-number">{stats.pendingOrders}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <span className="stat-number">{stats.activeGigs}</span>
            <span className="stat-label">Active Gigs</span>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        {user?.role === 'freelancer' && (
          <Link to="/gigs/new" className="action-btn primary">
            + Create New Gig
          </Link>
        )}
        <Link to="/orders" className="action-btn secondary">
          View All Orders
        </Link>
      </div>

      {recentOrders.length > 0 && (
        <div className="dashboard-recent">
          <h2>Recent Orders</h2>
          <div className="recent-orders">
            {recentOrders.map(order => (
              <div key={order.id} className="recent-order-item">
                <div className="order-info">
                  <span className="order-title">{order.gig_title || 'Gig'}</span>
                  <span className="order-status">{order.status}</span>
                </div>
                <span className="order-price">${order.total_price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;