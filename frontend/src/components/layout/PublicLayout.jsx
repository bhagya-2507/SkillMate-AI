import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, Menu, X, BookOpen, Brain, Shield, Award } from 'lucide-react';

const PublicLayout = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'MENTOR') return '/mentor/dashboard';
    return '/student/dashboard';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px'
          }}
        >
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Brain size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
                  SKILLMATE
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: 'var(--gradient-primary)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '6px'
                  }}
                >
                  AI
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
                Learning & Career Assistant
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--primary)' : '#475569',
                    transition: 'color 0.2s',
                    position: 'relative'
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="btn btn-gradient" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                  <span>Open {role === 'ADMIN' ? 'Admin' : role === 'MENTOR' ? 'Mentor' : 'Student'} Dashboard</span>
                  <ArrowRight size={15} />
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.82rem', color: '#EF4444' }}
                  title="Sign out to switch account"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 18px' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-gradient" style={{ padding: '8px 18px' }}>
                  <span>Get Started</span>
                  <Sparkles size={16} />
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '16px 24px 24px',
              backgroundColor: '#fff',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: location.pathname === link.path ? 'var(--primary)' : '#334155',
                  padding: '8px 0'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          paddingTop: '64px',
          paddingBottom: '36px',
          borderTop: '1px solid #1E293B'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '40px',
              marginBottom: '48px'
            }}
          >
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                >
                  <Brain size={20} />
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                  SKILLMATE AI
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Your Personal AI Learning & Career Assistant designed specifically for college students and academic institutions.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: '#1E293B', color: '#818CF8' }}>React.js & Vite</span>
                <span className="badge" style={{ background: '#1E293B', color: '#38BDF8' }}>Node.js & Express</span>
                <span className="badge" style={{ background: '#1E293B', color: '#FCD34D' }}>MongoDB & Mongoose</span>
                <span className="badge" style={{ background: '#1E293B', color: '#34D399' }}>Smart Learning Engine</span>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Platform Modules
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#94A3B8' }}>
                <li>AI Learning Assistant</li>
                <li>Smart Study Planner</li>
                <li>AI Quiz Generator</li>
                <li>Notes & Document Summarizer</li>
                <li>Career Guidance & Roadmaps</li>
                <li>Interactive Interview Preparation</li>
              </ul>
            </div>

            {/* Dashboards */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Dashboards
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#94A3B8' }}>
                <li><Link to="/login" style={{ color: '#94A3B8' }}>Student Learning Portal</Link></li>
                <li><Link to="/login" style={{ color: '#94A3B8' }}>Mentor Academic Guidance</Link></li>
                <li><Link to="/login" style={{ color: '#94A3B8' }}>Administrator Control Hub</Link></li>
                <li><Link to="/contact" style={{ color: '#94A3B8' }}>Institution Inquiries</Link></li>
              </ul>
            </div>

            {/* Quick Demo Credentials */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Demo Accounts
              </h4>
              <div style={{ backgroundColor: '#1E293B', padding: '14px', borderRadius: '10px', fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.6' }}>
                <div><strong>Student:</strong> student@skillmate.ai</div>
                <div><strong>Mentor:</strong> mentor@skillmate.ai</div>
                <div><strong>Admin:</strong> admin@skillmate.ai</div>
                <div style={{ marginTop: '6px', color: '#38BDF8' }}>Password: <em>Role@123</em> (e.g. Student@123)</div>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '24px',
              borderTop: '1px solid #1E293B',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: '#64748B',
              gap: '12px'
            }}
          >
            <div>© {new Date().getFullYear()} SkillMate AI. Built for College Academic & Engineering Demonstrations.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/about" style={{ color: '#94A3B8' }}>About</Link>
              <Link to="/contact" style={{ color: '#94A3B8' }}>Contact</Link>
              <Link to="/login" style={{ color: '#94A3B8' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
