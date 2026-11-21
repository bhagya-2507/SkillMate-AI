import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const MyProgress = () => {
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, subRes, actRes] = await Promise.all([
          api.get('/progress/overview'),
          api.get('/progress/subjects'),
          api.get('/progress/activity')
        ]);

        if (ovRes.success) setOverview(ovRes);
        if (subRes.success) setSubjects(subRes.subjectStats || []);
        if (actRes.success) setActivity(actRes.activity || []);
      } catch (err) {
        console.warn('Progress fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="spinner spinner-dark" />
      </div>
    );
  }

  const stats = overview?.stats || {
    totalHours: 12.5,
    completedQuizzes: 4,
    avgQuizScore: 85,
    currentStreak: 4,
    planCompletionRate: 75
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          My Academic Analytics & Progress
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Comprehensive view of your study hours, quiz mastery, and subject proficiency
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard
          title="Total Study Hours"
          value={`${stats.totalHours} hrs`}
          icon={Clock}
          color="#4F46E5"
          bgLight="#EEF2FF"
          subtitle="Hours dedicated this semester"
        />
        <StatCard
          title="Average Quiz Score"
          value={`${stats.avgQuizScore}%`}
          icon={Award}
          color="#10B981"
          bgLight="#ECFDF5"
          subtitle={`${stats.completedQuizzes} Quizzes taken`}
        />
        <StatCard
          title="Plan Completion"
          value={`${stats.planCompletionRate}%`}
          icon={Target}
          color="#0284C7"
          bgLight="#E0F2FE"
          subtitle="Milestones achieved"
        />
        <StatCard
          title="Active Streak"
          value={`${stats.currentStreak} Days`}
          icon={TrendingUp}
          color="#F59E0B"
          bgLight="#FFFBEB"
          subtitle="Consistency multiplier"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Subject-Wise Performance Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
              Subject-Wise Average Quiz Scores
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Evaluated across your attempted tests
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjects} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="#94A3B8" fontSize={12} />
                <YAxis dataKey="subject" type="category" stroke="#94A3B8" fontSize={11} width={130} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '0.85rem' }}
                />
                <Bar dataKey="averageScore" fill="#4F46E5" radius={[0, 6, 6, 0]} name="Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Trend */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
              Study Hours & Quiz Activity Trend
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Monthly learning volume progression
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '0.85rem' }}
                />
                <Legend />
                <Line type="monotone" dataKey="studyHours" stroke="#4F46E5" strokeWidth={3} name="Study Hours" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="quizzes" stroke="#10B981" strokeWidth={2} name="Quizzes Taken" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          Subject Mastery Summary
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '12px 14px' }}>Subject</th>
                <th style={{ padding: '12px 14px' }}>Total Quizzes</th>
                <th style={{ padding: '12px 14px' }}>Average Mastery Score</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{sub.subject}</td>
                  <td style={{ padding: '12px 14px', color: '#64748B' }}>{sub.quizzes} tests</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{sub.averageScore}%</span>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${sub.averageScore}%`, height: '100%', backgroundColor: sub.averageScore >= 80 ? '#10B981' : '#F59E0B' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${sub.averageScore >= 80 ? 'badge-success' : 'badge-warning'}`}>
                      {sub.averageScore >= 80 ? 'Proficient' : 'In Progress'}
                    </span>
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

export default MyProgress;
