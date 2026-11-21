import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  Users,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorDashboard = async () => {
      try {
        const res = await api.get('/mentor/dashboard');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Mentor dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="spinner spinner-dark" />
      </div>
    );
  }

  const stats = data?.stats || {
    assignedStudentsCount: 0,
    resourcesCount: 0,
    feedbacksCount: 0
  };

  const students = data?.students || [];
  const recentFeedbacks = data?.recentFeedbacks || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '6px' }}>Academic Mentorship</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Mentor Guidance Portal
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            Monitor assigned students, review study plans, curate learning resources, and deliver structured feedback
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/mentor/resources" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <BookOpen size={16} />
            <span>Publish Resource</span>
          </Link>
          <Link to="/mentor/feedback" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <Award size={16} />
            <span>Give Student Feedback</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard
          title="Assigned Students"
          value={stats.assignedStudentsCount}
          icon={Users}
          color="#10B981"
          bgLight="#ECFDF5"
          subtitle="Mentored undergraduate learners"
        />
        <StatCard
          title="Published Resources"
          value={stats.resourcesCount}
          icon={BookOpen}
          color="#4F46E5"
          bgLight="#EEF2FF"
          subtitle="Curated documentation & guides"
        />
        <StatCard
          title="Feedbacks Delivered"
          value={stats.feedbacksCount}
          icon={Award}
          color="#F59E0B"
          bgLight="#FFFBEB"
          subtitle="Direct student evaluations"
        />
      </div>

      {/* Mentored Students & Recent Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Mentored Students Preview */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>My Assigned Students</h2>
            <Link to="/mentor/students" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View Roster
            </Link>
          </div>

          {students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
              No students assigned yet. Contact administrator for pairing.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {students.map((st) => (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>{st.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{st.email}</div>
                    </div>
                  </div>
                  <Link to="/mentor/feedback" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    Feedback
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Feedback Feed */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Recent Feedback Provided</h2>
            <Link to="/mentor/feedback" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              All Feedback
            </Link>
          </div>

          {recentFeedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
              No feedback submitted yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentFeedbacks.map((fb) => (
                <div key={fb.id} style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                      To: {fb.student?.name || 'Student'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {new Date(fb.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', fontStyle: 'italic' }}>
                    "{fb.feedback}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
