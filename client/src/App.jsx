import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import Schedule from './pages/Schedule.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'

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

// This flag persists across SPA navigations but resets on hard refresh
let hasCheckedRefresh = false;

const NavigationManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!hasCheckedRefresh) {
      const navEntries = performance.getEntriesByType('navigation');
      const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
      
      if (isReload && location.pathname !== '/') {
        // If user refreshes on a sub-page, redirect to home
        navigate('/', { replace: true });
      }
      hasCheckedRefresh = true;
    }
  }, [location.pathname, navigate]);

  return null;
};

function App() {
  return (
    <Router>
      <NavigationManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Routes */}
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
      </Routes>
    </Router>
  )
}

export default App
