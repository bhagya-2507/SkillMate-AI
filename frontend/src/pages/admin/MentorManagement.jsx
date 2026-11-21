import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  UserPlus,
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';

const MentorManagement = () => {
  const toast = useToast();
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Mentor Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    password: '',
    education: 'M.Tech Software Engineering',
    interests: 'Distributed Systems & Cloud Computing'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assign Mentor Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchMentorsAndStudents = async () => {
    try {
      const [mentorRes, studentRes] = await Promise.all([
        api.get('/admin/users?role=MENTOR&limit=50'),
        api.get('/admin/users?role=STUDENT&limit=50')
      ]);

      if (mentorRes.success) setMentors(mentorRes.users || []);
      if (studentRes.success) setStudents(studentRes.users || []);
    } catch (err) {
      toast.error('Failed to load mentor and student rosters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsAndStudents();
  }, []);

  const validateMentorForm = () => {
    const errs = {};
    if (!newMentor.name.trim()) errs.name = 'Full name is required.';
    if (!newMentor.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMentor.email.trim())) {
      errs.email = 'Valid email is required.';
    }
    if (!newMentor.password || newMentor.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddMentor = async (e) => {
    e.preventDefault();
    if (!validateMentorForm()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/admin/mentors', newMentor);
      if (res.success) {
        toast.success(res.message || 'Mentor registered successfully.');
        setShowAddModal(false);
        setNewMentor({
          name: '',
          email: '',
          password: '',
          education: 'M.Tech Software Engineering',
          interests: 'Distributed Systems & Cloud Computing'
        });
        fetchMentorsAndStudents();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create mentor account.');
      if (err.errors) setFormErrors(err.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    if (!selectedMentorId || !selectedStudentId) {
      toast.error('Please choose both a mentor and a student.');
      return;
    }

    setIsAssigning(true);
    try {
      const res = await api.post('/admin/assign-mentor', {
        mentor_id: parseInt(selectedMentorId, 10),
        student_id: parseInt(selectedStudentId, 10)
      });
      if (res.success) {
        toast.success(res.message || 'Mentor assigned to student!');
        setShowAssignModal(false);
      }
    } catch (err) {
      toast.error(err.message || 'Assignment failed.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Mentor Roster & Assignments
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            Onboard academic advisors and pair mentors with undergraduate students
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowAssignModal(true)}
            className="btn btn-secondary"
            style={{ padding: '10px 18px' }}
          >
            <LinkIcon size={16} />
            <span>Assign Student</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <UserPlus size={16} />
            <span>Onboard Mentor</span>
          </button>
        </div>
      </div>

      {/* Mentor Cards Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner spinner-dark" />
        </div>
      ) : mentors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <GraduationCap size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            No Mentor Accounts Found
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px' }}>
            Onboard academic mentors and instructors to provide personalized guidance to enrolled college students.
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            Onboard First Mentor
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {mentors.map((m) => (
            <div key={m.id} className="card card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>{m.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{m.email}</div>
                  <span className="badge badge-success" style={{ marginTop: '4px' }}>Faculty Mentor</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', fontSize: '0.85rem', color: '#475569' }}>
                <div><strong>Qualification:</strong> {m.education || 'Senior Faculty'}</div>
                <div style={{ marginTop: '4px' }}><strong>Specialization:</strong> {m.interests || 'Computer Science'}</div>
                <div style={{ marginTop: '4px' }}><strong>Status:</strong> {m.is_active ? 'Active' : 'Suspended'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onboard Mentor Modal */}
      {showAddModal && (
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
          <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Onboard New Mentor
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Admin provisioned mentor credentials. Password will be securely hashed with bcrypt.
            </p>

            <form onSubmit={handleAddMentor}>
              <div className="form-group">
                <label className="form-label" htmlFor="m_name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="m_name"
                  type="text"
                  value={newMentor.name}
                  onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                  placeholder="e.g. Prof. Alan Turing"
                  className="form-input"
                  disabled={isSubmitting}
                />
                {formErrors.name && <div className="field-error"><AlertCircle size={14} /><span>{formErrors.name}</span></div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="m_email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="m_email"
                  type="email"
                  value={newMentor.email}
                  onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                  placeholder="e.g. mentor@skillmate.ai"
                  className="form-input"
                  disabled={isSubmitting}
                />
                {formErrors.email && <div className="field-error"><AlertCircle size={14} /><span>{formErrors.email}</span></div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="m_pass">
                  Temporary Password <span className="required">*</span>
                </label>
                <input
                  id="m_pass"
                  type="password"
                  value={newMentor.password}
                  onChange={(e) => setNewMentor({ ...newMentor, password: e.target.value })}
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  className="form-input"
                  disabled={isSubmitting}
                />
                {formErrors.password && <div className="field-error"><AlertCircle size={14} /><span>{formErrors.password}</span></div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="m_edu">Academic Qualifications</label>
                <input
                  id="m_edu"
                  type="text"
                  value={newMentor.education}
                  onChange={(e) => setNewMentor({ ...newMentor, education: e.target.value })}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="m_int">Specialization Areas</label>
                <input
                  id="m_int"
                  type="text"
                  value={newMentor.interests}
                  onChange={(e) => setNewMentor({ ...newMentor, interests: e.target.value })}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <div className="spinner" /> : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Mentor Modal */}
      {showAssignModal && (
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
          <div className="card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Pair Mentor with Student
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Establish formal mentorship linkage in the <code>mentor_assignments</code> table.
            </p>

            <form onSubmit={handleAssignMentor}>
              <div className="form-group">
                <label className="form-label" htmlFor="sel_mentor">Select Mentor</label>
                <select
                  id="sel_mentor"
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Faculty Mentor --</option>
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sel_student">Select Student</label>
                <select
                  id="sel_student"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="btn btn-secondary"
                  disabled={isAssigning}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isAssigning ? 'btn-disabled' : ''}`}
                  disabled={isAssigning}
                >
                  {isAssigning ? <div className="spinner" /> : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;
