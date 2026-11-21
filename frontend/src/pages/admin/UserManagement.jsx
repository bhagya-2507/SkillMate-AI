import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  Users,
  Search,
  Filter,
  Trash2,
  Shield,
  CheckCircle2,
  XCircle,
  Edit2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const UserManagement = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ role: 'STUDENT', is_active: true });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      let query = `/admin/users?page=${page}&limit=10`;
      if (search.trim()) query += `&search=${encodeURIComponent(search.trim())}`;
      if (roleFilter) query += `&role=${roleFilter}`;
      if (statusFilter) query += `&is_active=${statusFilter}`;

      const res = await api.get(query);
      if (res.success) {
        setUsers(res.users);
        setPagination(res.pagination);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await api.put(`/admin/users/${user.id}`, {
        is_active: !user.is_active
      });
      if (res.success) {
        toast.success(`User ${user.name} is now ${!user.is_active ? 'Active' : 'Deactivated'}.`);
        fetchUsers(pagination.currentPage);
      }
    } catch (err) {
      toast.error(err.message || 'Error updating status.');
    }
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setEditForm({ role: user.role, is_active: user.is_active });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!userToEdit) return;

    setIsUpdating(true);
    try {
      const res = await api.put(`/admin/users/${userToEdit.id}`, editForm);
      if (res.success) {
        toast.success(res.message || 'User updated successfully.');
        setEditModalOpen(false);
        fetchUsers(pagination.currentPage);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user.');
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await api.delete(`/admin/users/${userToDelete.id}`);
      if (res.success) {
        toast.success(res.message);
        setDeleteModalOpen(false);
        fetchUsers(pagination.currentPage);
      }
    } catch (err) {
      toast.error(err.message || 'Unable to delete user.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          User Account Management
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Inspect user accounts, manage permission roles, toggle account statuses, and maintain audit integrity
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '18px 24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email address..."
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ width: '160px' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-select"
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="MENTOR">Mentor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div style={{ width: '160px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
            Registered Accounts ({pagination.totalItems})
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner spinner-dark" />
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
            No users matched the criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '12px 14px' }}>Name & Email</th>
                  <th style={{ padding: '12px 14px' }}>Role</th>
                  <th style={{ padding: '12px 14px' }}>Education / College</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Joined Date</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                      <div>{u.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 400 }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'MENTOR' ? 'badge-success' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '0.85rem' }}>
                      <div>{u.education || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{u.college || ''}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`badge ${u.is_active ? 'badge-success' : 'badge-neutral'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#94A3B8', fontSize: '0.8rem' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(u)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 8px' }}
                          title="Edit Role & Permissions"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(u)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 8px', color: '#EF4444' }}
                          title="Delete Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => fetchUsers(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <button
                onClick={() => fetchUsers(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editModalOpen && userToEdit && (
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Update Permissions: {userToEdit.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Assign authorized role and activate/deactivate account access.
            </p>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit_role">Assigned Platform Role</label>
                <select
                  id="edit_role"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="form-select"
                >
                  <option value="STUDENT">STUDENT (Access to Student Portal)</option>
                  <option value="MENTOR">MENTOR (Access to Mentor Guidance)</option>
                  <option value="ADMIN">ADMIN (Full Administrative Control)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit_status">Account Status</label>
                <select
                  id="edit_status"
                  value={editForm.is_active ? 'true' : 'false'}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'true' })}
                  className="form-select"
                >
                  <option value="true">Active (Can Sign In & Use Features)</option>
                  <option value="false">Deactivated (Access Suspended)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isUpdating ? 'btn-disabled' : ''}`}
                  disabled={isUpdating}
                >
                  {isUpdating ? <div className="spinner" /> : 'Save Changes'}
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
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete "${userToDelete?.name}" (${userToDelete?.email})? All associated quizzes, study plans, and records will be deleted from the database.`}
        confirmText="Delete Account"
        isDanger={true}
      />
    </div>
  );
};

export default UserManagement;
