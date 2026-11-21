import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  UploadCloud,
  Copy,
  Download,
  Check,
  Sparkles,
  Clock,
  AlertCircle,
  FileCheck
} from 'lucide-react';

const NotesSummarizer = () => {
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/notes');
      if (res.success) {
        setHistory(res.notes || []);
      }
    } catch (err) {
      console.warn('Notes history fetch error:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate extension
    const allowed = ['.pdf', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error('Invalid file type. Only PDF and TXT documents are allowed.');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAndSummarize = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a PDF or TXT file to summarize.');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);

    setIsSummarizing(true);
    try {
      const res = await api.post('/ai/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success && res.note) {
        toast.success('Document analyzed and summarized successfully!');
        setCurrentSummary(res.note);
        setSelectedFile(null);
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.message || 'Summarization failed. Please check file readability.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const copyToClipboard = () => {
    if (!currentSummary) return;
    navigator.clipboard.writeText(currentSummary.summary);
    setCopied(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummaryTxt = () => {
    if (!currentSummary) return;
    const element = document.createElement('a');
    const file = new Blob([currentSummary.summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `SkillMate_Summary_${currentSummary.original_filename}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Summary downloaded as text file.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          Notes & Document Summarizer
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Extract executive summaries, key concepts, definitions, and exam revision checklists from college documents
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Upload Box Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Upload Notes File
          </h2>

          <form onSubmit={handleUploadAndSummarize}>
            <div
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '14px',
                padding: '36px 20px',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isSummarizing}
              />
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#EEF2FF',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}
              >
                <UploadCloud size={24} />
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }}>
                {selectedFile ? selectedFile.name : 'Click to browse or drag & drop files'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>
                Supports PDF and TXT documents up to 10MB
              </div>
            </div>

            {selectedFile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#ECFDF5', borderRadius: '8px', color: '#065F46', fontSize: '0.85rem', marginBottom: '16px' }}>
                <FileCheck size={16} />
                <span>Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-gradient ${isSummarizing || !selectedFile ? 'btn-disabled' : ''}`}
              style={{ width: '100%', padding: '12px' }}
              disabled={isSummarizing || !selectedFile}
            >
              {isSummarizing ? (
                <>
                  <div className="spinner" />
                  <span>Extracting Text & Generating Revision Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Summarize Document</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Guidance Box */}
          <div style={{ marginTop: '24px', padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '10px', fontSize: '0.8rem', color: '#64748B', lineHeight: '1.6' }}>
            <strong>💡 Pro-Tip for Students:</strong> Upload lecture slides, research papers, or syllabus notes. The summarizer extracts core textbook concepts into simple takeaways ready for exam revision.
          </div>
        </div>

        {/* History / Previous Summaries Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Past Summaries
          </h2>

          {loadingHistory ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner spinner-dark" />
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8', fontSize: '0.9rem' }}>
              No notes summarized yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {history.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setCurrentSummary(n)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    backgroundColor: currentSummary?.id === n.id ? '#EEF2FF' : '#FFFFFF',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <FileText size={18} color="var(--primary)" />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {n.original_filename}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        {new Date(n.created_at || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>View</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Viewer Area */}
      {currentSummary && (
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '6px' }}>Generated Summary</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                {currentSummary.original_filename}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={copyToClipboard}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
              <button
                onClick={downloadSummaryTxt}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <Download size={16} />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          <div
            className="markdown-content"
            style={{
              padding: '20px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap'
            }}
          >
            {currentSummary.summary}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSummarizer;
