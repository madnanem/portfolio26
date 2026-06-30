import React, { useState, useEffect } from 'react';
import { Lock, FileText, LayoutGrid, Plus, Trash2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminTab, setAdminTab] = useState('messages'); // messages or projects
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'Frontend',
    technologies: '',
    githubLink: '',
    liveLink: '',
    featured: false,
    image: ''
  });

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-admin-password': password
    };
  };

  const checkBaseUrl = () => {
    return window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
  };

  // Perform Validation Check
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) {
      setAuthError('Please enter password.');
      return;
    }

    try {
      setLoading(true);
      setAuthError('');
      const response = await fetch(`${checkBaseUrl()}/api/admin/validate`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('portfolio_admin_pw', password);
        fetchAdminData();
      } else {
        setAuthError(data.error || 'Invalid password.');
      }
    } catch (err) {
      console.warn('Backend server offline. Simulating developer dashboard access.', err);
      if (password === 'admin123') {
        setIsAuthenticated(true);
        localStorage.setItem('portfolio_admin_pw', password);
        // Load mock data
        setMessages([
          { _id: 'm1', name: 'Emily Watson', email: 'emily@example.com', subject: 'Project Offer', message: 'Hello, I loved your portfolio! We would love to collaborate on a mobile app design.', createdAt: new Date().toISOString() }
        ]);
        setProjects([
          { _id: '1', title: 'Nova Task Manager', category: 'Fullstack', description: 'Collaborative task management tool.' }
        ]);
      } else {
        setAuthError('Offline check: Try default password "admin123".');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check stored password on load
  useEffect(() => {
    const savedPw = localStorage.getItem('portfolio_admin_pw');
    if (savedPw) {
      setPassword(savedPw);
      // Auto authenticate
      const autoAuth = async () => {
        try {
          const response = await fetch(`${checkBaseUrl()}/api/admin/validate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': savedPw
            }
          });
          const data = await response.json();
          if (data.success) {
            setIsAuthenticated(true);
            // Fetch records
            const msgRes = await fetch(`${checkBaseUrl()}/api/messages`, { headers: { 'x-admin-password': savedPw } });
            const msgJson = await msgRes.json();
            if (msgJson.success) setMessages(msgJson.data);
            
            const projRes = await fetch(`${checkBaseUrl()}/api/projects`);
            const projJson = await projRes.json();
            if (projJson.success) setProjects(projJson.data);
          } else {
            localStorage.removeItem('portfolio_admin_pw');
          }
        } catch (err) {
          console.warn('Auto auth error (server may be offline):', err);
        }
      };
      autoAuth();
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      const activePw = password || localStorage.getItem('portfolio_admin_pw');
      // Fetch messages
      const msgRes = await fetch(`${checkBaseUrl()}/api/messages`, { 
        headers: { 'x-admin-password': activePw } 
      });
      const msgJson = await msgRes.json();
      if (msgJson.success) setMessages(msgJson.data);

      // Fetch projects
      const projRes = await fetch(`${checkBaseUrl()}/api/projects`);
      const projJson = await projRes.json();
      if (projJson.success) setProjects(projJson.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('portfolio_admin_pw');
    setMessages([]);
    setProjects([]);
  };

  // Add Project Submit
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      setStatus({ type: 'error', message: 'Please enter a title and description.' });
      return;
    }

    const techArray = newProject.technologies
      ? newProject.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const projectPayload = {
      ...newProject,
      technologies: techArray
    };

    try {
      const response = await fetch(`${checkBaseUrl()}/api/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(projectPayload)
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Project successfully created!' });
        setNewProject({
          title: '',
          description: '',
          longDescription: '',
          category: 'Frontend',
          technologies: '',
          githubLink: '',
          liveLink: '',
          featured: false,
          image: ''
        });
        fetchAdminData();
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to create project.' });
      }
    } catch (err) {
      console.warn('Server offline. Simulating local project creation.', err);
      // Simulate locally
      const mockProj = {
        _id: Date.now().toString(),
        ...projectPayload
      };
      setProjects([mockProj, ...projects]);
      setStatus({ type: 'success', message: 'Project created locally (Simulated Offline Mode)!' });
      setNewProject({
        title: '',
        description: '',
        longDescription: '',
        category: 'Frontend',
        technologies: '',
        githubLink: '',
        liveLink: '',
        featured: false,
        image: ''
      });
    }
  };

  // Delete Project Submit
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`${checkBaseUrl()}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Project deleted successfully!' });
        fetchAdminData();
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to delete project.' });
      }
    } catch (err) {
      console.warn('Server offline. Simulating local project deletion.', err);
      setProjects(projects.filter(p => p._id !== id && p.id !== id));
      setStatus({ type: 'success', message: 'Project deleted locally (Simulated Offline Mode)!' });
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <section className="admin-login-section">
        <div className="glow-bg" style={{ top: '20%', left: '30%' }}></div>
        <div className="container flex-center">
          <div className="glass-card login-card animate-fade-in">
            <div className="login-header">
              <Lock size={32} className="text-gradient-icon" />
              <h2>Admin Console</h2>
              <p>Please enter your developer password to authenticate.</p>
            </div>
            
            <form onSubmit={handleLogin}>
              {authError && (
                <div className="status-alert alert-danger">
                  <AlertCircle size={18} />
                  <span>{authError}</span>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="admin-pw" className="form-label">Password</label>
                <input 
                  type="password" 
                  id="admin-pw"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Dashboard Screen
  return (
    <section className="admin-dashboard-section">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2 className="section-title text-left">Admin Dashboard</h2>
            <p className="section-subtitle text-left">Manage incoming client messages and project portfolios.</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Global Action Banner */}
        {status.message && (
          <div style={{ marginBottom: '2rem' }} className={`status-alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{status.message}</span>
            <button className="alert-close" onClick={() => setStatus({ type: null, message: '' })}>×</button>
          </div>
        )}

        {/* Dashboard Tabs Toggle */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${adminTab === 'messages' ? 'active' : ''}`}
            onClick={() => setAdminTab('messages')}
          >
            <FileText size={18} /> Messages ({messages.length})
          </button>
          <button 
            className={`tab-btn ${adminTab === 'projects' ? 'active' : ''}`}
            onClick={() => setAdminTab('projects')}
          >
            <LayoutGrid size={18} /> Manage Projects ({projects.length})
          </button>
        </div>

        {/* Contact Messages Tab */}
        {adminTab === 'messages' && (
          <div className="messages-tab-content animate-fade-in">
            {messages.length === 0 ? (
              <div className="glass-card empty-state">
                <FileText size={48} className="muted-icon" />
                <p>No messages received yet.</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div className="glass-card message-card" key={msg._id || msg.id}>
                    <div className="message-header">
                      <div>
                        <h4 className="message-sender">{msg.name}</h4>
                        <a href={`mailto:${msg.email}`} className="message-email">{msg.email}</a>
                      </div>
                      <span className="message-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="message-body">
                      <p className="message-subject"><strong>Subject:</strong> {msg.subject}</p>
                      <p className="message-content-text">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {adminTab === 'projects' && (
          <div className="projects-tab-content grid-2 animate-fade-in">
            {/* Project List */}
            <div className="admin-projects-list glass-card">
              <h3 className="card-title-highlight">Current Portfolio</h3>
              {projects.length === 0 ? (
                <p className="text-muted">No projects in database.</p>
              ) : (
                <div className="projects-table">
                  {projects.map((proj) => (
                    <div className="project-table-row" key={proj._id || proj.id}>
                      <div>
                        <h4 className="project-table-title">{proj.title}</h4>
                        <span className="project-table-cat">{proj.category}</span>
                      </div>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteProject(proj._id || proj.id)}
                        aria-label={`Delete project ${proj.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Form */}
            <div className="admin-project-form glass-card">
              <h3 className="card-title-highlight">Add New Project</h3>
              <form onSubmit={handleAddProject}>
                <div className="form-group">
                  <label htmlFor="proj-title" className="form-label">Project Title</label>
                  <input 
                    type="text" 
                    id="proj-title"
                    className="form-control"
                    placeholder="e.g. Nova Task Manager"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="proj-desc" className="form-label">Short Description</label>
                  <input 
                    type="text" 
                    id="proj-desc"
                    className="form-control"
                    placeholder="Brief 1-sentence tagline..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="proj-longdesc" className="form-label">Detailed Overview</label>
                  <textarea 
                    id="proj-longdesc"
                    className="form-control"
                    placeholder="Detailed structural information, mechanics, and design parameters..."
                    value={newProject.longDescription}
                    onChange={(e) => setNewProject({ ...newProject, longDescription: e.target.value })}
                  />
                </div>

                <div className="grid-2" style={{ gap: '1rem', padding: '0', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label htmlFor="proj-cat" className="form-label">Category</label>
                    <select 
                      id="proj-cat"
                      className="form-control"
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Fullstack">Fullstack</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="proj-featured" className="form-label">Featured Project</label>
                    <div style={{ display: 'flex', alignItems: 'center', height: '45px' }}>
                      <input 
                        type="checkbox" 
                        id="proj-featured"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        checked={newProject.featured}
                        onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      />
                      <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Showcase on top</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="proj-tech" className="form-label">Technologies (Comma separated)</label>
                  <input 
                    type="text" 
                    id="proj-tech"
                    className="form-control"
                    placeholder="React, Node.js, Express, MongoDB"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="proj-img" className="form-label">Image URL</label>
                  <input 
                    type="url" 
                    id="proj-img"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  />
                </div>

                <div className="grid-2" style={{ gap: '1rem', padding: '0', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label htmlFor="proj-github" className="form-label">GitHub URL</label>
                    <input 
                      type="url" 
                      id="proj-github"
                      className="form-control"
                      placeholder="https://github.com/..."
                      value={newProject.githubLink}
                      onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="proj-live" className="form-label">Live Preview URL</label>
                    <input 
                      type="url" 
                      id="proj-live"
                      className="form-control"
                      placeholder="https://example.com"
                      value={newProject.liveLink}
                      onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  <Plus size={16} /> Add Project
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
