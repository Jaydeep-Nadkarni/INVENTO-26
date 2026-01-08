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

const NavigationManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only manage navigation on non-home routes
    // Let Home.jsx handle its own refresh detection
    if (location.pathname !== '/') {
      // Clear intro flag when navigating away from home
      // This ensures refresh detection works properly next time
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        // If user refreshes on a sub-page, redirect to home
        navigate('/', { replace: true });
      }
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
