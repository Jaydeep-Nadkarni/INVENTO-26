import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Navbar from '../components/Navbar'

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

  const handleForgotPassword = (e) => {
    e.preventDefault()
    
    if (!resetEmail) {
      setResetMessage('Please enter your email')
      return
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const user = registeredUsers.find(u => u.email === resetEmail)

    if (!user) {
      setResetMessage('Email not found in our records')
      return
    }

    // In a real app, you'd send an email. For demo, show the password
    setResetMessage(`Password reset link sent to ${resetEmail}. (Demo: Your password is: ${user.password})`)
    setTimeout(() => {
      setShowForgotPassword(false)
      setResetEmail('')
      setResetMessage('')
    }, 3000)
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
        className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-10"
      >
        <div className="w-full max-w-2xl px-6">
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
                  AGENT LOGIN
                </h1>
                <p className="text-red-600 text-sm font-mono uppercase tracking-widest">
                  Authentication Required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Field */}
                  <div className="space-y-3">
                    <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                      <Icons.Email /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="agent@agency.com"
                      className="w-full px-5 py-3 bg-white border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3">
                    <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                      <Icons.Lock /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-5 py-3 bg-white border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                      >
                        {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-red-600 hover:text-red-700 font-mono uppercase tracking-wide hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 text-sm font-mono flex items-center"
                    >
                      <Icons.Alert /> {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 mt-4 bg-red-600 text-white font-serif font-bold uppercase tracking-wider text-base hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border-2 border-red-700 flex items-center justify-center"
                  >
                    {loading ? (
                      '⏳ AUTHENTICATING...'
                    ) : (
                      <>
                        <Icons.Unlock /> LOGIN
                      </>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-0.5 bg-gray-400"></div>
                    <span className="text-gray-600 font-mono text-xs uppercase tracking-widest">or</span>
                    <div className="flex-1 h-0.5 bg-gray-400"></div>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-gray-700 text-sm font-serif mb-3">
                      No account yet?
                    </p>
                    <Link
                      to="/register"
                      className="w-full inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-gray-800 text-gray-800 font-serif font-bold uppercase tracking-wider text-sm hover:bg-gray-100 hover:border-red-600 hover:text-red-600 transition-colors"
                    >
                      <Icons.Edit /> REGISTER AGENT
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>

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
                  className="w-full px-5 py-3 bg-white border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
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
      </motion.div>
    </div>
  )
}

export default Login
