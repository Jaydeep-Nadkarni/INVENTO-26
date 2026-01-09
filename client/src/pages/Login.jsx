import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Navbar from '../components/Navbar'

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
};

// SVG Icons
const Icons = {
  Email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.59M5.372 5.372a12.077 12.077 0 012.356-.872C8.742 4.198 10.366 4 12 4c4.478 0 8.268 2.943 9.542 7 .99 3.018 1.137 6.12.438 9.176M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
  ),
  Unlock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [isMobile, setIsMobile] = useState(isMobileDevice())

  // Listen for mobile/desktop switches
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate inputs
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      // 1. Login to get token
      const loginResponse = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const loginData = await loginResponse.json()

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Login failed')
      }

      const token = loginData.token
      localStorage.setItem('token', token)

      // 2. Fetch user profile using the token
      const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const profileData = await profileResponse.json()

      if (!profileResponse.ok) {
        throw new Error(profileData.message || 'Failed to fetch profile')
      }

      // Store user data
      localStorage.setItem('currentUser', JSON.stringify(profileData.user))

      // Success - Redirect
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    
    if (!resetEmail) {
      setResetMessage('Please enter your email')
      return
    }

    setResetMessage('Password reset logic requires backend connection.')
    setTimeout(() => {
      setShowForgotPassword(false)
      setResetEmail('')
      setResetMessage('')
    }, 3000)
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gray-900"
      style={isMobile ? {
        backgroundImage: 'none',
        background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)'
      } : {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-center min-h-screen p-6"
      >
        <div className="w-full max-w-md">
          {/* Document Style Card */}
          <div className="relative">
            <div
              className="p-8 md:p-10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden border-2 border-gray-800 rounded-sm"
              style={{
                backgroundColor: '#f5f1e8',
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-amber-50/20 mix-blend-multiply pointer-events-none" />

              {/* Header */}
              <div className="mb-8 border-b-2 border-red-700/30 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    Login
                  </h1>
                  <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5">SECURE</span>
                </div>
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                  Authentication Required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="agent@gmail.com"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm transition-all"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[10px] text-red-700 hover:underline font-mono uppercase font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-800 text-[10px] font-mono font-bold uppercase tracking-tight flex items-center gap-2"
                  >
                    <span className="text-lg">⚠️</span> {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 mt-2 bg-gray-900 text-white font-black uppercase tracking-widest text-xs hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[5px_5px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  {loading ? 'VERIFYING...' : 'Login'}
                </motion.button>

                {/* Register Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-500 text-[10px] font-mono uppercase mb-4 tracking-widest">
                    Not registered yet?
                  </p>
                  <Link
                    to="/register"
                    className="text-sm text-gray-900 font-black uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-red-700 hover:border-red-700 transition-all"
                  >
                    Register Now!
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-10 max-w-md w-full relative rounded-xl border-4 border-gray-800 shadow-2xl"
            style={{
              backgroundImage: `url(${paperTexture})`,
              backgroundColor: '#f5f1e8',
              backgroundBlendMode: 'overlay'
            }}
          >
            <button
              onClick={() => {
                setShowForgotPassword(false)
                setResetEmail('')
                setResetMessage('')
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-1 tracking-tight">
              PASSWORD RESET
            </h2>
            <div className="h-1 bg-red-600 mb-6 w-16"></div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
              />

              {resetMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-green-100 border-l-4 border-green-600 text-green-800 text-xs font-mono rounded flex items-center"
                >
                  <Icons.Check /> {resetMessage}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-4 py-3 bg-red-600 text-white font-serif font-bold uppercase tracking-wider text-sm hover:bg-red-700 transition-colors border-2 border-red-700"
              >
                SEND RESET LINK
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Login
