import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import Schedule from './pages/Schedule.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import BriefcasePage from './pages/Briefcase.jsx'
import Pass from './pages/Pass.jsx'
import Something from './pages/Something.jsx'
import Newspaper from './pages/Newspaper.jsx'
import Concert from './pages/Concert.jsx'
import Developers from './pages/Developers.jsx'
import Sponsors from './pages/Sponsors.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { useAdminAuth } from './admin/context/AuthContext'
import { monitorLongTasks, isMobileDevice } from './utils/performanceOptimization'

// Administrative Page Imports (Placeholders)
import AdminLogin from './admin/pages/admin/login'
import MasterLogin from './admin/pages/master/login'
import AdminDashboard from './admin/pages/admin/admin-dashboard'
import AdminParticipants from './admin/pages/admin/Participants'
import AdminStats from './admin/pages/admin/Stats'
import MasterDashboard from './admin/pages/master/Dashboard'
import MasterAdmins from './admin/pages/master/Admins'
import MasterEvents from './admin/pages/master/Events'
import MasterParticipants from './admin/pages/master/Participants'
import MasterStats from './admin/pages/master/Stats'
import MasterAdminControls from './admin/pages/master/AdminControls'
import MasterActivity from './admin/pages/master/Activity'
import PasswordGame from './components/RetroTerminal/PasswordGame'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser')
  return user ? children : <Navigate to="/login" replace />
}

// Public-only Route Component (redirects to profile if already logged in)
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser')
  return user ? <Navigate to="/profile" replace /> : children
}

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();
  if (loading) return null;
  return adminUser && adminUser.role === 'admin' ? children : <Navigate to="/admin/login" replace />;
}

// Master Route Guard
const MasterRoute = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();
  if (loading) return null;
  return adminUser && adminUser.role === 'master' ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  // Initialize performance monitoring
  useEffect(() => {
    // Monitor long tasks (tasks > 50ms)
    if (!isMobileDevice()) {
      monitorLongTasks();
    }

    // Log Core Web Vitals on mobile
    if (isMobileDevice()) {
      console.log('Mobile optimization enabled: Animations disabled, lazy loading active');
    }
  }, [])

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/briefcase" element={<BriefcasePage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/something" element={<Something />} />
        <Route path="/newspaper" element={<Newspaper />} />
        <Route path="/concert" element={<Concert />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/sponsors" element={<Sponsors />} />

        {/* Admin and Master Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/master/login" element={<MasterLogin />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/participants" element={<AdminParticipants />} />
                <Route path="/stats" element={<AdminStats />} />
              </Routes>
            </AdminRoute>
          }
        />

        {/* Master Routes */}
        <Route
          path="/master/*"
          element={
            <MasterRoute>
              <Routes>
                <Route path="/" element={<MasterDashboard />} />
                <Route path="/dashboard" element={<MasterDashboard />} />
                <Route path="/admins" element={<MasterAdmins />} />
                <Route path="/events" element={<MasterEvents />} />
                <Route path="/participants" element={<MasterParticipants />} />
                <Route path="/stats" element={<MasterStats />} />
                <Route path="/controls" element={<MasterAdminControls />} />
                <Route path="/activity" element={<MasterActivity />} />
              </Routes>
            </MasterRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/pass"
          element={
            <ProtectedRoute>
              <Pass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes */}
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

        <Route path="/:clubSlug" element={<Events />} />
        <Route path="/:clubSlug/:eventSlug" element={<Events />} />
        <Route path="/password-game" element={<PasswordGame isFullPage={true} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
