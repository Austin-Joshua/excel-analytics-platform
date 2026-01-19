import React, { useState } from 'react';
import './Navigation.css';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    { name: 'General Analysis', icon: '🔍' },
    { name: 'Deep Analysis', icon: '📊' },
    { name: 'Comparative Analysis', icon: '⚖️' },
    { name: 'Data Quality', icon: '✅' },
    { name: 'Data Summary', icon: '📈' },
    { name: 'AI Recommendations', icon: '💡' }
  ];

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', !darkMode);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Future: implement search functionality
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      {/* Hamburger Menu */}
      <div className="navbar-left">
        <button 
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <h3>Features</h3>
              <button 
                className="close-btn"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="features-list">
              {features.map((feature, index) => (
                <a 
                  key={index} 
                  href="#"
                  className="feature-item"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    // Feature click handler
                  }}
                >
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-name">{feature.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logo and Name */}
      <div className="navbar-brand">
        <div className="logo-icon">📊</div>
        <div className="brand-text">
          <span className="brand-name">AnalySX</span>
          <span className="brand-subtitle">Analytics</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="navbar-center">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text"
            placeholder="Search features or help..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="navbar-right">
        {/* Dark Mode Toggle */}
        <button 
          className="icon-btn dark-mode-toggle"
          onClick={handleDarkMode}
          title="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Settings */}
        <button 
          className="icon-btn settings-btn"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
