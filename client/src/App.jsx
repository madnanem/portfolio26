import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Admin from './components/Admin';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'admin'

  return (
    <div className="app-layout">
      {/* Header / Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Pages Content */}
      <main className="main-content">
        {activeTab === 'home' ? (
          <>
            <Hero setActiveTab={setActiveTab} />
            <About />
            <Projects />
            <Contact />
          </>
        ) : (
          <Admin />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Mohamed Adnane SAIDI. All rights reserved.
          </p>
          <div className="footer-links">
            <span className="footer-link-tag">Premium Portfolio</span>
            <span className="footer-divider">•</span>
            <span className="footer-link-tag">MERN Stack Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
