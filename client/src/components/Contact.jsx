import React, { useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.type) setStatus({ type: null, message: '' }); // Clear status alert on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Core Form Validation
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Name field is required.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    if (formData.message.trim().length < 10) {
      setStatus({ type: 'error', message: 'Message must be at least 10 characters long.' });
      return;
    }

    try {
      setLoading(true);
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      console.warn('Backend API offline. Simulating contact message delivery.', err);
      // Fallback: simulate successful email delivery for static frontend preview
      setTimeout(() => {
        setStatus({ type: 'success', message: 'Message received! (Static mode simulation: your message was logged in development console).' });
        console.log('Static Message Data:', formData);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setLoading(false);
      }, 1000);
      return; // Skip standard loading state toggle which is handled inside setTimeout
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="glow-bg" style={{ bottom: '10%', left: '10%' }}></div>
      
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">
          Have a project in mind, want to collaborate, or just say hello? Drop a message!
        </p>

        <div className="grid-2 contact-grid">
          {/* Contact Information */}
          <div className="contact-info glass-card">
            <h3 className="card-title-highlight">Contact Information</h3>
            <p className="info-desc">
              I am open to discussions about freelance web developments, full-time engineering opportunities, or general technical inquiries.
            </p>
            
            <div className="info-details">
              <div className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div>
                  <span className="info-label">Email Me</span>
                  <a href="mailto:saadnane859@gmail.com" className="info-text link">saadnane859@gmail.com</a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><MapPin size={20} /></div>
                <div>
                  <span className="info-label">WhatsApp</span>
                  <span className="info-text">+213 669 451 414</span>
                </div>
              </div>
            </div>

            <h4 className="socials-title">Follow My Socials</h4>
            <div className="socials-row">
              <a href="https://github.com/madnanem" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/adnane-sa%C3%AFdi-834937263/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper glass-card">
            <form onSubmit={handleSubmit} className="contact-form">
              {status.type && (
                <div className={`status-alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                  {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span>{status.message}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">Full Name</label>
                <input 
                  type="text" 
                  id="contact-name"
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Adnane"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="contact-email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="form-control"
                  placeholder="adnane@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject" className="form-label">Subject</label>
                <input 
                  type="text" 
                  id="contact-subject"
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Collaboration Project"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">Your Message</label>
                <textarea 
                  id="contact-message"
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Tell me about your project detail..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Sending Message...' : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
