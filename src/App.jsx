import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { StudentProvider, useStudents } from './context/StudentContext';
import { InstructorProvider } from './context/InstructorContext';
import { EnrollmentProvider } from './context/EnrollmentContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import CourseList from './pages/courses/CourseList';
import CourseDetails from './pages/courses/CourseDetails';
import StudentList from './pages/students/StudentList';
import EnrollmentList from './pages/enrollments/EnrollmentList';
import InstructorList from './pages/instructors/InstructorList';
import InstructorProfile from './pages/instructors/InstructorProfile';

function StudentAccountBridge() {
  const { user, attachStudentId } = useAuth();
  const { findOrCreateByEmail } = useStudents();

  useEffect(() => {
    if (user && user.role === 'student' && !user.studentId) {
      const record = findOrCreateByEmail({ fullName: user.fullName, email: user.email });
      attachStudentId(record.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route path="/enrollments" element={<EnrollmentList />} />
        <Route path="/instructors" element={<InstructorList />} />
        <Route path="/instructors/:id" element={<InstructorProfile />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudentProvider>
          <InstructorProvider>
            <CourseProvider>
              <EnrollmentProvider>
                <StudentAccountBridge />
                <AppRoutes />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
              </EnrollmentProvider>
            </CourseProvider>
          </InstructorProvider>
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
