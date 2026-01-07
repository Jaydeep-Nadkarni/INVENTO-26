import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg2.jpg'
import paperTexture from '../assets/UI/paper-texture.jpg'
import Navbar from '../components/Navbar'

const TextureOverlay = ({ opacity = 0.4 }) => (
  <div
    className="absolute inset-0 z-20 pointer-events-none"
    style={{
      backgroundImage: `url(${paperTexture})`,
      backgroundSize: 'cover',
      opacity: opacity,
      mixBlendMode: 'multiply'
    }}
  />
)

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
      <div
        className="min-h-screen relative overflow-hidden bg-gray-900 flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <TextureOverlay opacity={0.5} />
        <div className="text-yellow-400 text-xl font-mono">LOADING...</div>
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
      <TextureOverlay opacity={0.5} />
      <Navbar />

      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-center min-h-screen py-20"
      >
        <div className="w-full max-w-4xl px-6">
          {/* Retro Style Container */}
          <div className="relative">
            {/* Outer border */}
            <div className="border-8 border-yellow-500 p-1 bg-black/80 backdrop-blur">
              {/* Inner border */}
              <div className="border-4 border-yellow-400/50 p-8 bg-gray-900/90">
                <h1 className="text-4xl font-serif font-bold text-yellow-500 mb-2 text-center tracking-tighter">
                  PROFILE
                </h1>
                <p className="text-yellow-400/70 text-center text-sm mb-8 font-mono">
                  AGENT DETAILS
                </p>

                {/* Profile Content */}
                <div className="space-y-8">
                  {/* Profile Photo and Basic Info */}
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-yellow-500/30 pb-8">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-40 h-40 border-4 border-yellow-500 bg-gray-800 overflow-hidden flex items-center justify-center">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-yellow-400 text-4xl">📸</div>
                        )}
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-yellow-400 font-bold text-sm uppercase tracking-wider mb-1">
                          Name
                        </label>
                        <p className="text-yellow-200 font-mono text-lg">{user.name}</p>
                      </div>

                      <div>
                        <label className="block text-yellow-400 font-bold text-sm uppercase tracking-wider mb-1">
                          Email
                        </label>
                        <p className="text-yellow-200 font-mono">{user.email}</p>
                      </div>

                      <div>
                        <label className="block text-yellow-400 font-bold text-sm uppercase tracking-wider mb-1">
                          Contact
                        </label>
                        <p className="text-yellow-200 font-mono">{user.contact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <label className="block text-yellow-400 font-bold text-sm uppercase tracking-wider mb-2">
                        College
                      </label>
                      <p className="text-yellow-200 font-mono">{user.college}</p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <label className="block text-yellow-400 font-bold text-sm uppercase tracking-wider mb-2">
                        USN
                      </label>
                      <p className="text-yellow-200 font-mono text-lg tracking-widest">{user.usn}</p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <label className="block text-yellow-400 font-bold text-sm uppercase tracking-wider mb-2">
                        Status
                      </label>
                      <p className="text-green-400 font-mono font-bold">REGISTERED ✓</p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <label className="block text-yellow-400 font-bold text-sm uppercase tracking-wider mb-2">
                        Member Since
                      </label>
                      <p className="text-yellow-200 font-mono">
                        {new Date(user.registeredAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center pt-6 border-t border-yellow-500/30">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold uppercase tracking-wider text-sm hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 border-2 border-yellow-700 shadow-lg hover:shadow-yellow-500/50"
                    >
                      GO HOME
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="px-6 py-3 bg-transparent border-2 border-red-500 text-red-400 font-bold uppercase tracking-wider text-sm hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                      LOGOUT
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                animation: 'scanline 8s linear infinite'
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile
