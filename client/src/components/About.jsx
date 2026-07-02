import React, { useState } from 'react';
import { ShieldCheck, Cpu, Database, Layout } from 'lucide-react';

export default function About() {
  const [activeCategory, setActiveCategory] = useState('all');

  const skills = [
    // Frontend
    { name: 'React.js', category: 'frontend', level: 'Expert', icon: <Layout size={16} /> },
    { name: 'Flutter & Dart', category: 'frontend', level: 'Expert', icon: <Layout size={16} /> },
    { name: 'HTML5 & CSS3', category: 'frontend', level: 'Expert', icon: <Layout size={16} /> },
    { name: 'JavaScript', category: 'frontend', level: 'Expert', icon: <Layout size={16} /> },
    
    // Backend
    { name: 'Node.js & Express', category: 'backend', level: 'Expert', icon: <Cpu size={16} /> },
    { name: 'PHP', category: 'backend', level: 'Advanced', icon: <Cpu size={16} /> },
    { name: 'Java', category: 'backend', level: 'Advanced', icon: <Cpu size={16} /> },
    { name: 'C Language', category: 'backend', level: 'Intermediate', icon: <Cpu size={16} /> },
    
    // Databases & Tools
    { name: 'MongoDB', category: 'tools', level: 'Expert', icon: <Database size={16} /> },
    { name: 'SQL Databases', category: 'tools', level: 'Advanced', icon: <Database size={16} /> },
    { name: 'Linux System', category: 'tools', level: 'Advanced', icon: <ShieldCheck size={16} /> },
    { name: 'Git & GitHub', category: 'tools', level: 'Expert', icon: <ShieldCheck size={16} /> }
  ];

  const timeline = [
    {
      year: '2021 - Present',
      role: 'Computer Science Student',
      company: 'USTHB Algiers',
      description: 'Studying advanced algorithmics, databases, system architecture, and network protocols. Applying programming concepts in academic team tasks.'
    },
    {
      year: '2024 - Present',
      role: 'Web & Mobile Developer',
      company: 'Freelance & Projects',
      description: 'Building custom React + Node Express platforms and cross-platform native Flutter mobile applications for various clients and academic demonstrations.'
    },
    {
      year: '2021 - 2023',
      role: 'Foundations & Self-Study',
      company: 'University & Communities',
      description: 'Gained solid concepts in programming languages (C, Java, PHP, JavaScript) and database languages (SQL). Built command-line tools and web applications.'
    }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="about" className="about-section">
      <div className="glow-bg" style={{ top: '30%', right: '10%' }}></div>
      
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">
          My developer journey, professional skills, and engineering milestones.
        </p>

        <div className="grid-2 about-intro-grid">
          <div className="about-bio glass-card">
            <h3 className="card-title-highlight">Who I Am</h3>
            <p>
              I am a Computer Science student at USTHB (University of Science and Technology Houari Boumediene) and a passionate developer based in Algiers. I focus on creating high-quality, responsive web portals using the MERN stack and modular cross-platform mobile apps with Flutter & Dart.
            </p>
            <p style={{ marginTop: '1rem' }}>
              I enjoy solving complex logical puzzles, designing clean software architectures, and coding tools. From database design with SQL to systems engineering in Linux, C, and Java, I love learning and applying modern frameworks.
            </p>
          </div>

          <div className="about-skills glass-card">
            <h3 className="card-title-highlight">Professional Tech Stack</h3>
            
            <div className="skills-filter-buttons">
              <button 
                className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'frontend' ? 'active' : ''}`}
                onClick={() => setActiveCategory('frontend')}
              >
                Frontend
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveCategory('backend')}
              >
                Backend
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'tools' ? 'active' : ''}`}
                onClick={() => setActiveCategory('tools')}
              >
                DBs & Tools
              </button>
            </div>

            <div className="skills-grid">
              {filteredSkills.map((skill, idx) => (
                <div className="skill-pill" key={idx}>
                  {skill.icon}
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="timeline-container">
          <h3 className="timeline-heading">Professional Timeline</h3>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-dot"></div>
                <div className="timeline-content glass-card">
                  <span className="timeline-year">{item.year}</span>
                  <h4 className="timeline-role">{item.role}</h4>
                  <span className="timeline-company">{item.company}</span>
                  <p className="timeline-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
