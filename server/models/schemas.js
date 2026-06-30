const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Paths to JSON files for fallback storage
const PROJECTS_FILE = path.join(__dirname, '../data/db.json');
const MESSAGES_FILE = path.join(__dirname, '../data/messages.json');

// Helper to check if MongoDB is connected
function isMongoActive() {
  return mongoose.connection.readyState === 1;
}

// ----------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// ----------------------------------------------------

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String, required: true },
  technologies: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
  featured: { type: Boolean, default: false },
  image: { type: String }
}, { timestamps: true });

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true }
}, { timestamps: true });

let ProjectModel;
let ContactMessageModel;

try {
  ProjectModel = mongoose.model('Project', ProjectSchema);
  ContactMessageModel = mongoose.model('ContactMessage', ContactMessageSchema);
} catch (e) {
  ProjectModel = mongoose.models.Project;
  ContactMessageModel = mongoose.models.ContactMessage;
}

// ----------------------------------------------------
// JSON FALLBACK DATABASE IMPLEMENTATION
// ----------------------------------------------------

function readJSONFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading database file at ${filePath}:`, err);
    return [];
  }
}

function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing database file at ${filePath}:`, err);
    return false;
  }
}

// Generate a 24-character hexadecimal ID similar to MongoDB ObjectId
function generateId() {
  return Math.floor(Date.now() / 1000).toString(16) + 'x'.repeat(16).replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16);
  });
}

// ----------------------------------------------------
// UNIFIED DATA ACCESS INTERFACE
// ----------------------------------------------------

const db = {
  // Projects Operations
  getProjects: async () => {
    if (isMongoActive()) {
      try {
        return await ProjectModel.find({}).sort({ createdAt: -1 });
      } catch (err) {
        console.error('Mongo getProjects error, falling back to JSON:', err);
      }
    }
    // Fallback to JSON
    return readJSONFile(PROJECTS_FILE);
  },

  saveProject: async (projectData) => {
    if (isMongoActive()) {
      try {
        const project = new ProjectModel(projectData);
        return await project.save();
      } catch (err) {
        console.error('Mongo saveProject error, falling back to JSON:', err);
      }
    }
    // Fallback to JSON
    const projects = readJSONFile(PROJECTS_FILE);
    const newProject = {
      _id: generateId(),
      id: generateId(),
      ...projectData,
      createdAt: new Date().toISOString()
    };
    projects.unshift(newProject); // Add to the top
    writeJSONFile(PROJECTS_FILE, projects);
    return newProject;
  },

  deleteProject: async (projectId) => {
    if (isMongoActive()) {
      try {
        const result = await ProjectModel.findByIdAndDelete(projectId);
        if (result) return true;
      } catch (err) {
        console.error('Mongo deleteProject error, falling back to JSON:', err);
      }
    }
    // Fallback to JSON
    const projects = readJSONFile(PROJECTS_FILE);
    const filtered = projects.filter(p => p._id !== projectId && p.id !== projectId);
    if (projects.length !== filtered.length) {
      writeJSONFile(PROJECTS_FILE, filtered);
      return true;
    }
    return false;
  },

  // Contact Messages Operations
  getContactMessages: async () => {
    if (isMongoActive()) {
      try {
        return await ContactMessageModel.find({}).sort({ createdAt: -1 });
      } catch (err) {
        console.error('Mongo getContactMessages error, falling back to JSON:', err);
      }
    }
    // Fallback to JSON
    return readJSONFile(MESSAGES_FILE);
  },

  saveContactMessage: async (messageData) => {
    if (isMongoActive()) {
      try {
        const message = new ContactMessageModel(messageData);
        return await message.save();
      } catch (err) {
        console.error('Mongo saveContactMessage error, falling back to JSON:', err);
      }
    }
    // Fallback to JSON
    const messages = readJSONFile(MESSAGES_FILE);
    const newMessage = {
      _id: generateId(),
      id: generateId(),
      ...messageData,
      createdAt: new Date().toISOString()
    };
    messages.unshift(newMessage);
    writeJSONFile(MESSAGES_FILE, messages);
    return newMessage;
  }
};

module.exports = db;
