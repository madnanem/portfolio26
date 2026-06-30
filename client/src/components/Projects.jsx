import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Eye, X, Laptop } from 'lucide-react';

const LOCAL_FALLBACK_PROJECTS = [
  {
    "id": "1",
    "title": "Nova Task Manager",
    "description": "A collaborative workspace and team task management application featuring real-time updates, activity logs, customizable kanban boards, and interactive progress analytics. Built to streamline project management workflows.",
    "longDescription": "Nova Task Manager is a full-featured collaborative workspace designed for modern agile teams. It solves the fragmentation of communication by integrating project task cards, interactive kanban boards, team messaging, and automated reports into a single, high-performance web interface. The frontend features smooth drag-and-drop mechanics and real-time dashboard updates. The backend uses Express and WebSockets to broadcast board edits instantly across all team members, ensuring zero lag. For data persistence, we leverage MongoDB with robust schemas. Built-in statistics compile task completion ratios, showing team performance in beautiful visual charts.",
    "category": "Fullstack",
    "technologies": ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Chart.js"],
    "githubLink": "https://github.com/example/nova-task-manager",
    "liveLink": "https://nova-task-manager-demo.example.com",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
  },
  {
    "id": "2",
    "title": "Aura Headless E-Commerce",
    "description": "A sleek, lightning-fast headless e-commerce store with Stripe payment integration, cart management, smooth page transitions, and an elegant search filter mechanism. Focuses on premium web design.",
    "longDescription": "Aura E-Commerce redefines modern online shopping. Built as a decoupled headless application, it pulls product catalogs and content from a fast backend database API, rendering them using optimized React components. The primary highlight of Aura is its ultra-premium aesthetic: glassmorphism, fluid micro-interactions, dark mode elegance, and smooth page transition animations. Payments are handled securely using Stripe Elements, complete with instant webhook notifications to verify purchase fulfillment. The backend includes automated inventory management and detailed order invoices.",
    "category": "Frontend",
    "technologies": ["React", "CSS Modules", "Context API", "Stripe API", "Node.js"],
    "githubLink": "https://github.com/example/aura-ecommerce",
    "liveLink": "https://aura-ecommerce-demo.example.com",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60"
  },
  {
    "id": "3",
    "title": "Velo Real-time Analytics",
    "description": "A high-performance real-time data visualization dashboard monitoring server vitals, API traffic, and application error logs. Renders complex dataset graphs in under 50ms.",
    "longDescription": "Velo Analytics is a dedicated dashboard created for system engineers and DevOps teams. By monitoring server loads, API traffic spikes, memory leaks, and application error logs, it gives teams a single, live-updating command center. Data streams are processed asynchronously by an Express.js polling mechanism, then pushed to a responsive React frontend that utilizes ChartJS and canvas drawing tools. It handles high-frequency updates without blocking main thread interactions and provides custom alerts via sound notifications and desktop popups.",
    "category": "Fullstack",
    "technologies": ["React", "Express", "Node.js", "Chart.js", "Server-Sent Events"],
    "githubLink": "https://github.com/example/velo-analytics",
    "liveLink": "https://velo-analytics-demo.example.com",
    "featured": false,
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
  },
  {
    "id": "4",
    "title": "Echo Secure Chat App",
    "description": "A real-time messaging application with end-to-end encryption, group chat channels, presence status, typing indicators, and support for media sharing.",
    "longDescription": "Echo Secure Chat is a modern communication application emphasizing privacy and high-speed delivery. Every message is encrypted client-side using WebCrypto APIs before transmission over WebSockets, ensuring that even intermediate database nodes cannot read message contents. Features include online/offline presence indicators, dynamic user typing notifications, profile customizations, custom-theme selection, and media uploading through file streams. The Express server acts as a message router and stores encrypted channels for historical synchronization.",
    "category": "Fullstack",
    "technologies": ["React", "Node.js", "Express", "MongoDB", "Web Crypto API", "Socket.io"],
    "githubLink": "https://github.com/example/echo-chat",
    "liveLink": "https://echo-chat-demo.example.com",
    "featured": false,
    "image": "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop&q=60"
  }
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Connect to Express backend running on local port 5000 (or absolute path relative to window location in production)
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const response = await fetch(`${baseUrl}/api/projects`);
        const json = await response.json();
        
        if (json.success && json.data && json.data.length > 0) {
          setProjects(json.data);
        } else {
          setProjects(LOCAL_FALLBACK_PROJECTS);
        }
      } catch (err) {
        console.warn('Backend API unavailable. Falling back to local static project seeds.', err);
        setProjects(LOCAL_FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <section id="projects" className="projects-section">
      <div className="glow-bg cyan glow-animate-1" style={{ top: '40%', left: '5%' }}></div>
      
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">
          Explore a curated list of my designs and full-stack software developments.
        </p>

        {/* Filter Buttons */}
        <div className="projects-filter">
          {['All', 'Frontend', 'Fullstack'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="projects-loading">
            <span className="spinner"></span>
            <p>Loading projects...</p>
          </div>
        ) : (
          <div className="grid-3 projects-grid">
            {filteredProjects.map((project) => (
              <div 
                className="glass-card project-card animate-fade-in" 
                key={project._id || project.id}
              >
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} className="project-image" />
                  <div className="project-overlay">
                    <button 
                      className="btn btn-primary btn-icon"
                      onClick={() => setSelectedProject(project)}
                      aria-label="View Project details"
                    >
                      <Eye size={18} /> Quick View
                    </button>
                  </div>
                </div>

                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  
                  <div className="project-tech-pills">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="tech-pill-mini">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="tech-pill-mini font-muted">+{project.technologies.length - 3} more</span>
                    )}
                  </div>

                  <div className="project-links">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedProject(project)}
                    >
                      Details
                    </button>
                    <div className="links-group">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-icon-link" aria-label="GitHub Source">
                          <Github size={18} />
                        </a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-icon-link" aria-label="Live Demo">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)} aria-label="Close modal">
              <X size={20} />
            </button>
            
            <div className="modal-grid">
              <div className="modal-visual">
                <img src={selectedProject.image} alt={selectedProject.title} className="modal-img" />
              </div>
              
              <div className="modal-details">
                <span className="project-category">{selectedProject.category}</span>
                <h3 className="modal-title">{selectedProject.title}</h3>
                
                <h4 className="modal-subheading">Project Overview</h4>
                <p className="modal-desc">{selectedProject.longDescription || selectedProject.description}</p>
                
                <h4 className="modal-subheading">Technologies Used</h4>
                <div className="modal-tech-pills">
                  {selectedProject.technologies.map((tech, idx) => (
                    <span className="tech-pill-mini" key={idx}>{tech}</span>
                  ))}
                </div>

                <div className="modal-actions">
                  {selectedProject.liveLink && (
                    <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Live Preview <ExternalLink size={16} />
                    </a>
                  )}
                  {selectedProject.githubLink && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      Source Code <Github size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
