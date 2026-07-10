import React from 'react'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 SkillBridge</h1>
        <p>Freelance Marketplace</p>
        <div className="app-links">
          <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer">
            Backend API
          </a>
          <a href="#" className="coming-soon">Coming Soon</a>
        </div>
      </header>
    </div>
  )
}

export default App