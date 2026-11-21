import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Award, MessageSquare, Send, Clock, User, CheckCircle2 } from 'lucide-react';

const StudentFeedback = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [stRes, fbRes] = await Promise.all([
        api.get('/mentor/students'),
        api.get('/mentor/feedback')
      ]);

      if (stRes.success) setStudents(stRes.students || []);
      if (fbRes.success) setFeedbacks(fbRes.feedbacks || []);
    } catch (err) {
      toast.error('Failed to load mentor feedback data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error('Please choose a student.');
      return;
    }
    if (!feedbackText.trim() || feedbackText.trim().length < 10) {
      toast.error('Feedback must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/mentor/feedback', {
        student_id: parseInt(selectedStudentId, 10),
        feedback: feedbackText.trim()
      });

      if (res.success) {
        toast.success(res.message || 'Feedback submitted successfully!');
        setFeedbackText('');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Unable to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          Student Feedback & Recommendations
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Provide tailored feedback to enhance your students' preparation and academic retention
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Submit Form Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '18px' }}>
            Compose Student Feedback
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="feed_student">Select Student <span className="required">*</span></label>
              <select
                id="feed_student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="form-select"
                disabled={isSubmitting}
                required
              >
                <option value="">-- Choose Assigned Student --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>{st.name} ({st.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="feed_content">Feedback & Recommendations <span className="required">*</span></label>
              <textarea
                id="feed_content"
                rows={5}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Give constructive recommendations on study plans, quiz performance, or interview techniques (min 10 characters)..."
                className="form-textarea"
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-gradient ${isSubmitting ? 'btn-disabled' : ''}`}
              style={{ width: '100%', padding: '12px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Submitting Feedback...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feedback History Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Past Feedback History
          </h2>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner spinner-dark" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
              No feedbacks sent yet. Select a student to start mentoring.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {feedbacks.map((fb) => (
                <div key={fb.id} style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                      To: {fb.student?.name || 'Student'}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {new Date(fb.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6', fontStyle: 'italic' }}>
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

export default StudentFeedback;
