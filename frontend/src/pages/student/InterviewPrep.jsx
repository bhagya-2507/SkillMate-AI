import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  AlertCircle
} from 'lucide-react';

const InterviewPrep = () => {
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState('Software Engineer (SDE-1)');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchQuestions = async (role) => {
    try {
      const res = await api.get(`/ai/interview-questions?jobRole=${encodeURIComponent(role)}`);
      if (res.success && res.questions?.length > 0) {
        setQuestions(res.questions);
        setSelectedQuestion(res.questions[0]);
      }
    } catch (err) {
      console.warn('Questions fetch error:', err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/interview-history');
      if (res.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      console.warn('Interview history error:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedRole);
    fetchHistory();
  }, [selectedRole]);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast.error('Please type your answer before submitting for evaluation.');
      return;
    }
    if (userAnswer.trim().length < 10) {
      toast.error('Please provide a more comprehensive answer (min 10 characters).');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await api.post('/ai/interview-feedback', {
        job_role: selectedRole,
        question: selectedQuestion,
        user_answer: userAnswer.trim()
      });

      if (res.success && res.evaluation) {
        setEvaluation(res.evaluation);
        toast.success(`Answer evaluated! Score: ${res.evaluation.score}/100`);
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.message || 'Evaluation failed.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          Interview Preparation & Mock Evaluations
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Practice technical interview questions for college campus placements and receive AI scoring with model answers
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['Software Engineer (SDE-1)', 'Java Developer', 'Full-Stack Developer', 'Frontend Engineer', 'Backend Engineer'].map((role) => (
          <button
            key={role}
            onClick={() => {
              setSelectedRole(role);
              setEvaluation(null);
              setUserAnswer('');
            }}
            className={`btn ${selectedRole === role ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Briefcase size={16} />
            <span>{role}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Practice Form Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Interview Question
          </h2>

          <div className="form-group">
            <label className="form-label" htmlFor="question_select">Select Question</label>
            <select
              id="question_select"
              value={selectedQuestion}
              onChange={(e) => {
                setSelectedQuestion(e.target.value);
                setEvaluation(null);
              }}
              className="form-select"
            >
              {questions.map((q, idx) => (
                <option key={idx} value={q}>
                  Question {idx + 1}: {q.substring(0, 70)}...
                </option>
              ))}
            </select>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#EEF2FF', borderRadius: '10px', border: '1px solid #C7D2FE', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
              🎯 Target Interview Question:
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E1B4B', lineHeight: '1.5' }}>
              "{selectedQuestion}"
            </div>
          </div>

          <form onSubmit={handleEvaluate}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="user_answer" style={{ marginBottom: 0 }}>
                  Your Answer <span className="required">*</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {userAnswer.split(/\s+/).filter(Boolean).length} Words
                </span>
              </div>
              <textarea
                id="user_answer"
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Structure your answer using technical concepts, trade-offs, and examples..."
                className="form-textarea"
                disabled={isEvaluating}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-gradient ${isEvaluating || !userAnswer.trim() ? 'btn-disabled' : ''}`}
              style={{ width: '100%', padding: '12px' }}
              disabled={isEvaluating || !userAnswer.trim()}
            >
              {isEvaluating ? (
                <>
                  <div className="spinner" />
                  <span>Evaluating Response & Generating Feedback...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Submit Answer for AI Review</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Feedback Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            AI Interviewer Evaluation
          </h2>

          {!evaluation ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
              <Award size={48} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '0.9rem' }}>Type and submit your answer on the left to receive scoring, strengths, and ideal model solutions.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Score pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '12px', backgroundColor: evaluation.score >= 80 ? '#ECFDF5' : '#FFFBEB', border: '1px solid', borderColor: evaluation.score >= 80 ? '#A7F3D0' : '#FDE68A' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Score Assessment</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: evaluation.score >= 80 ? '#059669' : '#D97706' }}>
                    {evaluation.score} / 100
                  </div>
                </div>
                <span className={`badge ${evaluation.score >= 80 ? 'badge-success' : 'badge-warning'}`}>
                  {evaluation.score >= 80 ? 'Strong Candidate' : 'Promising Foundation'}
                </span>
              </div>

              {/* Summary */}
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6' }}>
                {evaluation.feedback_summary}
              </p>

              {/* Strengths */}
              {evaluation.strengths && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', marginBottom: '6px' }}>
                    ✅ Key Strengths
                  </h4>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {evaluation.strengths.map((str, i) => (
                      <li key={i}>• {str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {evaluation.improvements && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706', marginBottom: '6px' }}>
                    🎯 Recommended Improvements
                  </h4>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i}>• {imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Model Answer */}
              {evaluation.model_answer && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                    💡 Exemplary Model Answer:
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{evaluation.model_answer}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Past Practice History */}
      {history.length > 0 && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Previous Interview Practice Sessions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.slice(0, 5).map((h) => (
              <div key={h.id} style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-primary">{h.job_role}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{h.question}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px', maxWidth: '600px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    Answer: "{h.user_answer}"
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${h.score >= 80 ? 'badge-success' : 'badge-warning'}`}>
                    Score: {h.score}/100
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {new Date(h.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
