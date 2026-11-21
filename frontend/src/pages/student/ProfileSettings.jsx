import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  User,
  Mail,
  Lock,
  Save,
  Shield,
  KeyRound,
  LogOut,
  AlertCircle,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateUser, logout, role } = useAuth();
  const toast = useToast();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    education: user?.education || '',
    college: user?.college || '',
    interests: user?.interests || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Full name is required.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success && res.user) {
        updateUser(res.user);
        toast.success(res.message || 'Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwordData.currentPassword) {
      errs.currentPassword = 'Current password is required.';
    }
    if (!passwordData.newPassword) {
      errs.newPassword = 'New password is required.';
    } else if (passwordData.newPassword.length < 8) {
      errs.newPassword = 'New password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errs.newPassword = 'Must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(passwordData.newPassword)) {
      errs.newPassword = 'Must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errs.newPassword = 'Must contain at least one number.';
    } else if (!/[\W_]/.test(passwordData.newPassword)) {
      errs.newPassword = 'Must contain at least one special symbol.';
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      errs.newPassword = 'New password must be different from current password.';
    }

    if (!passwordData.confirmPassword) {
      errs.confirmPassword = 'Confirm your new password.';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      toast.error('Please resolve the password errors.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.put('/auth/change-password', passwordData);
      if (res.success) {
        toast.success(res.message || 'Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Unable to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          Profile & Security Settings
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
          Manage your personal details, academic preferences, and credentials
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{user?.name}</h2>
              <div style={{ fontSize: '0.825rem', color: '#64748B' }}>{user?.email}</div>
              <span className="badge badge-primary" style={{ marginTop: '4px' }}>{role}</span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="form-input"
                disabled={isUpdatingProfile}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="education">Degree / Course</label>
              <input
                id="education"
                type="text"
                value={profileData.education}
                onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
                className="form-input"
                disabled={isUpdatingProfile}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="college">College / University</label>
              <input
                id="college"
                type="text"
                value={profileData.college}
                onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                placeholder="e.g. Metro State University"
                className="form-input"
                disabled={isUpdatingProfile}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="interests">Interests & Specialization</label>
              <textarea
                id="interests"
                rows={2}
                value={profileData.interests}
                onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                placeholder="e.g. Relational Databases, AI Engineering, Full-Stack"
                className="form-textarea"
                disabled={isUpdatingProfile}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-gradient ${isUpdatingProfile ? 'btn-disabled' : ''}`}
              style={{ width: '100%', padding: '12px' }}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <>
                  <div className="spinner" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Profile Updates</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EEF2FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyRound size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>Change Password</h2>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Ensure account security with a strong password</div>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                Current Password <span className="required">*</span>
              </label>
              <input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value });
                  if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: null });
                }}
                className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                disabled={isChangingPassword}
              />
              {passwordErrors.currentPassword && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{passwordErrors.currentPassword}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">
                New Password <span className="required">*</span>
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value });
                  if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: null });
                }}
                placeholder="Min 8 chars, uppercase, lowercase, number, symbol"
                className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                disabled={isChangingPassword}
              />
              {passwordErrors.newPassword && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{passwordErrors.newPassword}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmNewPassword">
                Confirm New Password <span className="required">*</span>
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                  if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: null });
                }}
                className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                disabled={isChangingPassword}
              />
              {passwordErrors.confirmPassword && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{passwordErrors.confirmPassword}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-secondary ${isChangingPassword ? 'btn-disabled' : ''}`}
              style={{ width: '100%', padding: '12px' }}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <div className="spinner spinner-dark" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>

          {/* Secure Logout Action */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
            <button
              onClick={logout}
              className="btn btn-danger"
              style={{ width: '100%', padding: '12px' }}
            >
              <LogOut size={16} />
              <span>Sign Out of SkillMate AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
