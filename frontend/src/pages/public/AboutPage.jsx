import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Database, Server, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ padding: '60px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Academic Project Overview</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
            About SkillMate AI
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748B', maxWidth: '680px', margin: '14px auto 0', lineHeight: '1.6' }}>
            A production-ready full-stack AI learning and career mentorship ecosystem engineered for college students and academic institutions.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="card" style={{ marginBottom: '40px', padding: '36px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
            🎯 Purpose & Motivation
          </h2>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
            College students often struggle with syllabus overload, inconsistent study schedules, lack of instant personalized feedback, and uncertainty around technical campus placements. SkillMate AI bridges this gap by functioning as a 24/7 personal tutor, study coordinator, and career advisor.
          </p>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7' }}>
            Unlike superficial prototype demos, SkillMate AI is engineered as an end-to-end full-stack platform featuring true relational database persistence in MySQL, secure role-based access control (Student, Mentor, Admin), comprehensive form validation, and server-side integration with Google Gemini AI.
          </p>
        </div>

        {/* Technical Architecture */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '24px', textAlign: 'center' }}>
            🛠️ System Architecture & Technology Stack
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EEF2FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Frontend Client</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                <li>• <strong>React.js (Vite)</strong>: Fast single-page application framework</li>
                <li>• <strong>React Router DOM</strong>: Client-side routing with RoleGuards</li>
                <li>• <strong>Axios</strong>: HTTP client with JWT interceptors</li>
                <li>• <strong>Recharts</strong>: Interactive SVG performance visualizations</li>
                <li>• <strong>Lucide React</strong>: Clean, modern SaaS iconography</li>
              </ul>
            </div>

            <div className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Server size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Backend API</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                <li>• <strong>Node.js & Express.js</strong>: High-throughput asynchronous REST server</li>
                <li>• <strong>JWT & bcryptjs</strong>: Stateless authorization and salted hashing</li>
                <li>• <strong>express-validator</strong>: Rigorous server-side schema sanitation</li>
                <li>• <strong>Multer & pdf-parse</strong>: Secure binary document text extraction</li>
                <li>• <strong>Helmet & Rate Limiting</strong>: Security headers & DDoS defense</li>
              </ul>
            </div>

            <div className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Database & AI</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                <li>• <strong>MongoDB & Mongoose</strong>: Schema modeling across 15 collections</li>
                <li>• <strong>Document Architecture</strong>: Fast JSON query execution & population</li>
                <li>• <strong>Smart Learning Engine</strong>: Context-aware academic assistant</li>
                <li>• <strong>Data Integrity</strong>: Strict validation & indexing strategies</li>
                <li>• <strong>Resilient Engine</strong>: Non-blocking graceful query handling</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security & Design Principles */}
        <div className="card" style={{ padding: '36px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            🛡️ Production Security & Validation Standards
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#10B981" style={{ shrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                <strong>No Secrets on Client:</strong> All server secrets and database credentials reside strictly within backend environment variables.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#10B981" style={{ shrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                <strong>Strict Role Isolation:</strong> Backend middleware enforces permissions. Students cannot access admin/mentor APIs under any circumstance.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#10B981" style={{ shrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                <strong>Dual-Layer Validation:</strong> Every field undergoes live frontend checks and re-validation on the Express server.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#10B981" style={{ shrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                <strong>Ownership Guard:</strong> Study plans, quizzes, and chat conversations can only be viewed or modified by their verified creator.
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/register" className="btn btn-gradient" style={{ padding: '12px 28px' }}>
            <span>Join SkillMate AI Today</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
