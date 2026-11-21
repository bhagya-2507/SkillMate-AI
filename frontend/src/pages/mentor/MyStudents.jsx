import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  MessageSquare,
  Award,
  Target,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const MyStudents = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Feedback Modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [studentToFeedback, setStudentToFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/mentor/students');
      if (res.success) {
        setStudents(res.students || []);
      }
    } catch (err) {
      toast.error('Failed to load assigned students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openFeedback = (st) => {
    setStudentToFeedback(st);
    setFeedbackText('');
    setFeedbackModalOpen(true);
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || feedbackText.trim().length < 10) {
      toast.error('Feedback must be at least 10 characters long.');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const res = await api.post('/mentor/feedback', {
        student_id: studentToFeedback.id,
        feedback: feedbackText.trim()
      });
      if (res.success) {
        toast.success(`Feedback delivered to ${studentToFeedback.name}!`);
        setFeedbackModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          My Assigned Students
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Inspect individual student study plan completions, quiz performance metrics, and submit recommendations
        </p>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', maxWidth: '440px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or email..."
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Students List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner spinner-dark" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B' }}>
          <Users size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            No Students Found
          </h3>
          <p style={{ fontSize: '0.875rem' }}>No assigned students match your search filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map((st) => (
            <div key={st.id} className="card card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{st.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{st.email}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Degree:</strong> {st.education || 'B.Tech Computer Science'}</div>
                  <div><strong>College:</strong> {st.college || 'Metro State University'}</div>
                  <div><strong>Interests:</strong> {st.interests || 'Full-Stack & Cloud'}</div>
                </div>

                {/* Progress Indicators */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Plan Completion</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                      {st.planCompletion}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Avg Quiz Score</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                      {st.avgQuizScore}%
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openFeedback(st)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                <MessageSquare size={16} />
                <span>Provide Feedback & Advice</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Give Feedback Modal */}
      {feedbackModalOpen && studentToFeedback && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            padding: '20px'
          }}
        >
          <div className="card animate-fade-in" style={{ maxWidth: '500px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Academic Feedback: {studentToFeedback.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Your feedback will be delivered directly to the student's dashboard and recorded in MySQL.
            </p>

            <form onSubmit={handleSendFeedback}>
              <div className="form-group">
                <label className="form-label" htmlFor="feed_text">Mentor Recommendations & Feedback <span className="required">*</span></label>
                <textarea
                  id="feed_text"
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide concrete suggestions, praise good study habits, or recommend specific topics to revise..."
                  className="form-textarea"
                  disabled={isSubmittingFeedback}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isSubmittingFeedback}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmittingFeedback ? 'btn-disabled' : ''}`}
                  disabled={isSubmittingFeedback}
                >
                  {isSubmittingFeedback ? <div className="spinner" /> : 'Deliver Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStudents;
