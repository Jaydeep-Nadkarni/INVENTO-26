import React, { useState, useRef } from 'react'
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

const Register = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const colleges = [
    'RV College of Engineering',
    'BMS College of Engineering',
    'Dayananda Sagar College of Engineering',
    'Siddaganga Institute of Technology',
    'M. S. Ramaiah Institute of Technology',
    'Jyoti Nivas College',
    'Acharya Institute of Technology',
    'Vidyavardhaka College of Engineering',
    'Christ University',
    'Kristu Jayanti College',
    'Other'
  ]

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    college: '',
    usn: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }

      // Convert to Base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setImageFile(reader.result)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate all fields
    if (!formData.name || !formData.contact || !formData.email || !formData.college || !formData.usn || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!previewImage) {
      setError('Please upload a profile photo')
      setLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    // Validate contact number
    if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit contact number')
      setLoading(false)
      return
    }

    // Validate USN format
    if (formData.usn.length < 9) {
      setError('Please enter a valid USN')
      setLoading(false)
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters')
      setLoading(false)
      return
    }

    // Get existing users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

    // Check if email already exists
    if (registeredUsers.some(u => u.email === formData.email)) {
      setError('Email already registered')
      setLoading(false)
      return
    }

    // Create new user object
    const newUser = {
      id: Date.now(),
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      college: formData.college,
      usn: formData.usn,
      password: formData.password,
      profilePhoto: imageFile,
      registeredAt: new Date().toISOString()
    }

    // Save to localStorage
    registeredUsers.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    localStorage.setItem('currentUser', JSON.stringify(newUser))

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
        className="relative z-10 flex items-center justify-center min-h-screen py-20"
      >
        <div className="w-full max-w-2xl px-6">
          {/* Retro Style Container */}
          <div className="relative">
            {/* Outer border */}
            <div className="border-8 border-yellow-500 p-1 bg-black/80 backdrop-blur">
              {/* Inner border */}
              <div className="border-4 border-yellow-400/50 p-8 bg-gray-900/90">
                <h1 className="text-4xl font-serif font-bold text-yellow-500 mb-2 text-center tracking-tighter">
                  REGISTER
                </h1>
                <p className="text-yellow-400/70 text-center text-sm mb-8 font-mono">
                  JOIN INVENTO '26
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Photo Upload */}
                  <div className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <div className="w-32 h-32 border-4 border-yellow-500 bg-gray-800 flex items-center justify-center overflow-hidden hover:border-yellow-300 transition-colors">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-yellow-400 text-2xl mb-2">📸</div>
                            <p className="text-yellow-400/70 text-xs uppercase tracking-wider">
                              Upload Photo
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-yellow-400/50 text-xs text-center font-mono">Face should be visible clearly</p>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                      />
                    </div>

                    {/* Email */}
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
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                      />
                    </div>

                    {/* USN */}
                    <div>
                      <label className="block text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">
                        USN
                      </label>
                      <input
                        type="text"
                        name="usn"
                        value={formData.usn}
                        onChange={handleInputChange}
                        placeholder="e.g., RV21XX0001"
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* College Dropdown */}
                  <div>
                    <label className="block text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">
                      College
                    </label>
                    <select
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-200 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm cursor-pointer"
                    >
                      <option value="">Select College</option>
                      {colleges.map((college, idx) => (
                        <option key={idx} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-200 placeholder-yellow-700/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm"
                      />
                    </div>
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
                    {loading ? 'REGISTERING...' : 'REGISTER'}
                  </motion.button>

                  {/* Login Link */}
                  <div className="text-center border-t border-yellow-500/30 pt-6">
                    <p className="text-yellow-400/70 text-sm mb-3">
                      Already have an account?
                    </p>
                    <Link
                      to="/login"
                      className="inline-block px-6 py-2 bg-transparent border-2 border-yellow-500 text-yellow-400 font-bold uppercase tracking-wider text-xs hover:bg-yellow-500/10 hover:text-yellow-300 transition-all duration-200"
                    >
                      LOGIN
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

export default Register
