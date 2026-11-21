import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  Clock,
  CheckCircle2,
  Flame,
  Target,
  Brain,
  Calendar,
  HelpCircle,
  FileText,
  Compass,
  Briefcase,
  ArrowRight,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const Overview = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalHours: 8.5,
      completedQuizzes: 0,
      avgQuizScore: 0,
      currentStreak: 1,
      planCompletionRate: 0,
      totalPlans: 0
    },
    weeklyActivity: [],
    upcomingTasks: [],
    recentActivities: []
  });

  const fetchOverview = async () => {
    try {
      const res = await api.get('/progress/overview');
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.warn('Overview fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const res = await api.put(`/study-plans/tasks/${taskId}/complete`, {
        is_completed: !currentStatus
      });
      if (res.success) {
        toast.success(res.message);
        fetchOverview();
      }
    } catch (err) {
      toast.error(err.message || 'Unable to update task status.');
    }
  };

  const aiTools = [
    { name: 'AI Tutor Chat', desc: 'Ask subject questions and clear concepts', path: '/student/chat', icon: Brain, color: '#4F46E5', bg: '#EEF2FF' },
    { name: 'Study Planner', desc: 'Generate daily exam preparation roadmaps', path: '/student/study-planner', icon: Calendar, color: '#0284C7', bg: '#E0F2FE' },
    { name: 'AI Quiz Maker', desc: 'Test skills with multiple choice quizzes', path: '/student/quiz', icon: HelpCircle, color: '#10B981', bg: '#ECFDF5' },
    { name: 'Notes Summarizer', desc: 'Convert PDF/TXT notes to exam summaries', path: '/student/notes', icon: FileText, color: '#8B5CF6', bg: '#F5F3FF' },
    { name: 'Career Guidance', desc: 'Explore tech roles, roadmaps & skills', path: '/student/career', icon: Compass, color: '#F59E0B', bg: '#FFFBEB' },
    { name: 'Interview Prep', desc: 'Practice mock technical interview answers', path: '/student/interview', icon: Briefcase, color: '#EC4899', bg: '#FDF2F8' }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="spinner spinner-dark" style={{ width: '32px', height: '32px' }} />
      </div>
    );
  }

  const { stats, weeklyActivity, upcomingTasks, recentActivities } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'var(--gradient-primary)',
          color: '#FFFFFF',
          padding: '28px 32px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
            🎓 Student Learning Portal
          </span>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '4px', letterSpacing: '-0.5px' }}>
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '6px', maxWidth: '600px' }}>
            You're currently on a <strong>{stats.currentStreak}-day learning streak</strong>. Keep up the consistent momentum to ace your college exams and campus placements!
          </p>
        </div>

        <Link
          to="/student/chat"
          className="btn"
          style={{
            backgroundColor: '#FFFFFF',
            color: 'var(--primary)',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Brain size={18} />
          <span>Ask AI Assistant</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard
          title="Total Learning Hours"
          value={`${stats.totalHours} hrs`}
          icon={Clock}
          color="#4F46E5"
          bgLight="#EEF2FF"
          subtitle="Estimated study time"
          trend="+2.5 hrs this week"
        />
        <StatCard
          title="Quizzes Completed"
          value={stats.completedQuizzes}
          icon={CheckCircle2}
          color="#10B981"
          bgLight="#ECFDF5"
          subtitle={stats.avgQuizScore > 0 ? `${stats.avgQuizScore}% Avg Score` : 'No attempts yet'}
        />
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} Days`}
          icon={Flame}
          color="#F59E0B"
          bgLight="#FFFBEB"
          subtitle="Consecutive study activity"
        />
        <StatCard
          title="Study Plan Progress"
          value={`${stats.planCompletionRate}%`}
          icon={Target}
          color="#0284C7"
          bgLight="#E0F2FE"
          subtitle={`${stats.totalPlans} Active study plans`}
        />
      </div>

      {/* Main Content Grid: Chart + Upcoming Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Weekly Activity Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Weekly Study Hours</h2>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Time spent studying across days</div>
            </div>
            <span className="badge badge-primary">Daily Metrics</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} unit="h" />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '0.85rem' }}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Study Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Tasks Card */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Upcoming Study Tasks</h2>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Milestones from your active study plans</div>
            </div>
            <Link to="/student/study-planner" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {upcomingTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: '#64748B' }}>
              <CalendarDays size={36} color="#CBD5E1" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: '0.9rem' }}>No pending tasks right now!</p>
              <Link to="/student/study-planner" className="btn btn-primary" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem' }}>
                Create Study Plan
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => handleToggleTask(t.id, false)}
                    style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {t.task_title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span className="badge badge-neutral" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>{t.subject}</span>
                      <span>Due: {t.task_date || 'Upcoming'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Access AI Tools */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>Quick AI Modules</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Launch your preferred learning or career tool</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          {aiTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link key={idx} to={tool.path} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: tool.bg, color: tool.color, display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                  <Icon size={22} color={tool.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{tool.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{tool.desc}</div>
                </div>
                <ArrowRight size={16} color="#94A3B8" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activities Feed */}
      {recentActivities.length > 0 && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Recent Learning Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < recentActivities.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>{act.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{act.description}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {new Date(act.time).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
