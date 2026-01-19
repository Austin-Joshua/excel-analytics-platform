import React from 'react';
import Navigation from './components/Navigation';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navigation />
      <header className="app-header">
        <div className="header-content">
          <h1>📊 Excel Analytics Platform</h1>
          <p>Advanced AI-Powered Data Analysis with Groq</p>
        </div>
      </header>
      <main className="app-main">
        <FileUpload />
      </main>
      <footer className="app-footer">
        <p>Powered by Groq AI • v1.6 • © 2026 Excel Analytics</p>
      </footer>
    </div>
  );
}

export default App;
