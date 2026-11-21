import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Calendar,
  HelpCircle,
  FileText,
  Compass,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Users,
  GraduationCap
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, role, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'MENTOR') return '/mentor/dashboard';
    return '/student/dashboard';
  };

  const handleQuickSwitch = async (targetRole) => {
    try {
      if (targetRole === 'STUDENT') {
        await login('student@skillmate.ai', 'Student@123');
        toast.success('Switched to Student Portal!');
        navigate('/student/dashboard');
      } else if (targetRole === 'MENTOR') {
        await login('mentor@skillmate.ai', 'Mentor@123');
        toast.success('Switched to Mentor Portal!');
        navigate('/mentor/dashboard');
      } else if (targetRole === 'ADMIN') {
        await login('admin@skillmate.ai', 'Admin@123');
        toast.success('Switched to Admin Portal!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error('Login failed. Redirecting to sign in page.');
      navigate('/login');
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI Learning Assistant',
      desc: 'Engage in natural conversations with an AI tutor that explains complex college topics in simple, intuitive steps.',
      color: '#4F46E5',
      bg: '#EEF2FF'
    },
    {
      icon: Calendar,
      title: 'Smart Study Planner',
      desc: 'Set your exam date, daily available hours, and difficulty. Get a personalized, day-by-day actionable study curriculum.',
      color: '#0284C7',
      bg: '#E0F2FE'
    },
    {
      icon: HelpCircle,
      title: 'AI Quiz Generator',
      desc: 'Instant multiple-choice quizzes with 4 options, automated scoring, and detailed explanations for every question.',
      color: '#10B981',
      bg: '#ECFDF5'
    },
    {
      icon: FileText,
      title: 'Notes & PDF Summarizer',
      desc: 'Upload study notes, lecture slides, or textbooks (PDF/TXT) to extract executive summaries, definitions, and exam checklists.',
      color: '#8B5CF6',
      bg: '#F5F3FF'
    },
    {
      icon: Compass,
      title: 'Career Guidance',
      desc: 'Input your interests, current skills, and academic goals to generate target career pathways, salary insights, and 6-month roadmaps.',
      color: '#F59E0B',
      bg: '#FFFBEB'
    },
    {
      icon: Briefcase,
      title: 'Interview Preparation',
      desc: 'Practice technical and behavioral college placement questions. Receive instant scoring and constructive feedback from AI.',
      color: '#EC4899',
      bg: '#FDF2F8'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Student Profile',
      desc: 'Sign up with your college degree and subject interests to personalize your AI models and learning metrics.'
    },
    {
      number: '02',
      title: 'Generate Personalized Plans & Quizzes',
      desc: 'Choose what you need to study today—build an exam planner, quiz yourself, or upload difficult lecture notes.'
    },
    {
      number: '03',
      title: 'Track Progress & Prepare for Placements',
      desc: 'Watch your learning streak grow, analyze subject strengths, and practice mock technical interviews for college placements.'
    }
  ];

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Final Year B.Tech CSE',
      comment: 'SkillMate AI organized my entire semester preparation. The quiz generator and study planner helped me systematically conquer Database Systems and Operating Systems.',
      rating: 5
    },
    {
      name: 'Prof. Marcus Brody',
      role: 'Faculty & Senior Tech Mentor',
      comment: 'As a mentor, having direct insight into students study plan completions and quiz analytics makes academic counseling ten times more effective.',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: '3rd Year B.Tech IT',
      comment: 'The PDF Notes Summarizer and Interview Preparation modules are exceptional. The AI feedback on my code answers feels like a real mock interview.',
      rating: 5
    }
  ];

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section
        style={{
          paddingTop: '80px',
          paddingBottom: '90px',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.25), transparent)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
              marginBottom: '24px'
            }}
          >
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              Comprehensive Academic & Placement Platform (MERN Stack)
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: '1.15',
              letterSpacing: '-1.5px',
              marginBottom: '20px'
            }}
          >
            SKILLMATE AI
            <span
              style={{
                display: 'block',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginTop: '6px'
              }}
            >
              Your Personal AI Learning & Career Assistant
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.15rem',
              color: '#475569',
              lineHeight: '1.6',
              maxWidth: '740px',
              margin: '0 auto 36px'
            }}
          >
            Built for college students to master subjects faster. Generate structured study plans,
            test knowledge with automated AI quizzes, summarize complex lecture notes, and crack technical campus placements.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="btn btn-gradient" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                <span>Access Your Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-gradient" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                  <span>Get Started for Free</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  <span>Try Demo Account</span>
                </Link>
              </>
            )}
          </div>

          {/* Platform Highlight Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '44px',
              flexWrap: 'wrap',
              fontSize: '0.85rem',
              color: '#64748B'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Three Distinct Dashboards (Student, Mentor, Admin)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Full-Stack Architecture with MongoDB & Mongoose</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Intelligent Automated Learning System</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Role Dashboards Portal Gateway */}
      <section style={{ padding: '30px 24px 60px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Multi-Role College Architecture
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', marginTop: '6px', letterSpacing: '-0.5px' }}>
              Explore All 3 Role-Based Dashboards
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px', maxWidth: '640px', margin: '8px auto 0' }}>
              SkillMate AI provides separate dedicated interfaces for Students, Faculty Mentors, and College Admins. Click any card below to launch that portal instantly:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* 1. Student Dashboard Card */}
            <div className="card" style={{ padding: '28px', border: '2px solid #C7D2FE', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: '18px', boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.1)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
                    <GraduationCap size={26} />
                  </div>
                  <div>
                    <span className="badge badge-primary">Role: STUDENT</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Student Dashboard</h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                  Complete academic companion: 24/7 AI Tutor, Smart 5-Day Study Planner, Automated Quiz Generator, Notes Summarizer, and Campus Placement Mock Interviews.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#4F46E5" />
                    <span>24/7 B.Tech Doubt Solving AI Tutor</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#4F46E5" />
                    <span>Day-wise Study Plans & Learning Streak</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#4F46E5" />
                    <span>Instant MCQs with Scoring & Explanations</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickSwitch('STUDENT')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700 }}
              >
                <span>Launch Student Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* 2. Mentor Dashboard Card */}
            <div className="card" style={{ padding: '28px', border: '2px solid #A7F3D0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: '18px', boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.1)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}>
                    <Users size={26} />
                  </div>
                  <div>
                    <span className="badge badge-success">Role: MENTOR / FACULTY</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Mentor Dashboard</h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                  Faculty supervision workspace: Track assigned students' progress, study plan completion rates, average quiz scores, and publish curated learning notes.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#059669" />
                    <span>Live Student Study Progress Monitoring</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#059669" />
                    <span>Publish Learning Resources & Links</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#059669" />
                    <span>Personalized 1-on-1 Student Guidance</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickSwitch('MENTOR')}
                className="btn"
                style={{ width: '100%', padding: '13px', justifyContent: 'center', backgroundColor: '#059669', color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}
              >
                <span>Launch Mentor Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* 3. Admin Dashboard Card */}
            <div className="card" style={{ padding: '28px', border: '2px solid #FED7AA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: '18px', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.1)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #EA580C 0%, #F59E0B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}>
                    <Shield size={26} />
                  </div>
                  <div>
                    <span className="badge badge-warning">Role: ADMINISTRATOR</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Admin Dashboard</h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                  Central college administration: Manage all users, toggle accounts, onboard faculty mentors, oversee quiz metrics, and export 1-click platform CSV audit reports.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#EA580C" />
                    <span>User Management & Role Elevation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#EA580C" />
                    <span>Platform-Wide Quiz Statistics</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#EA580C" />
                    <span>1-Click Institutional CSV Export</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleQuickSwitch('ADMIN')}
                className="btn"
                style={{ width: '100%', padding: '13px', justifyContent: 'center', backgroundColor: '#EA580C', color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}
              >
                <span>Launch Admin Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Showcase Card */}
      <section style={{ padding: '0 24px 60px' }}>
        <div
          className="container glass-card"
          style={{
            maxWidth: '1100px',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: 'var(--shadow-elevated)',
            border: '1px solid rgba(226, 232, 240, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: '10px' }}>skillmate.ai/student/dashboard</span>
            </div>
            <span className="badge badge-primary">Live Platform Showcase</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Active Learning Streak</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>4 Days 🔥</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>+1 day from yesterday</div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Quizzes Completed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>12 Tests</div>
              <div style={{ fontSize: '0.75rem', color: '#4F46E5', marginTop: '4px' }}>88% Average Score</div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Study Plan Progress</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>75% Completed</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>On track for exams</div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Total Learning Hours</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>24.5 Hrs</div>
              <div style={{ fontSize: '0.75rem', color: '#0284C7', marginTop: '4px' }}>Across 4 subjects</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#EEF2FF', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Brain size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E1B4B' }}>Discussion: "Explain B+ Tree Indexing in Databases with Real-World Examples"</div>
                <div style={{ fontSize: '0.8rem', color: '#4338CA' }}>Assistant provided structured explanations, leaf node pointer diagrams, and query speedups.</div>
              </div>
            </div>
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Try Chat Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Comprehensive Modules</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Everything You Need for Academic Excellence
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', marginTop: '12px' }}>
              Designed to address real challenges faced by undergraduate and graduate engineering students.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6', flex: 1 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Simple 3-Step Process</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              How SkillMate AI Empowers You
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {steps.map((s, idx) => (
              <div key={idx} className="card" style={{ position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#E2E8F0', position: 'absolute', top: '16px', right: '20px' }}>
                  {s.number}
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EEF2FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '16px' }}>
                  {idx + 1}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
            <span className="badge badge-success" style={{ marginBottom: '12px' }}>Verified Feedback</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>
              What College Students & Mentors Say
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '6px' }}>
              (Representative college project evaluation data)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                  "{t.comment}"
                </p>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section style={{ padding: '80px 0', background: 'var(--gradient-dark)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Ready to Accelerate Your Learning?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: '1.6', marginBottom: '32px' }}>
            Join SkillMate AI today. Sign up as a student or explore the platform using one of the pre-configured demo test accounts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-gradient" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <span>Create Free Student Account</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem', backgroundColor: '#1E293B', color: '#fff', borderColor: '#334155' }}>
              <span>Login to Demo Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
