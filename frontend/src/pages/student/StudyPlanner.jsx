import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Calendar,
  AlertCircle,
  BookOpen
} from 'lucide-react';

const StudyPlanner = () => {
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    target_date: '',
    daily_hours: '2.0',
    difficulty: 'Beginner'
  });
  const [errors, setErrors] = useState({});

  // Deletion Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/study-plans');
      if (res.success) {
        setPlans(res.plans);
      }
    } catch (err) {
      console.warn('Plans fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required.';
    }
    if (!formData.topic.trim()) {
      errs.topic = 'Topic is required.';
    }
    if (!formData.target_date) {
      errs.target_date = 'Target completion date is required.';
    } else {
      const target = new Date(formData.target_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (target < today) {
        errs.target_date = 'Target date cannot be in the past.';
      }
    }
    const hours = parseFloat(formData.daily_hours);
    if (isNaN(hours) || hours < 0.5 || hours > 16) {
      errs.daily_hours = 'Daily study hours must be between 0.5 and 16 hours.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the form errors.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.post('/study-plans', {
        ...formData,
        daily_hours: parseFloat(formData.daily_hours)
      });
      if (res.success) {
        toast.success(res.message || 'Personalized study plan created!');
        setShowCreateModal(false);
        setFormData({
          subject: '',
          topic: '',
          target_date: '',
          daily_hours: '2.0',
          difficulty: 'Beginner'
        });
        fetchPlans();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate study plan.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const res = await api.put(`/study-plans/tasks/${taskId}/complete`, {
        is_completed: !currentStatus
      });
      if (res.success) {
        toast.success(res.message);
        fetchPlans();
      }
    } catch (err) {
      toast.error(err.message || 'Error updating task.');
    }
  };

  const confirmDeletePlan = (plan) => {
    setPlanToDelete(plan);
    setDeleteModalOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    try {
      const res = await api.delete(`/study-plans/${planToDelete.id}`);
      if (res.success) {
        toast.success('Study plan deleted successfully.');
        setDeleteModalOpen(false);
        fetchPlans();
      }
    } catch (err) {
      toast.error(err.message || 'Unable to delete study plan.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Smart Study Planner
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            AI-generated structured daily preparation schedules for college exams
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-gradient"
          style={{ padding: '10px 20px' }}
        >
          <Plus size={18} />
          <span>New Study Plan</span>
        </button>
      </div>

      {/* Plans List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner spinner-dark" />
        </div>
      ) : plans.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <CalendarDays size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            No Active Study Plans Found
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px', lineHeight: '1.6' }}>
            Prepare systematically for upcoming college exams. Tell SkillMate AI your target subject and date to generate a day-wise curriculum.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-gradient"
            style={{ padding: '10px 22px' }}
          >
            <Plus size={16} />
            <span>Generate Your First Study Plan</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {plans.map((p) => (
            <div key={p.id} className="card" style={{ padding: '24px' }}>
              {/* Plan Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{p.title}</h2>
                    <span className="badge badge-primary">{p.subject}</span>
                    <span className={`badge ${p.difficulty === 'Advanced' ? 'badge-danger' : p.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-success'}`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '16px', marginTop: '6px' }}>
                    <span>Target Date: <strong>{p.target_date}</strong></span>
                    <span>Daily Hours: <strong>{p.daily_hours} hrs/day</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {p.completionPercentage}% Done
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {p.completedTasks} / {p.totalTasks} Tasks
                    </div>
                  </div>
                  <button
                    onClick={() => confirmDeletePlan(p)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', color: '#EF4444' }}
                    title="Delete Study Plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '20px' }}>
                <div
                  style={{
                    width: `${p.completionPercentage}%`,
                    height: '100%',
                    background: 'var(--gradient-primary)',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              {/* Day-Wise Tasks */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  Daily Action Milestones
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(p.tasks || []).map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        backgroundColor: task.is_completed ? '#F8FAFC' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: task.is_completed ? '#E2E8F0' : '#CBD5E1',
                        borderRadius: '10px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => handleToggleTask(task.id, task.is_completed)}
                        style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.925rem',
                            fontWeight: 600,
                            color: task.is_completed ? '#94A3B8' : '#0F172A',
                            textDecoration: task.is_completed ? 'line-through' : 'none'
                          }}
                        >
                          {task.task_title}
                        </div>
                        {task.task_description && (
                          <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '3px', lineHeight: '1.5' }}>
                            {task.task_description}
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                          Target: {task.task_date || 'Day Milestone'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
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
          <div
            className="card animate-fade-in"
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-elevated)',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Generate AI Study Plan</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ color: '#94A3B8', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleCreatePlan}>
              {/* Quick B.Tech Exam Plan Presets */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  ⚡ Quick B.Tech Subjects (Click to Auto-fill):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    { s: 'Operating Systems', t: 'Process Sync, Semaphores & Virtual Memory', label: 'OS' },
                    { s: 'Database Management Systems', t: 'SQL Joins, Normalization & ACID Transactions', label: 'DBMS' },
                    { s: 'Data Structures & Algorithms', t: 'Binary Search Trees, Graphs & Dynamic Programming', label: 'DSA' },
                    { s: 'Computer Networks', t: 'OSI Reference Model, TCP/IP & Congestion Control', label: 'Networks' },
                    { s: 'Object Oriented Programming', t: 'Inheritance, Polymorphism & Design Patterns in Java', label: 'OOPs (Java)' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, subject: item.s, topic: item.t }));
                        setErrors({});
                      }}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '9999px',
                        border: '1px solid #CBD5E1',
                        background: '#F8FAFC',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plan_subject">
                  Subject Name <span className="required">*</span>
                </label>
                <input
                  id="plan_subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (errors.subject) setErrors({ ...errors, subject: null });
                  }}
                  placeholder="e.g. Database Management Systems"
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                  disabled={isGenerating}
                />
                {errors.subject && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.subject}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plan_topic">
                  Core Topic / Focus Areas <span className="required">*</span>
                </label>
                <input
                  id="plan_topic"
                  type="text"
                  value={formData.topic}
                  onChange={(e) => {
                    setFormData({ ...formData, topic: e.target.value });
                    if (errors.topic) setErrors({ ...errors, topic: null });
                  }}
                  placeholder="e.g. Normalization, B+ Trees & Transaction Concurrency"
                  className={`form-input ${errors.topic ? 'error' : ''}`}
                  disabled={isGenerating}
                />
                {errors.topic && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.topic}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="target_date">
                    Exam / Target Date <span className="required">*</span>
                  </label>
                  <input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => {
                      setFormData({ ...formData, target_date: e.target.value });
                      if (errors.target_date) setErrors({ ...errors, target_date: null });
                    }}
                    className={`form-input ${errors.target_date ? 'error' : ''}`}
                    disabled={isGenerating}
                  />
                  {errors.target_date && (
                    <div className="field-error">
                      <AlertCircle size={14} />
                      <span>{errors.target_date}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="daily_hours">Daily Study Hours</label>
                  <input
                    id="daily_hours"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="16"
                    value={formData.daily_hours}
                    onChange={(e) => setFormData({ ...formData, daily_hours: e.target.value })}
                    className="form-input"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="form-select"
                  disabled={isGenerating}
                >
                  <option value="Beginner">Beginner (Foundations & Basics)</option>
                  <option value="Intermediate">Intermediate (Core Concepts & Practice)</option>
                  <option value="Advanced">Advanced (Complex Edge Cases & Deep Theory)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-gradient ${isGenerating ? 'btn-disabled' : ''}`}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner" />
                      <span>Architecting Plan with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate Study Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePlan}
        title="Delete Study Plan"
        message="Are you sure you want to delete this study plan? All day-wise task milestones and completion history will be removed from your database."
        confirmText="Delete Plan"
        isDanger={true}
      />
    </div>
  );
};

export default StudyPlanner;
