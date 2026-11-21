import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const ContactPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required.';
    } else if (formData.subject.trim().length < 3) {
      errs.subject = 'Subject must be at least 3 characters.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Message content is required.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must contain at least 10 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the errors highlighted below.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/contact', formData);
      if (res.success) {
        toast.success(res.message || 'Message sent successfully!');
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit contact message. Please try again.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '60px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Get In Touch</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748B', maxWidth: '600px', margin: '12px auto 0' }}>
            Have questions about SkillMate AI, need technical support, or interested in college academic partnerships?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          {/* Contact Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
                SkillMate AI Academic Office
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EEF2FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Direct Email</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>support@skillmate.ai</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Inquiries answered within 24 hours</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Engineering Campus</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Metro University Innovation Lab</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Tech Block 4, Computer Science Dept.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>Support Hours</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Monday - Saturday: 9:00 AM - 6:00 PM</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>AI models available 24/7/365</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', backgroundColor: '#F8FAFC', border: '1.5px dashed #CBD5E1' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                🎓 Academic Project Demonstration Note
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.6' }}>
                Messages sent via this form are recorded immediately into the <code>contact_messages</code> database collection and are inspectable via the Administrator reports.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="card" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
              Send a Message
            </h2>

            {isSubmitted && (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#065F46',
                  fontSize: '0.9rem'
                }}
              >
                <CheckCircle2 size={20} />
                <span>Thank you! Your message has been saved in the database.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. student@college.edu"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">
                  Subject <span className="required">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Feedback on Quiz Generator"
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.subject && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.subject}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your question, suggestion, or feedback here (min 10 characters)..."
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-gradient ${isSubmitting ? 'btn-disabled' : ''}`}
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
