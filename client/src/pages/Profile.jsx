import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Navbar from '../components/Navbar'

// SVG Icons
const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  School: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  IdCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  ),
  Status: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  )
}

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser')
    
    if (!currentUser) {
      // Redirect to login if no user is logged in
      navigate('/login')
      return
    }

    try {
      const userData = JSON.parse(currentUser)
      setUser(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
      navigate('/login')
    }
    
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}>
         <div className="text-white text-xl font-mono bg-black/50 p-4 rounded">LOADING AGENT DATA...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gray-900"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-center min-h-screen py-20"
      >
        <div className="w-full max-w-3xl px-6">
          {/* Document Style Card */}
          <div className="relative">
            <div
              className="rounded-2xl p-12 shadow-2xl relative overflow-hidden border-4 border-gray-800"
              style={{
                backgroundColor: '#f5f1e8',
                backgroundImage: `url(${paperTexture})`,
                backgroundBlendMode: 'overlay'
              }}
            >
              {/* Header */}
              <div className="mb-10 pb-8 border-b-4 border-red-600">
                <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2 tracking-tight">
                  AGENT PROFILE
                </h1>
                <p className="text-red-600 text-sm font-mono uppercase tracking-widest">
                  Classified Information
                </p>
              </div>

                {/* Profile Content */}
                <div className="space-y-8">
                  {/* Profile Photo and Basic Info */}
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b-4 border-red-600 pb-8">
                    {/* Profile Photo */}
                    <div className="shrink-0">
                      <div className="w-48 h-48 border-4 border-gray-400 bg-white overflow-hidden flex items-center justify-center rounded-lg">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-600 text-6xl">👤</div>
                        )}
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide mb-2">
                          Name
                        </label>
                        <p className="text-gray-900 font-mono text-xl">{user.name}</p>
                      </div>

                      <div>
                        <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide mb-2">
                          Email
                        </label>
                        <p className="text-gray-900 font-mono">{user.email}</p>
                      </div>

                      <div>
                        <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide mb-2">
                          Contact
                        </label>
                        <p className="text-gray-900 font-mono">{user.contact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-red-600 pl-4">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide mb-2">
                        College
                      </label>
                      <p className="text-gray-900 font-mono">{user.college}</p>
                    </div>

                    <div className="border-l-4 border-red-600 pl-4">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide mb-2">
                        USN
                      </label>
                      <p className="text-gray-900 font-mono text-lg tracking-widest">{user.usn}</p>
                    </div>

                    <div className="border-l-4 border-red-600 pl-4">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide mb-2">
                        Status
                      </label>
                      <p className="text-red-600 font-mono font-bold">REGISTERED ✓</p>
                    </div>

                    <div className="border-l-4 border-red-600 pl-4">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide mb-2">
                        Joined
                      </label>
                      <p className="text-gray-900 font-mono">
                        {new Date(user.registeredAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center pt-6 border-t-4 border-red-600">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/')}
                      className="px-8 py-3 bg-red-600 text-white font-serif font-bold uppercase tracking-wider text-base hover:bg-red-700 transition-colors border-2 border-red-700"
                    >
                      🏠 GO HOME
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="px-8 py-3 bg-white border-2 border-gray-800 text-gray-800 font-serif font-bold uppercase tracking-wider text-base hover:bg-gray-100 hover:border-red-600 hover:text-red-600 transition-colors"
                    >
                      🚪 LOGOUT
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </motion.div>
    </div>
  )
}

export default Profile
