import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CVEditor from './pages/CVEditor';
import TemplateSelection from './pages/TemplateSelection';
import TemplateGallery from './pages/TemplateGallery';
import CVDetailsForm from './pages/CVDetailsForm';
import NotFound from './pages/NotFound';
import ParticleBackground from './components/ParticleBackground';
import SnakeCursor from './components/SnakeCursor';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import ManageTemplates from './pages/admin/ManageTemplates';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Admin Route (redirect if not admin)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cv/details"
        element={
          <ProtectedRoute>
            <CVDetailsForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cv/new"
        element={
          <ProtectedRoute>
            <CVEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cv/edit/:id"
        element={
          <ProtectedRoute>
            <CVEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <TemplateGallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/select-template/:id"
        element={
          <ProtectedRoute>
            <TemplateSelection />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><UserList /></AdminRoute>} />
      <Route path="/admin/templates" element={<AdminRoute><ManageTemplates /></AdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}



function App() {
  return (
    <Router>
      <AuthProvider>
        <ParticleBackground />
        <SnakeCursor />
        <div className="relative z-10">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

