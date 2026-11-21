import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Brain, Lock, Mail, Eye, EyeOff, LogIn, Sparkles, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email format.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
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
      toast.error('Please enter valid credentials.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(formData.email.trim(), formData.password);
      toast.success(res.message || 'Logged in successfully!');

      const userRole = res.user?.role;
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (userRole === 'MENTOR') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Account Auto-Fill
  const fillDemoAccount = (role) => {
    if (role === 'student') {
      setFormData({ email: 'student@skillmate.ai', password: 'Student@123' });
    } else if (role === 'mentor') {
      setFormData({ email: 'mentor@skillmate.ai', password: 'Mentor@123' });
    } else if (role === 'admin') {
      setFormData({ email: 'admin@skillmate.ai', password: 'Admin@123' });
    }
    setErrors({});
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 74px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#F8FAFC' }}>
      <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-card)' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
              marginBottom: '12px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Brain size={26} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '6px' }}>
            Sign in to access your personal AI learning companion
          </p>
        </div>

        {/* Demo Account Quick Buttons */}
        <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '12px', padding: '12px 14px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#4338CA', marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>1-Click Presentation Demo Logins:</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillDemoAccount('student')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'all 0.15s'
              }}
            >
              👨‍🎓 Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('mentor')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'all 0.15s'
              }}
            >
              👨‍🏫 Mentor
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#1E293B',
                transition: 'all 0.15s'
              }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. student@skillmate.ai"
                className={`form-input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: '38px' }}
                disabled={isSubmitting}
              />
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {errors.email && (
              <div className="field-error">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>
                Password <span className="required">*</span>
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your account password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                disabled={isSubmitting}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <div className="field-error">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-gradient ${isSubmitting ? 'btn-disabled' : ''}`}
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748B' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
