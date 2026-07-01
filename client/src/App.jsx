import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container footer-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Mohamed Adnane SAIDI. All rights reserved.
          </p>
          <div className="footer-links">
            <span className="footer-link-tag">Premium Portfolio</span>
            <span className="footer-divider">•</span>
            <span className="footer-link-tag">Frontend-Only Experience</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
