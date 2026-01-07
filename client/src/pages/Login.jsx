import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate inputs
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    // Check if user exists
    const user = registeredUsers.find(u => u.email === formData.email)
    
    if (!user) {
      setError('User not found. Please register first.')
      setLoading(false)
      return
    }

    if (user.password !== formData.password) {
      setError('Invalid password')
      setLoading(false)
      return
    }

    // Store logged-in user
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    // Redirect to profile
    setTimeout(() => {
      navigate('/profile')
    }, 500)
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
        className="relative z-10 flex items-center justify-center min-h-screen pt-20"
      >
        <div className="w-full max-w-md px-6">
          {/* Retro Style Container */}
          <div className="relative">
            {/* Outer border */}
            <div className="border-8 border-yellow-500 p-1 bg-black/80 backdrop-blur">
              {/* Inner border */}
              <div className="border-4 border-yellow-400/50 p-6 bg-gray-900/90">
                <h1 className="text-4xl font-serif font-bold text-yellow-500 mb-2 text-center tracking-tighter">
                  LOGIN
                </h1>
                <p className="text-yellow-400/70 text-center text-sm mb-8 font-mono">
                  ENTER YOUR CREDENTIALS
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-red-900/50 border-2 border-red-500 text-red-200 text-sm font-mono rounded"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 mt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold uppercase tracking-wider text-sm hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-2 border-yellow-700 shadow-lg hover:shadow-yellow-500/50"
                  >
                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                  </motion.button>

                  {/* Register Link */}
                  <div className="text-center border-t border-yellow-500/30 pt-6">
                    <p className="text-yellow-400/70 text-sm mb-3">
                      Don't have an account?
                    </p>
                    <Link
                      to="/register"
                      className="inline-block px-6 py-2 bg-transparent border-2 border-yellow-500 text-yellow-400 font-bold uppercase tracking-wider text-xs hover:bg-yellow-500/10 hover:text-yellow-300 transition-all duration-200"
                    >
                      REGISTER NOW
                    </Link>
                  </div>
                </form>
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

export default Login
