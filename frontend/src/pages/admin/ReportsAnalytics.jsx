import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  FileSpreadsheet,
  Download,
  Users,
  CheckSquare,
  CalendarDays,
  FileText
} from 'lucide-react';

const ReportsAnalytics = () => {
  const toast = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.success) {
          setReport(res.report);
        }
      } catch (err) {
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const exportAsJSON = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `SkillMate_Platform_Report_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    toast.success('System report exported as JSON.');
  };

  const exportAsCSV = () => {
    if (!report || !report.summary) return;
    let csv = "Metric,Value\n";
    csv += `Total Students,${report.summary.studentsCount}\n`;
    csv += `Total Mentors,${report.summary.mentorsCount}\n`;
    csv += `Total Quizzes,${report.summary.quizCount}\n`;
    csv += `Total Quiz Attempts,${report.summary.attemptCount}\n`;
    csv += `Total Study Plans,${report.summary.planCount}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `SkillMate_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    toast.success('System summary exported as CSV.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            System Audit & Academic Reports
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            Generate institutional compliance documentation and export analytical summaries
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportAsCSV} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          <button onClick={exportAsJSON} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <Download size={16} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
          Platform Summary Highlights
        </h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="spinner spinner-dark" />
          </div>
        ) : !report ? (
          <div style={{ color: '#94A3B8' }}>No report data available.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE' }}>
              <div style={{ fontSize: '0.8rem', color: '#4338CA', fontWeight: 600 }}>Total Registered Students</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E1B4B', marginTop: '4px' }}>
                {report.summary.studentsCount}
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
              <div style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600 }}>Active Mentors</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064E3B', marginTop: '4px' }}>
                {report.summary.mentorsCount}
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#E0F2FE', border: '1px solid #BAE6FD' }}>
              <div style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 600 }}>Total Quizzes Evaluated</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0C4A6E', marginTop: '4px' }}>
                {report.summary.quizCount}
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 600 }}>Study Plans Generated</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#78350F', marginTop: '4px' }}>
                {report.summary.planCount}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;
