import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Brain, Mail, ArrowLeft, Send, Info, KeyRound } from 'lucide-react';

const ForgotPasswordPage = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setResponseMessage(res.message);
      toast.info('Password reset policy guidance retrieved.');
    } catch (err) {
      toast.error(err.message || 'Unable to process reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 74px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#F8FAFC' }}>
      <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--gradient-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '12px'
            }}
          >
            <KeyRound size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Password Assistance
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '6px' }}>
            Recover access to your SkillMate AI account
          </p>
        </div>

        {responseMessage ? (
          <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#312E81', fontSize: '0.875rem', lineHeight: '1.6' }}>
              <Info size={20} style={{ shrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: '6px' }}>Reset Policy Notice:</p>
                <p>{responseMessage}</p>
                <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}>
                  <strong>Demo Accounts:</strong> If testing with demo accounts, please use the pre-configured password: <code>Student@123</code> or <code>Mentor@123</code> or <code>Admin@123</code>.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Registered Email Address <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@skillmate.ai"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  disabled={isSubmitting}
                  required
                />
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
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
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Reset Request</span>
                </>
              )}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
            <ArrowLeft size={16} />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
