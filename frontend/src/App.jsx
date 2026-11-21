
import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import SplashScreen from './components/common/SplashScreen';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import RoleGuard from './components/layout/RoleGuard';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Student Pages
import StudentOverview from './pages/student/Overview';
import StudentChat from './pages/student/Chat';
import StudentStudyPlanner from './pages/student/StudyPlanner';
import StudentQuizGenerator from './pages/student/QuizGenerator';
import StudentNotesSummarizer from './pages/student/NotesSummarizer';
import StudentCareerGuidance from './pages/student/CareerGuidance';
import StudentInterviewPrep from './pages/student/InterviewPrep';
import StudentProgress from './pages/student/MyProgress';
import StudentProfile from './pages/student/ProfileSettings';

// Admin Pages
import AdminOverview from './pages/admin/Overview';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminMentorManagement from './pages/admin/MentorManagement';
import AdminContentManagement from './pages/admin/ContentManagement';
import AdminQuizManagement from './pages/admin/QuizManagement';
import AdminReportsAnalytics from './pages/admin/ReportsAnalytics';

// Mentor Pages
import MentorOverview from './pages/mentor/Overview';
import MentorMyStudents from './pages/mentor/MyStudents';
import MentorFeedback from './pages/mentor/StudentFeedback';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>

          {loading ? (
            <SplashScreen onComplete={handleLoadingComplete} />
          ) : (
            <Routes>

              {/* Public Pages */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Student Routes */}
              <Route element={<RoleGuard allowedRoles={['STUDENT']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/student/dashboard" element={<StudentOverview />} />
                  <Route path="/student/chat" element={<StudentChat />} />
                  <Route path="/student/study-planner" element={<StudentStudyPlanner />} />
                  <Route path="/student/quiz" element={<StudentQuizGenerator />} />
                  <Route path="/student/notes" element={<StudentNotesSummarizer />} />
                  <Route path="/student/career" element={<StudentCareerGuidance />} />
                  <Route path="/student/interview" element={<StudentInterviewPrep />} />
                  <Route path="/student/progress" element={<StudentProgress />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin/dashboard" element={<AdminOverview />} />
                  <Route path="/admin/users" element={<AdminUserManagement />} />
                  <Route path="/admin/mentors" element={<AdminMentorManagement />} />
                  <Route path="/admin/content" element={<AdminContentManagement />} />
                  <Route path="/admin/quizzes" element={<AdminQuizManagement />} />
                  <Route path="/admin/reports" element={<AdminReportsAnalytics />} />
                  <Route path="/admin/profile" element={<StudentProfile />} />
                </Route>
              </Route>

              {/* Mentor Routes */}
              <Route element={<RoleGuard allowedRoles={['MENTOR']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/mentor/dashboard" element={<MentorOverview />} />
                  <Route path="/mentor/students" element={<MentorMyStudents />} />
                  <Route path="/mentor/resources" element={<AdminContentManagement />} />
                  <Route path="/mentor/feedback" element={<MentorFeedback />} />
                  <Route path="/mentor/profile" element={<StudentProfile />} />
                </Route>
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          )}

        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
