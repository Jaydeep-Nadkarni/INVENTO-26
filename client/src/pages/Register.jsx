import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  IdCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  ),
  School: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Login: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  )
}

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
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
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

    if (formData.usn.length < 9) {
      setError('Please enter a valid USN')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters')
      setLoading(false)
      return
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

    if (registeredUsers.some(u => u.email === formData.email)) {
      setError('Email already registered')
      setLoading(false)
      return
    }

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

    registeredUsers.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    localStorage.setItem('currentUser', JSON.stringify(newUser))

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
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-center min-h-screen py-20"
      >
        <div className="w-full max-w-3xl px-6">
          <div className="relative">
            <div
              className="rounded-2xl p-12 shadow-2xl relative overflow-hidden border-4 border-gray-800"
              style={{
                backgroundColor: '#f5f1e8',
                backgroundImage: `url(${paperTexture})`,
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="mb-10 pb-8 border-b-4 border-red-600">
                <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2 tracking-tight">
                  AGENT REGISTRATION
                </h1>
                <p className="text-red-600 text-sm font-mono uppercase tracking-widest">
                  Join Invento '26
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <div className="w-40 h-40 border-4 border-gray-400 bg-white flex items-center justify-center overflow-hidden hover:border-red-600 transition-colors rounded-lg">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Icons.Camera />
                            <p className="text-gray-600 text-xs uppercase tracking-wider font-serif">
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
                    <p className="mt-3 text-gray-600 text-sm text-center font-mono flex items-center">
                      <Icons.User /> Face must be clearly visible
                    </p>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-3">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                        <Icons.User /> Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Full Name"
                        className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-3">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                        <Icons.Phone /> Contact
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                        <Icons.Email /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="agent@email.com"
                        className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
                      />
                    </div>

                    {/* USN */}
                    <div className="space-y-3">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                        <Icons.IdCard /> USN
                      </label>
                      <input
                        type="text"
                        name="usn"
                        value={formData.usn}
                        onChange={handleInputChange}
                        placeholder="e.g., RV21XX0001"
                        className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* College Dropdown */}
                  <div className="space-y-3">
                    <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                      <Icons.School /> College
                    </label>
                    <select
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm cursor-pointer"
                    >
                      <option value="">Select College</option>
                      {colleges.map((college, idx) => (
                        <option key={idx} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                        <Icons.Lock /> Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-3">
                      <label className="block text-gray-800 font-serif font-bold text-lg uppercase tracking-wide flex items-center">
                        <Icons.Lock /> Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-5 py-3 bg-white/60 backdrop-blur-[2px] border-2 border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 font-mono text-sm"
                      />
                    </div>
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
                      '⏳ REGISTERING...'
                    ) : (
                      <>
                        <Icons.Check /> REGISTER AGENT
                      </>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-0.5 bg-gray-400"></div>
                    <span className="text-gray-600 font-mono text-xs uppercase tracking-widest">or</span>
                    <div className="flex-1 h-0.5 bg-gray-400"></div>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-gray-700 text-sm font-serif mb-3">
                      Already registered?
                    </p>
                    <Link
                      to="/login"
                      className="w-full inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-gray-800 text-gray-800 font-serif font-bold uppercase tracking-wider text-sm hover:bg-gray-100 hover:border-red-600 hover:text-red-600 transition-colors"
                    >
                      <Icons.Login /> LOGIN
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </motion.div>
    </div>
  )
}

export default Register
