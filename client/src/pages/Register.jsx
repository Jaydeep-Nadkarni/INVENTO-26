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
    'KLE Dr. MS Sheshgiri College of Engineering and Technology',
    'KLS Gogte Institute of Technology',
    'Jain Engineering College',
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

    // TODO: Connect to backend API. Locally hosted data removed.
    // const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    // if (registeredUsers.some(u => u.email === formData.email)) {
    //   setError('Email already registered')
    //   setLoading(false)
    //   return
    // }

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

    // registeredUsers.push(newUser)
    // localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
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
        className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-12 px-4"
      >
        <div className="w-full max-w-2xl">
          {/* Document Style Card */}
          <div className="relative">
            <div
              className="p-8 md:p-12 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden border-2 border-gray-800 rounded-sm"
              style={{
                backgroundColor: '#f5f1e8',
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-amber-50/20 mix-blend-multiply pointer-events-none" />

              {/* Header */}
              <div className="mb-10 pb-6 border-b-2 border-red-700/30">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    Register
                  </h1>
                  <span className="text-[10px] font-mono font-bold bg-gray-900 text-white px-2 py-0.5 whitespace-nowrap">FORM: INV-2026</span>
                </div>
                <p className="text-red-700 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                  New Agent Onboarding!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center justify-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer relative group"
                    >
                      <div className="w-40 h-52 border-2 border-gray-400 bg-white flex items-center justify-center overflow-hidden hover:border-red-600 transition-colors shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile"
                            className="w-full h-full object-cover grayscale"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Icons.Camera className="mx-auto text-center" />
                            <p className="text-gray-400 text-[9px] uppercase tracking-widest font-mono font-bold mt-2">
                              Secure Photo Attach
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Photo Tape Effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-400/20 mix-blend-multiply border border-gray-400/10 rotate-1 shadow-sm opacity-50"></div>
                    </motion.div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="mt-4 text-gray-500 text-[9px] uppercase font-mono tracking-widest font-black">
                      <span className="text-red-600">⚠</span> Face should be visible
                    </p>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jaydeep Nadkarni"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        Contact
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="948200XXXX"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        Relay Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="agent@gmail.com"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm"
                      />
                    </div>

                    {/* USN */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        USN
                      </label>
                      <input
                        type="text"
                        name="usn"
                        value={formData.usn}
                        onChange={handleInputChange}
                        placeholder="Your USN/SRN"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* College Dropdown */}
                <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                    Affiliated Institution
                </label>
                
                <select
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm cursor-pointer"
                >
                    <option value="">Select Institution</option>
                    {colleges.map((college, idx) => (
                    <option key={idx} value={college}>
                        {college}
                    </option>
                    ))}
                    <option value="Other">Other</option>
                </select>

                {/* Only show and bind to otherCollege if "Other" is selected */}
                {formData.college === 'Other' && (
                    <input
                    type="text"
                    name="otherCollege" // Changed name
                    value={formData.otherCollege || ''} // Uses a separate value
                    onChange={handleInputChange}
                    placeholder="Enter Institution Name"
                    className="w-full mt-2 px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm"
                    autoFocus
                    />
                )}
                </div>  

                  {/* Passwords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        Create a password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-white/50 border border-gray-400 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-red-900 text-white text-[10px] font-mono uppercase tracking-wider border-l-4 border-red-500"
                    >
                      <span className="font-bold mr-2">ERROR:</span> {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4 flex flex-col items-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="w-full max-w-sm px-6 py-4 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-red-800 disabled:opacity-50 transition-all shadow-[6px_6px_0px_#444] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      {loading ? 'SECURING IDENTITY...' : 'REGISTER'}
                    </motion.button>

                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Already authorized?</p>
                      <Link
                        to="/login"
                        className="text-xs text-gray-900 font-black uppercase tracking-widest border-b border-gray-900 pb-0.5 hover:text-red-700 hover:border-red-700 transition-all"
                      >
                        Login
                      </Link>
                    </div>
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
