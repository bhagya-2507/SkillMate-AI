import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Brain,
  LayoutDashboard,
  MessageSquare,
  CalendarDays,
  HelpCircle,
  FileText,
  Compass,
  Briefcase,
  TrendingUp,
  User,
  LogOut,
  Users,
  GraduationCap,
  Layers,
  CheckSquare,
  FileSpreadsheet,
  BookOpen,
  Award,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Shield,
  Bell
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Student Navigation Items
  const studentNav = [
    { name: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'AI Learning Assistant', path: '/student/chat', icon: MessageSquare },
    { name: 'Smart Study Planner', path: '/student/study-planner', icon: CalendarDays },
    { name: 'AI Quiz Generator', path: '/student/quiz', icon: HelpCircle },
    { name: 'Notes Summarizer', path: '/student/notes', icon: FileText },
    { name: 'Career Guidance', path: '/student/career', icon: Compass },
    { name: 'Interview Preparation', path: '/student/interview', icon: Briefcase },
    { name: 'My Progress', path: '/student/progress', icon: TrendingUp },
    { name: 'Profile & Settings', path: '/student/profile', icon: User }
  ];

  // Admin Navigation Items
  const adminNav = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Mentor Management', path: '/admin/mentors', icon: GraduationCap },
    { name: 'Content Management', path: '/admin/content', icon: Layers },
    { name: 'Quiz Management', path: '/admin/quizzes', icon: CheckSquare },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: FileSpreadsheet },
    { name: 'Admin Profile', path: '/admin/profile', icon: User }
  ];

  // Mentor Navigation Items
  const mentorNav = [
    { name: 'Overview', path: '/mentor/dashboard', icon: LayoutDashboard },
    { name: 'My Students', path: '/mentor/students', icon: Users },
    { name: 'Learning Resources', path: '/mentor/resources', icon: BookOpen },
    { name: 'Student Feedback', path: '/mentor/feedback', icon: Award },
    { name: 'Mentor Profile', path: '/mentor/profile', icon: User }
  ];

  let currentNav = studentNav;
  let roleTitle = 'Student Portal';
  let roleBadgeClass = 'badge-primary';

  if (role === 'ADMIN') {
    currentNav = adminNav;
    roleTitle = 'Admin Portal';
    roleBadgeClass = 'badge-danger';
  } else if (role === 'MENTOR') {
    currentNav = mentorNav;
    roleTitle = 'Mentor Portal';
    roleBadgeClass = 'badge-success';
  }

  const currentItem = currentNav.find(item => item.path === location.pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar Overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 40
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.08)'
        }}
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '70px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1E293B'
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                SKILLMATE <span style={{ fontSize: '0.65rem', background: 'var(--primary)', padding: '2px 5px', borderRadius: '4px' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{roleTitle}</div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="mobile-close-btn"
            style={{ color: '#94A3B8', display: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Quick Info */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#1E293B',
            margin: '12px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              shrink: 0
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className={`badge ${roleBadgeClass}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#1E293B';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={18} color={isActive ? '#FFFFFF' : '#94A3B8'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1E293B' }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              color: '#F87171',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="dashboard-main-area">
        {/* Top Header */}
        <header
          style={{
            height: '70px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="dashboard-hamburger-btn"
              style={{
                display: 'none',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                color: '#0F172A'
              }}
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748B' }}>
                <span>{roleTitle}</span>
                <ChevronRight size={14} />
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{currentItem?.name || 'Dashboard'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* AI Engine Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: '#EEF2FF',
                border: '1px solid #C7D2FE',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#4F46E5'
              }}
            >
              <Sparkles size={14} />
              <span>Smart Assistant Active</span>
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="user-text-pill">
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{role}</div>
                </div>
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '220px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-elevated)',
                    border: '1px solid #E2E8F0',
                    padding: '8px',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{user?.email}</div>
                  </div>

                  <Link
                    to={`/${role.toLowerCase()}/profile`}
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#334155',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={logout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#EF4444',
                      fontWeight: 600,
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic Page Body */}
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-main-area {
            margin-left: 0 !important;
          }
          .dashboard-hamburger-btn {
            display: inline-flex !important;
          }
          .mobile-close-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 640px) {
          .user-text-pill {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
