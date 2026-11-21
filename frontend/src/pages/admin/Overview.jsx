import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  Users,
  GraduationCap,
  Activity,
  CheckSquare,
  CalendarDays,
  Mail,
  ShieldCheck,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Admin dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="spinner spinner-dark" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalStudents: 0,
    totalMentors: 0,
    activeUsers: 0,
    totalQuizzes: 0,
    totalStudyPlans: 0,
    totalContactMessages: 0
  };

  const growthChart = data?.growthChart || [];
  const recentUsers = data?.recentUsers || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: '6px' }}>Administrator Hub</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Platform Control & Analytics
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            System-wide user metrics, database records, and active academic engagements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/mentors" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <UserPlus size={16} />
            <span>Add Mentor</span>
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <span>Export Reports</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="#4F46E5"
          bgLight="#EEF2FF"
          subtitle="Enrolled learners"
        />
        <StatCard
          title="Active Mentors"
          value={stats.totalMentors}
          icon={GraduationCap}
          color="#10B981"
          bgLight="#ECFDF5"
          subtitle="Assigned faculty"
        />
        <StatCard
          title="Quizzes Attempted"
          value={stats.totalQuizAttempts || stats.totalQuizzes}
          icon={CheckSquare}
          color="#0284C7"
          bgLight="#E0F2FE"
          subtitle="Assessment tests"
        />
        <StatCard
          title="Active Study Plans"
          value={stats.totalStudyPlans}
          icon={CalendarDays}
          color="#F59E0B"
          bgLight="#FFFBEB"
          subtitle="Generated curricula"
        />
        <StatCard
          title="Contact Inquiries"
          value={stats.totalContactMessages}
          icon={Mail}
          color="#EC4899"
          bgLight="#FDF2F8"
          subtitle="Saved messages"
        />
      </div>

      {/* Growth Chart */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Platform Adoption Growth</h2>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Cumulative student onboarding and quiz evaluations</div>
          </div>
          <span className="badge badge-primary">Monthly Trend</span>
        </div>

        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthChart}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '0.85rem' }} />
              <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" name="Students" />
              <Area type="monotone" dataKey="quizzes" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorQuizzes)" name="Quiz Attempts" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Recent User Signups</h2>
          <Link to="/admin/users" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            Manage All Users
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '12px 14px' }}>User</th>
                <th style={{ padding: '12px 14px' }}>Role</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                    <div>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 400 }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'MENTOR' ? 'badge-success' : 'badge-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${u.is_active ? 'badge-success' : 'badge-neutral'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94A3B8', fontSize: '0.8rem' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
