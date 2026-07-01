import React, { useState, useEffect } from 'react';
import { Menu, X, Code } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#hero" className="navbar-logo" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>
          <Code size={24} className="logo-icon" />
          <span>Adnane<span className="text-gradient">.Dev</span></span>
        </a>

        <div className="navbar-links">
          <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>Home</a>
          <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
          <a href="#projects" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('projects'); }}>Projects</a>
          <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
        </div>

        <button className="navbar-mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="navbar-mobile-menu">
          <a href="#hero" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>Home</a>
          <a href="#about" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
          <a href="#projects" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('projects'); }}>Projects</a>
          <a href="#contact" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
        </div>
      )}
    </nav>
  );
}
