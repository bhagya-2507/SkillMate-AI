import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Compass,
  Sparkles,
  TrendingUp,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const CareerGuidance = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    interests: user?.interests || 'Full-Stack Web Development, Cloud Architecture, AI Systems',
    skills: 'JavaScript, React, Node.js, SQL, REST APIs, Git',
    education: user?.education || 'B.Tech in Computer Science & Engineering',
    goals: 'Securing a high-growth Software Development Engineer (SDE) position at a top tech company'
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRoadmap, setCurrentRoadmap] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/career-history');
      if (res.success) {
        setHistory(res.history || []);
        if (res.history?.length > 0 && !currentRoadmap) {
          setCurrentRoadmap(res.history[0]);
        }
      }
    } catch (err) {
      console.warn('Career history fetch error:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.interests.trim()) errs.interests = 'Please specify your interests.';
    if (!formData.skills.trim()) errs.skills = 'Please list your current skills.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in required fields.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.post('/ai/career-guidance', formData);
      if (res.success && res.recommendation) {
        toast.success('Personalized career roadmap generated!');
        setCurrentRoadmap(res.recommendation);
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate career guidance.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          AI Career Guidance & Roadmaps
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Discover high-impact software engineering roles, bridge your skillset gaps, and map out placement strategies
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Profile Input Card */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Compass size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>Your Career Profile</h2>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Tell us about your aspirations & background</div>
            </div>
          </div>

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label" htmlFor="interests">
                Interests & Passions <span className="required">*</span>
              </label>
              <textarea
                id="interests"
                rows={2}
                value={formData.interests}
                onChange={(e) => {
                  setFormData({ ...formData, interests: e.target.value });
                  if (errors.interests) setErrors({ ...errors, interests: null });
                }}
                placeholder="e.g. Full-Stack Web Development, Cloud Architecture, AI Systems"
                className={`form-textarea ${errors.interests ? 'error' : ''}`}
                disabled={isGenerating}
              />
              {errors.interests && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{errors.interests}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skills">
                Current Skills & Tools <span className="required">*</span>
              </label>
              <textarea
                id="skills"
                rows={2}
                value={formData.skills}
                onChange={(e) => {
                  setFormData({ ...formData, skills: e.target.value });
                  if (errors.skills) setErrors({ ...errors, skills: null });
                }}
                placeholder="e.g. JavaScript, React, Node.js, SQL, REST APIs, Git"
                className={`form-textarea ${errors.skills ? 'error' : ''}`}
                disabled={isGenerating}
              />
              {errors.skills && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{errors.skills}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="education">Education & Degree</label>
              <input
                id="education"
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="form-input"
                disabled={isGenerating}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="goals">Target Goals</label>
              <textarea
                id="goals"
                rows={2}
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="e.g. Cracking campus technical placements, becoming an AI engineer"
                className="form-textarea"
                disabled={isGenerating}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-gradient ${isGenerating ? 'btn-disabled' : ''}`}
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner" />
                  <span>Analyzing Skills & Synthesizing Roadmap with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Career Roadmap</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved Roadmaps Drawer */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Saved Career Plans
          </h2>

          {loadingHistory ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner spinner-dark" />
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94A3B8', fontSize: '0.9rem' }}>
              No career plans saved yet. Submit your skills to generate your first roadmap.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {history.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setCurrentRoadmap(rec)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    backgroundColor: currentRoadmap?.id === rec.id ? '#EEF2FF' : '#FFFFFF',
                    transition: 'all 0.15s'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                      {rec.education || 'Career Strategy'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {new Date(rec.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Inspect</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Roadmap Viewer */}
      {currentRoadmap && (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', marginBottom: '20px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Actionable Guidance</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
              AI Career Assessment & Placement Blueprint
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
              Saved to your account on {new Date(currentRoadmap.created_at || Date.now()).toLocaleDateString()}
            </div>
          </div>

          <div
            className="markdown-content"
            style={{
              padding: '24px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap'
            }}
          >
            {currentRoadmap.recommendation}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerGuidance;
