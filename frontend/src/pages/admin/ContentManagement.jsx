import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  Layers,
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  Edit,
  Tag
} from 'lucide-react';

const ContentManagement = () => {
  const toast = useToast();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Resource State
  const [showModal, setShowModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    subject: 'Web Technologies',
    resource_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await api.get('/mentor/resources');
      if (res.success) {
        setResources(res.resources || []);
      }
    } catch (err) {
      toast.error('Failed to load learning resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.description.trim() || !newResource.resource_url.trim()) {
      toast.error('Please complete all resource fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/mentor/resources', newResource);
      if (res.success) {
        toast.success('Learning resource published to students!');
        setShowModal(false);
        setNewResource({ title: '', description: '', subject: 'Web Technologies', resource_url: '' });
        fetchResources();
      }
    } catch (err) {
      toast.error(err.message || 'Error publishing resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (res) => {
    setResourceToDelete(res);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    try {
      const res = await api.delete(`/mentor/resources/${resourceToDelete.id}`);
      if (res.success) {
        toast.success('Resource deleted successfully.');
        setDeleteModalOpen(false);
        fetchResources();
      }
    } catch (err) {
      toast.error(err.message || 'Unable to delete resource.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Academic Content & Resources
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            Curate learning materials, documentation links, and reference guides for students
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '10px 18px' }}>
          <Plus size={16} />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Resource Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner spinner-dark" />
        </div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B' }}>
          <BookOpen size={40} color="#CBD5E1" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            No Learning Resources Published
          </h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
            Publish links to documentation, syllabi, or tutorials for student cohorts.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Publish First Resource
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {resources.map((r) => (
            <div key={r.id} className="card card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{r.subject}</span>
                  <button
                    onClick={() => confirmDelete(r)}
                    style={{ color: '#EF4444', padding: '4px', display: 'flex' }}
                    title="Delete Resource"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6', marginBottom: '16px' }}>
                  {r.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  By: {r.mentor?.name || 'Administrator'}
                </span>
                <a
                  href={r.resource_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <span>Open Link</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showModal && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
              Publish Learning Resource
            </h3>

            <form onSubmit={handleCreateResource}>
              <div className="form-group">
                <label className="form-label" htmlFor="res_title">Resource Title</label>
                <input
                  id="res_title"
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="e.g. Official React 19 Documentation"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="res_subj">Subject Category</label>
                <input
                  id="res_subj"
                  type="text"
                  value={newResource.subject}
                  onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                  placeholder="e.g. Web Technologies, Databases"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="res_url">Web URL (HTTP / HTTPS)</label>
                <input
                  id="res_url"
                  type="url"
                  value={newResource.resource_url}
                  onChange={(e) => setNewResource({ ...newResource, resource_url: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="res_desc">Description</label>
                <textarea
                  id="res_desc"
                  rows={3}
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="Why this resource is valuable for students..."
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  {isSubmitting ? <div className="spinner" /> : 'Publish Resource'}
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
        onConfirm={handleDelete}
        title="Delete Learning Resource"
        message={`Remove "${resourceToDelete?.title}" permanently from student resources?`}
        confirmText="Delete Resource"
        isDanger={true}
      />
    </div>
  );
};

export default ContentManagement;
