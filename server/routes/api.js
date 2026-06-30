const express = require('express');
const router = express.Router();
const db = require('../models/schemas');

// Simple Admin Authentication Middleware
const adminAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'] || req.query.password;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPassword) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid admin password' });
  }
};

// ----------------------------------------------------
// PROJECT API ENDPOINTS
// ----------------------------------------------------

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await db.getProjects();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// Create new project (Admin only)
router.post('/projects', adminAuth, async (req, res) => {
  try {
    const { title, description, longDescription, category, technologies, githubLink, liveLink, featured, image } = req.body;
    
    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({ success: false, error: 'Please provide title, description, and category' });
    }

    const projectData = {
      title,
      description,
      longDescription: longDescription || '',
      category,
      technologies: Array.isArray(technologies) ? technologies : [],
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      featured: !!featured,
      image: image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60'
    };

    const newProject = await db.saveProject(projectData);
    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(500).json({ success: false, error: 'Failed to save project' });
  }
});

// Delete project (Admin only)
router.delete('/projects/:id', adminAuth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const deleted = await db.deleteProject(projectId);
    
    if (deleted) {
      res.json({ success: true, message: 'Project successfully deleted' });
    } else {
      res.status(404).json({ success: false, error: 'Project not found' });
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});

// ----------------------------------------------------
// CONTACT FORM API ENDPOINTS
// ----------------------------------------------------

// Submit a contact form message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Simple validations
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please enter name, email, and message' });
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }

    const messageData = {
      name,
      email,
      subject: subject || 'No Subject',
      message
    };

    const savedMessage = await db.saveContactMessage(messageData);
    res.status(201).json({ success: true, data: savedMessage, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error processing contact message:', err);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Retrieve contact messages (Admin only)
router.get('/messages', adminAuth, async (req, res) => {
  try {
    const messages = await db.getContactMessages();
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// Admin validation check route
router.post('/admin/validate', adminAuth, (req, res) => {
  res.json({ success: true, message: 'Authenticated successfully' });
});

module.exports = router;
