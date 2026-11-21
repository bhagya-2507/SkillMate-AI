import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CheckSquare, Award, BookOpen, Layers } from 'lucide-react';

const QuizManagement = () => {
  const toast = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.success && res.report) {
          setQuizzes(res.report.topQuizzes || []);
        }
      } catch (err) {
        toast.error('Failed to load quiz reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          Platform Quiz Management & Oversight
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Monitor assessment distribution, examine performance standards, and review question metrics
        </p>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          Top Attempted Assessments
        </h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="spinner spinner-dark" />
          </div>
        ) : quizzes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
            No quizzes generated on the platform yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '12px 14px' }}>Subject</th>
                  <th style={{ padding: '12px 14px' }}>Topic</th>
                  <th style={{ padding: '12px 14px' }}>Difficulty</th>
                  <th style={{ padding: '12px 14px' }}>Average Score</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{q.subject}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{q.topic}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral">{q.difficulty}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${q.score >= 80 ? 'badge-success' : 'badge-warning'}`}>
                        {q.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;
