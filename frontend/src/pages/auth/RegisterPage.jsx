import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Brain, User, Mail, Lock, Eye, EyeOff, Check, X, UserPlus, AlertCircle, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    education: 'B.Tech Computer Science & Engineering',
    college: '',
    interests: 'Full-Stack Web Development, AI & Machine Learning'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live password complexity checks
  const passChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[\W_]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passChecks).every(Boolean);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) {
      errs.name = 'Name can only contain letters and standard punctuation.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (!isPasswordValid) {
      errs.password = 'Password does not meet the complexity requirements.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
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
      toast.error('Please resolve all validation errors before proceeding.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(formData);
      toast.success(res.message || 'Student account created successfully!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 74px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#F8FAFC' }}>
      <div className="card animate-fade-in" style={{ maxWidth: '580px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-card)' }}>
        {/* Header */}
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
            Join SkillMate AI
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '6px' }}>
            Create your student profile and supercharge your academic journey
          </p>
        </div>

        {/* Notice for Public Accounts */}
        <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '0.8rem', color: '#4338CA', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} />
          <span>Public registration grants instant <strong>STUDENT</strong> access. Mentor & Admin roles are provisioned by administrators.</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Johnson"
                className={`form-input ${errors.name ? 'error' : ''}`}
                style={{ paddingLeft: '38px' }}
                disabled={isSubmitting}
              />
              <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {errors.name && (
              <div className="field-error">
                <AlertCircle size={14} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              College / Personal Email <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. student@college.edu"
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

          {/* Education & College */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="education">Degree / Course</label>
              <input
                id="education"
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech CSE, BCA"
                className="form-input"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="college">College / University</label>
              <input
                id="college"
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Metro State University"
                className="form-input"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Interests */}
          <div className="form-group">
            <label className="form-label" htmlFor="interests">Subject Interests & Aspirations</label>
            <input
              id="interests"
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g. Databases, Machine Learning, Web Technologies"
              className="form-input"
              disabled={isSubmitting}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password (min 8 chars)"
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                disabled={isSubmitting}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', padding: '4px' }}
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

            {/* Password checklist */}
            <div style={{ marginTop: '10px', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passChecks.length ? '#10B981' : '#94A3B8' }}>
                {passChecks.length ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                <span>8+ Characters</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passChecks.upper ? '#10B981' : '#94A3B8' }}>
                {passChecks.upper ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                <span>Uppercase Letter</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passChecks.lower ? '#10B981' : '#94A3B8' }}>
                {passChecks.lower ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                <span>Lowercase Letter</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passChecks.number ? '#10B981' : '#94A3B8' }}>
                {passChecks.number ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                <span>Number (0-9)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passChecks.special ? '#10B981' : '#94A3B8', gridColumn: 'span 2' }}>
                {passChecks.special ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                <span>Special Symbol (@, #, $, %, etc.)</span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                disabled={isSubmitting}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', padding: '4px' }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="field-error">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
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
                <span>Creating Student Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
