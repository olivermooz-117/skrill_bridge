# SkillBridge - Freelance Marketplace

A full-stack freelance marketplace where users can list, browse, and book skill-based services. Freelancers create gigs, clients place orders and leave reviews, with JWT-secured accounts and password reset support.

## 🚀 Features

- **User Authentication**: JWT-based authentication with login, registration, and password reset
- **Gig Management**: Create, read, update, and delete service listings
- **Order System**: Place orders, track status, and cancel orders
- **Reviews**: Rate and review completed orders
- **Search & Filter**: Search gigs by title, tags, and price range
- **Role-Based Access**: Separate interfaces for freelancers and clients
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Backend
- Flask 2.3.3
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- PostgreSQL (Production) / SQLite (Development)
- Flask-CORS
- Flask-Migrate

### Frontend
- React 18.2.0
- React Router v6
- Axios (HTTP Client)
- CSS3 (Custom styling)

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite works for development)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skillbridge.git
cd skillbridge