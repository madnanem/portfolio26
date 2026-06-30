import React from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';

export default function Hero({ setActiveTab }) {
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section">
      {/* Dynamic Animated Background Circles */}
      <div className="glow-bg glow-animate-1" style={{ top: '10%', left: '10%' }}></div>
      <div className="glow-bg cyan glow-animate-2" style={{ bottom: '20%', right: '10%' }}></div>

      <div className="container hero-container animate-fade-in">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            Available for Freelance & Full-time Roles
          </div>
          
          <h1 className="hero-title">
            Crafting Premium <br />
            <span className="text-gradient">Digital Experiences</span>
          </h1>
          
          <p className="hero-subtitle">
            I am a Computer Science student at USTHB and a Full Stack Web & Mobile Developer. I specialize in the MERN stack and cross-platform Flutter/Dart applications.
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn btn-primary"
              onClick={() => handleScrollToSection('projects')}
            >
              View My Work <ArrowRight size={18} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleScrollToSection('contact')}
            >
              Let's Connect <Mail size={18} />
            </button>
          </div>
          
          <div className="hero-socials">
            <a href="https://github.com/madnanem" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/adnane-sa%C3%AFdi-834937263/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="mailto:saadnane859@gmail.com" className="social-icon-btn" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card-wrapper">
            <div className="visual-card-glass">
              <div className="card-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="card-code">
                <p><span className="code-keyword">const</span> developer = &#123;</p>
                <p>&nbsp;&nbsp;name: <span className="code-string">'SAIDI Mohamed Adnane'</span>,</p>
                <p>&nbsp;&nbsp;role: <span className="code-string">'Full Stack Web & Mobile Dev'</span>,</p>
                <p>&nbsp;&nbsp;skills: [</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">'MERN Stack'</span>, <span className="code-string">'Flutter'</span>, <span className="code-string">'Dart'</span>,</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">'HTML/CSS/JS'</span>, <span className="code-string">'PHP/SQL'</span>, <span className="code-string">'Java/C'</span></p>
                <p>&nbsp;&nbsp;],</p>
                <p>&nbsp;&nbsp;hardWorker: <span className="code-boolean">true</span>,</p>
                <p>&nbsp;&nbsp;passionate: <span className="code-boolean">true</span></p>
                <p>&#125;;</p>
              </div>
            </div>
            
            {/* Overlay statistics badge */}
            <div className="visual-badge-overlay">
              <span className="stat-num">2+</span>
              <span className="stat-text">Years of <br />Code Craft</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
