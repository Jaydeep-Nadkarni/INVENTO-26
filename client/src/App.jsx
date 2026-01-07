import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import Schedule from './pages/Schedule.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  const currentUser = localStorage.getItem('currentUser')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={currentUser ? <Navigate to="/profile" /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/profile" /> : <Register />} />
        <Route path="/:clubSlug" element={<Events />} />
        <Route path="/:clubSlug/:eventSlug" element={<Events />} />
      </Routes>
    </Router>
  )
}

export default App
