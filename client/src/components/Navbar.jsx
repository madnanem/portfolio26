import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Lock, Home } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId, tabName) => {
    setActiveTab(tabName);
    setIsOpen(false);
    
    if (tabName === 'home') {
      // Small timeout to allow component to render before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#hero" className="navbar-logo" onClick={(e) => { e.preventDefault(); handleNavClick('hero', 'home'); }}>
          <Code size={24} className="logo-icon" />
          <span>Adnane<span className="text-gradient">.Dev</span></span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          {activeTab === 'home' ? (
            <>
              <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('hero', 'home'); }}>Home</a>
              <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('about', 'home'); }}>About</a>
              <a href="#projects" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('projects', 'home'); }}>Projects</a>
              <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('contact', 'home'); }}>Contact</a>
            </>
          ) : (
            <button className="nav-link btn-back" onClick={() => handleNavClick('hero', 'home')}>
              <Home size={16} /> Back to Site
            </button>
          )}
          <button 
            className={`admin-toggle-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
            title="Admin Console"
          >
            <Lock size={16} />
            <span>Admin</span>
          </button>
        </div>

        {/* Mobile Navigation Toggle */}
        <button className="navbar-mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="navbar-mobile-menu">
          {activeTab === 'home' ? (
            <>
              <a href="#hero" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('hero', 'home'); }}>Home</a>
              <a href="#about" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('about', 'home'); }}>About</a>
              <a href="#projects" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('projects', 'home'); }}>Projects</a>
              <a href="#contact" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('contact', 'home'); }}>Contact</a>
            </>
          ) : (
            <button className="mobile-nav-link btn-back" onClick={() => handleNavClick('hero', 'home')}>
              <Home size={16} /> Back to Site
            </button>
          )}
          <button 
            className="mobile-nav-link mobile-admin-btn"
            onClick={() => { setActiveTab(activeTab === 'admin' ? 'home' : 'admin'); setIsOpen(false); }}
          >
            <Lock size={16} /> Admin Panel
          </button>
        </div>
      )}
    </nav>
  );
}
