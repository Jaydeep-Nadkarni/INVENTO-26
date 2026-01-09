import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import Schedule from './pages/Schedule.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import BriefcasePage from './pages/Briefcase.jsx'

// Session initialization logic - runs immediately on module load
// This ensures that the flags are set before any components render (avoiding race conditions)
if (typeof window !== 'undefined') {
  const hasSessionStarted = sessionStorage.getItem('sessionStarted');
  if (!hasSessionStarted) {
    // Check if we are landing on the home page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      sessionStorage.setItem('shouldPlayIntro', 'true');
    }
    sessionStorage.setItem('sessionStarted', 'true');
  }
}

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
  return null;
};

function App() {
  return (
    <Router>
      <NavigationManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/briefcase" element={<BriefcasePage />} />
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
