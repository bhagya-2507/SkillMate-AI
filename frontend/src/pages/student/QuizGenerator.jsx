import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Clock,
  BookOpen,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const QuizGenerator = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('generate'); // 'generate', 'taking', 'result', 'history'
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    difficulty: 'Medium',
    total_questions: '5'
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: "A" | "B" | "C" | "D" }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/quizzes/history');
      if (res.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      console.warn('Quiz history fetch error:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.subject.trim()) errs.subject = 'Subject is required.';
    if (!formData.topic.trim()) errs.topic = 'Topic is required.';
    const count = parseInt(formData.total_questions, 10);
    if (isNaN(count) || count < 1 || count > 20) {
      errs.total_questions = 'Number of questions must be between 1 and 20.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the form errors.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.post('/quizzes/generate', {
        ...formData,
        total_questions: parseInt(formData.total_questions, 10)
      });

      if (res.success && res.quiz) {
        toast.success('AI Quiz generated! Ready for testing.');
        setCurrentQuiz(res.quiz);
        setSelectedAnswers({});
        setQuizResult(null);
        setActiveTab('taking');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate quiz questions.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId, optionLetter) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalCount = currentQuiz.questions ? currentQuiz.questions.length : 0;

    if (answeredCount < totalCount) {
      if (!window.confirm(`You answered ${answeredCount} of ${totalCount} questions. Submit anyway?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${currentQuiz._id}/submit`, {
        answers: selectedAnswers
      });

      if (res.success) {
        setQuizResult(res);
        setActiveTab('result');
        toast.success(`Quiz completed! You scored ${res.score}%`);

        if (res.score >= 80) {
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch (e) {}
        }
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header and Mode Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            AI Quiz Generator
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            Generate instant multiple-choice assessments with comprehensive scoring and explanations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('generate')}
            className={`btn ${activeTab === 'generate' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            <span>New Quiz</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchHistory();
            }}
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Award size={16} />
            <span>Quiz History</span>
          </button>
        </div>
      </div>

      {/* 1. Generate Form Mode */}
      {activeTab === 'generate' && (
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto', width: '100%', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>Quiz Configuration</h2>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Specify your subject parameters & difficulty</div>
            </div>
          </div>

          <form onSubmit={handleGenerate}>
            {/* Quick B.Tech Exam Presets */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                âš¡ Quick B.Tech Exam Topics (Click to Auto-fill):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { s: 'Database Management Systems', t: 'Normalization & ACID Properties', label: 'DBMS (Normalization & ACID)' },
                  { s: 'Operating Systems', t: 'CPU Scheduling & Deadlock Conditions', label: 'OS (Deadlocks & Scheduling)' },
                  { s: 'Data Structures & Algorithms', t: 'Binary Search Trees & Stack Operations', label: 'DSA (Trees & Stacks)' },
                  { s: 'Computer Networks', t: 'OSI 7 Layers & TCP 3-Way Handshake', label: 'CN (OSI Layers & TCP)' },
                  { s: 'Object Oriented Programming', t: 'OOPs 4 Pillars & Method Overriding', label: 'OOPs (4 Pillars & Overriding)' },
                  { s: 'Software Engineering', t: 'SDLC Models & Agile Scrum Sprints', label: 'SE (SDLC & Agile)' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, subject: item.s, topic: item.t }));
                      setErrors({});
                    }}
                    style={{
                      padding: '5px 11px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      color: '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#EEF2FF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#F8FAFC'; }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quiz_subject">
                Subject Name <span className="required">*</span>
              </label>
              <input
                id="quiz_subject"
                type="text"
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: null });
                }}
                placeholder="e.g. Operating Systems, Computer Networks"
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
              <label className="form-label" htmlFor="quiz_topic">
                Topic / Concept <span className="required">*</span>
              </label>
              <input
                id="quiz_topic"
                type="text"
                value={formData.topic}
                onChange={(e) => {
                  setFormData({ ...formData, topic: e.target.value });
                  if (errors.topic) setErrors({ ...errors, topic: null });
                }}
                placeholder="e.g. Deadlocks, TCP/IP Handshake, Virtual Memory"
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
                <label className="form-label" htmlFor="quiz_difficulty">Difficulty</label>
                <select
                  id="quiz_difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="form-select"
                  disabled={isGenerating}
                >
                  <option value="Easy">Easy (Foundational)</option>
                  <option value="Medium">Medium (Exam Standard)</option>
                  <option value="Hard">Hard (Gate / Advanced)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quiz_count">Number of Questions</label>
                <select
                  id="quiz_count"
                  value={formData.total_questions}
                  onChange={(e) => setFormData({ ...formData, total_questions: e.target.value })}
                  className="form-select"
                  disabled={isGenerating}
                >
                  <option value="3">3 Questions (Quick Test)</option>
                  <option value="5">5 Questions (Standard)</option>
                  <option value="10">10 Questions (Comprehensive)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-gradient ${isGenerating ? 'btn-disabled' : ''}`}
              style={{ width: '100%', padding: '14px', marginTop: '12px' }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner" />
                  <span>Generating Assessment Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 2. Interactive Test-Taking Mode */}
      {activeTab === 'taking' && currentQuiz && (
        <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#4338CA', fontWeight: 600 }}>Active Assessment</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E1B4B' }}>{currentQuiz.subject}: {currentQuiz.topic}</h2>
            </div>
            <span className="badge badge-primary">{currentQuiz.difficulty} Difficulty</span>
          </div>

          {(currentQuiz.questions || []).map((q, qIndex) => {
            const selectedOpt = selectedAnswers[q.id];
            const options = [
              { letter: 'A', text: q.option_a },
              { letter: 'B', text: q.option_b },
              { letter: 'C', text: q.option_c },
              { letter: 'D', text: q.option_d }
            ];

            return (
              <div key={q.id || qIndex} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', shrink: 0 }}>
                    {qIndex + 1}
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', lineHeight: '1.5' }}>
                    {q.question_text}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {options.map((opt) => {
                    const isSelected = selectedOpt === opt.letter;
                    return (
                      <div
                        key={opt.letter}
                        onClick={() => handleSelectOption(q.id, opt.letter)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid var(--primary)' : '1.5px solid #CBD5E1',
                            backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                            color: isSelected ? '#fff' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            shrink: 0
                          }}
                        >
                          {opt.letter}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: isSelected ? 'var(--primary)' : '#334155', fontWeight: isSelected ? 600 : 400 }}>
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '10px' }}>
            <button
              onClick={() => setActiveTab('generate')}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitQuiz}
              className={`btn btn-gradient ${isSubmitting ? 'btn-disabled' : ''}`}
              style={{ padding: '12px 28px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Scoring Quiz...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Submit Quiz Answers</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. Result & Detailed Explanations Mode */}
      {activeTab === 'result' && quizResult && (
        <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Result Banner */}
          <div
            className="card"
            style={{
              padding: '32px',
              textAlign: 'center',
              backgroundColor: quizResult.score >= 80 ? '#ECFDF5' : '#FEF2F2',
              borderColor: quizResult.score >= 80 ? '#A7F3D0' : '#FECACA'
            }}
          >
            <div style={{ fontSize: '3rem', fontWeight: 900, color: quizResult.score >= 80 ? '#059669' : '#DC2626' }}>
              {quizResult.score}%
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
              {quizResult.score >= 80 ? 'ðŸŽ‰ Excellent Performance!' : quizResult.score >= 60 ? 'ðŸ‘ Good Effort!' : 'ðŸ“š Review Needed'}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748B', marginTop: '6px' }}>
              You answered <strong>{quizResult.correctCount} out of {quizResult.totalQuestions} questions correctly</strong>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '18px' }}>
              <button onClick={() => setActiveTab('generate')} className="btn btn-primary" style={{ padding: '8px 20px' }}>
                <RotateCcw size={16} />
                <span>Take Another Quiz</span>
              </button>
              <button onClick={() => setActiveTab('history')} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
                <span>View Full History</span>
              </button>
            </div>
          </div>

          {/* Question Breakdown */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Detailed Solutions & Explanations</h3>

          {(quizResult.detailedResults || []).map((q, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${q.isCorrect ? '#10B981' : '#EF4444'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                  {idx + 1}. {q.question_text}
                </div>
                <span className={`badge ${q.isCorrect ? 'badge-success' : 'badge-danger'}`} style={{ shrink: 0 }}>
                  {q.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: q.correctAnswer === 'A' ? '#ECFDF5' : q.userAnswer === 'A' ? '#FEF2F2' : '#F8FAFC' }}>
                  A: {q.option_a}
                </div>
                <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: q.correctAnswer === 'B' ? '#ECFDF5' : q.userAnswer === 'B' ? '#FEF2F2' : '#F8FAFC' }}>
                  B: {q.option_b}
                </div>
                <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: q.correctAnswer === 'C' ? '#ECFDF5' : q.userAnswer === 'C' ? '#FEF2F2' : '#F8FAFC' }}>
                  C: {q.option_c}
                </div>
                <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: q.correctAnswer === 'D' ? '#ECFDF5' : q.userAnswer === 'D' ? '#FEF2F2' : '#F8FAFC' }}>
                  D: {q.option_d}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  ðŸ’¡ Correct Answer: Option {q.correctAnswer}
                </div>
                <div>{q.explanation}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Quiz History Mode */}
      {activeTab === 'history' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Previous Quiz Attempts
          </h2>

          {loadingHistory ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner spinner-dark" />
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
              <Award size={36} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
              <p>No quiz attempts recorded yet.</p>
              <button onClick={() => setActiveTab('generate')} className="btn btn-primary" style={{ marginTop: '12px', padding: '8px 18px', fontSize: '0.85rem' }}>
                Take Your First Quiz
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '12px 14px' }}>Subject & Topic</th>
                    <th style={{ padding: '12px 14px' }}>Difficulty</th>
                    <th style={{ padding: '12px 14px' }}>Questions</th>
                    <th style={{ padding: '12px 14px' }}>Score</th>
                    <th style={{ padding: '12px 14px' }}>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((att) => (
                    <tr key={att.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                        <div>{att.quiz?.subject || 'Subject Quiz'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 400 }}>{att.quiz?.topic || 'Topic'}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-neutral">{att.quiz?.difficulty || 'Medium'}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748B' }}>{att.total_questions} Questions</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${att.score >= 80 ? 'badge-success' : att.score >= 60 ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.85rem' }}>
                          {att.score}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94A3B8', fontSize: '0.8rem' }}>
                        {new Date(att.attempted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;

