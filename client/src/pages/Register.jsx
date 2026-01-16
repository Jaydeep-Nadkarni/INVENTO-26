import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Cropper from 'react-easy-crop'
import * as faceapi from '@vladmandic/face-api'
import getCroppedImg from '../utils/cropImage'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.webp'
import Navbar from '../components/Navbar'

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
};

// SVG Icons
const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  School: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Eye: ({ className = "h-5 w-5 text-gray-700" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: ({ className = "h-5 w-5 text-gray-700" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Fingerprint: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
    </svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(isMobileDevice())
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [detecting, setDetecting] = useState(false)

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://vladmandic.github.io/face-api/model/'
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ])
        setModelsLoaded(true)
        console.log('Face detection models loaded')
      } catch (err) {
        console.error('Failed to load face detection models:', err)
      }
    }
    loadModels()
  }, [])

  // Listen for mobile/desktop switches
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const colleges = [
    'KLE Dr. MS Sheshgiri College of Engineering and Technology',
    'KLS Gogte Institute of Technology',
    'Jain Engineering College',
    'Other'
  ]

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clgName: '',
    otherCollege: '',
    password: '',
    confirmPassword: ''
  })

  // Cropper States
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const [tempImage, setTempImage] = useState(null)

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
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result)
        setIsCropping(true)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleDoneCropping = async () => {
    try {
      setDetecting(true)
      setError('')
      const croppedImage = await getCroppedImg(
        tempImage,
        croppedAreaPixels,
        rotation
      )
      
      // Face Detection
      if (modelsLoaded) {
        const img = new Image()
        img.src = croppedImage
        await new Promise((resolve) => {
          img.onload = resolve
          img.onerror = () => {
            setError("FACE DETECTION: SCANNING FAILED. PLEASE TRY A DIFFERENT IMAGE.")
            resolve() // Still resolve to exit the promise
          }
        })

        if (img.complete && img.naturalWidth !== 0) {
          const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.5
          }))
          
          if (detections.length === 0) {
            setError("FACE DETECTION: NO FACE DETECTED. ENSURE YOUR FACE IS CLEAR AND WELL-LIT.")
            setDetecting(false)
            return
          }
          
          if (detections.length > 1) {
            setError("FACE DETECTION: MULTIPLE SUBJECTS DETECTED. ONLY ONE AGENT ALLOWED PER PHOTO.")
            setDetecting(false)
            return
          }

          // Check face size (e.g. at least 25% of image width for better quality)
          const face = detections[0].box
          if (face.width < img.width * 0.15) {
            setError("FACE DETECTION: SUBJECT TOO DISTANT. PLEASE ZOOM IN TO FILL THE FRAME.")
            setDetecting(false)
            return
          }
        }
      } else {
        // Models not loaded yet
        console.warn('Face detection models not yet loaded. Skipping verification.')
      }

      setPreviewImage(croppedImage)
      setImageFile(croppedImage)
      setIsCropping(false)
      setDetecting(false)
    } catch (e) {
      console.error(e)
      setError('Failed to crop image')
      setDetecting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate inputs
    if (!formData.name || !formData.phone || !formData.email || (!formData.clgName && !formData.otherCollege) || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all mandatory fields')
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
      setError('Please enter a valid email format')
      setLoading(false)
      return
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit contact number')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Helper to convert DataURI to Blob
      const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
      };

      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('clgName', formData.clgName === 'Other' ? formData.otherCollege : formData.clgName);
      
      const imageBlob = dataURItoBlob(previewImage);
      // Append file with filename
      formDataObj.append('profilePhoto', imageBlob, 'profile.jpg');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: 'POST',
        body: formDataObj,
        // No Content-Type header needed for FormData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Success - Store token and user data, then redirect to profile
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user))
      }
      
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
      {/* Spy-themed Illustration Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path d="M100,20 C140,20 170,50 170,90 C170,130 140,160 100,160 C60,160 30,130 30,90 C30,50 60,20 100,20 Z" 
                fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5"/>
          <circle cx="100" cy="90" r="40" fill="none" stroke="#dc2626" strokeWidth="1"/>
          <path d="M80,60 L120,60 M100,40 L100,80" stroke="#dc2626" strokeWidth="2"/>
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 opacity-10 rotate-45">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <rect x="25" y="25" width="100" height="100" fill="none" stroke="#4b5563" strokeWidth="2"/>
          <path d="M75,40 L75,110 M40,75 L110,75" stroke="#4b5563" strokeWidth="1.5"/>
          <circle cx="75" cy="75" r="20" fill="none" stroke="#dc2626" strokeWidth="2"/>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-center min-h-screen p-6"
      >
        <div className="w-full max-w-6xl">
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
                    Agent Registration
                  </h1>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono font-bold bg-gray-900 text-white px-2 py-0.5 whitespace-nowrap">FORM: INV-2026</span>
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-1">TOP SECRET</span>
                  </div>
                </div>
                <p className="text-red-700 text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-600 animate-pulse"></span>
                  NEW AGENT ONBOARDING PROTOCOL
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Left Column - Photo Upload */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-8">
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-pointer group"
                        >
                          <div className="relative w-full aspect-3/4 max-w-xs mx-auto border-2 border-gray-400 bg-linear-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-red-600 transition-colors shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
                            {previewImage ? (
                              <img
                                src={previewImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-6">
                                <div className="mb-4">
                                  <Icons.Camera />
                                </div>
                                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-mono font-bold">
                                  UPLOAD IDENTIFICATION PHOTO
                                </p>
                                <p className="text-gray-500 text-[8px] uppercase tracking-wider font-mono mt-2">
                                  5MB MAX • Face Must be clearly visible
                                </p>
                              </div>
                            )}
                            {/* Spy Camera Overlay Effect */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent"></div>
                            <div className="absolute top-2 left-2 right-2 h-1 bg-red-600/10"></div>
                          </div>
                          {/* Photo Tape Effect */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-r from-gray-300 to-gray-400/50 border border-gray-400/20 rotate-1 shadow-sm opacity-60"></div>
                        </motion.div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        
                        {/* Spy Device Illustration */}
                        <div className="mt-10 p-4 bg-gradient-to-r from-gray-900/10 to-gray-900/5 border border-gray-400/30">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 bg-red-600 animate-pulse"></div>
                            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest font-bold">
                              SECURITY BRIEFING
                            </p>
                          </div>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-600 mt-1 flex-shrink-0"></div>
                              <p className="text-gray-600 text-[8px] font-mono uppercase tracking-wide leading-tight">
                                All fields are mandatory for registration
                              </p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-600 mt-1 flex-shrink-0"></div>
                              <p className="text-gray-600 text-[8px] font-mono uppercase tracking-wide leading-tight">
                                Uploaded images are secured 
                              </p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-gray-600 mt-1 flex-shrink-0"></div>
                              <p className="text-gray-600 text-[8px] font-mono uppercase tracking-wide leading-tight">
                                All the contact deatils must be valid and reachable
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Form Fields */}
                  <div className="lg:col-span-2">
                    <div className="space-y-8">
                      {/* Full Name Field */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.3em] flex items-center gap-2">
                          <Icons.User />
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Name"
                          className="w-full px-4 py-3 bg-white/60 border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono text-sm transition-all"
                        />
                      </div>

                      {/* Email & Contact Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Icons.Email />
                            EMAIL
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full px-4 py-3 bg-white/60 border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono text-sm transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Icons.Phone />
                            CONTACT
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Contact"
                            className="w-full px-4 py-3 bg-white/60 border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono text-sm transition-all"
                          />
                        </div>
                      </div>

                      {/* Institution Field */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.3em] flex items-center gap-2">
                          <Icons.Briefcase />
                          AFFILIATED INSTITUTION
                        </label>
                        <select
                          name="clgName"
                          value={formData.clgName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/60 border-2 border-gray-300 text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono text-sm cursor-pointer appearance-none"
                        >
                          <option value="">Select institution</option>
                          {colleges.map((college, idx) => (
                            <option key={idx} value={college}>
                              {college}
                            </option>
                          ))}
                          <option value="Other">Other</option>
                        </select>

                        {formData.clgName === 'Other' && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            <input
                              type="text"
                              name="otherCollege"
                              value={formData.otherCollege}
                              onChange={handleInputChange}
                              placeholder="Specify institution name"
                              className="w-full px-4 py-3 bg-white/60 border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono text-sm transition-all"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Password Fields Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Icons.Lock />
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="••••••••••"
                              className="w-full px-4 py-3 bg-white/60 border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono text-sm transition-all pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <Icons.EyeOff className="h-5 w-5" /> : <Icons.Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Icons.Fingerprint />
                            Verify Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="•••••••••••"
                              className="w-full px-4 py-3 bg-white/60 border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono text-sm transition-all pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? <Icons.EyeOff className="h-5 w-5" /> : <Icons.Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-8 p-4 bg-linear-to-r from-red-900/20 to-red-800/10 border-l-4 border-red-600"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-600 animate-pulse"></div>
                            <div>
                              <p className="text-[10px] font-mono font-black text-red-700 uppercase tracking-wider">
                                SECURITY ALERT
                              </p>
                              <p className="text-gray-700 text-[10px] font-mono mt-1">{error}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <div className="mt-12 pt-6 border-t border-gray-300">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                          <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                            Already registered?
                          </p>
                          <Link
                            to="/login"
                            className="text-xs text-gray-900 font-black uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-red-700 hover:border-red-700 transition-all inline-flex items-center gap-2"
                          >
                            <span className="w-2 h-2 bg-red-600"></span>
                            LOG IN
                          </Link>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="px-10 py-4 bg-linear-to-r from-gray-900 to-gray-800 text-white font-black uppercase tracking-[0.2em] text-xs hover:from-red-800 hover:to-red-700 disabled:opacity-50 transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 relative group"
                        >
                          <span className="relative z-10">
                            {loading ? 'INITIATING ENCRYPTION...' : 'SUBMIT'}
                          </span>
                          <div className="absolute inset-0 bg-linear-to-r from-red-700/0 via-red-600/20 to-red-700/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Image Cropper Modal (WhatsApp Style) */}
          <AnimatePresence>
            {isCropping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex flex-col bg-black"
              >
                {/* Header bar */}
                <div className="flex justify-between items-center py-6 px-8 bg-black/80 border-b border-white/10 backdrop-blur-md z-20">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsCropping(false)
                      setError('')
                    }}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] hidden sm:inline">Abort Mission</span>
                  </button>

                  <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em] font-mono">
                    Upload Your Photo
                  </h3>

                  <button
                    type="button"
                    onClick={handleDoneCropping}
                    disabled={detecting}
                    className="px-8 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all rounded-sm disabled:opacity-50 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  >
                    {detecting ? 'SCANNING...' : 'CONFIRM'}
                  </button>
                </div>

                {/* Cropper area */}
                <div className="relative flex-1 bg-neutral-900 overflow-hidden">
                  <Cropper
                    image={tempImage}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={3/4}
                    onCropChange={(c) => { setCrop(c); if (error) setError(''); }}
                    onRotationChange={(r) => { setRotation(r); if (error) setError(''); }}
                    onCropComplete={onCropComplete}
                    onZoomChange={(z) => { setZoom(z); if (error) setError(''); }}
                    showGrid={true}
                    style={{
                      containerStyle: { background: '#0a0a0a' },
                      cropAreaStyle: { border: '1px solid rgba(255,255,255,0.2)' }
                    }}
                  />
                </div>

                {/* Controls area */}
                <div className="p-12 bg-black/90 backdrop-blur-md z-20 flex flex-col items-center gap-6 border-t border-white/5">
                  <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                      {error && error.includes("FACE DETECTION") ? (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="px-4 py-3 bg-red-950/20 border border-red-500/30 rounded-sm text-center"
                        >
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-1 h-1 bg-red-500 animate-pulse rounded-full" />
                            <p className="text-red-500 text-[8px] font-black uppercase tracking-[0.2em] font-mono">
                              SYSTEM ERROR
                            </p>
                          </div>
                          <p className="text-white text-[9px] font-bold uppercase tracking-widest font-mono leading-tight px-4">
                            {error}
                          </p>
                        </motion.div>
                      ) : (
                        modelsLoaded && (
                          <motion.div
                            key="status"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-4 py-2 border rounded-sm text-center"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <p className="text-green-500 text-[8px] font-black uppercase tracking-[0.4em] font-mono whitespace-nowrap">
                                FACE DETEACTION ACTIVE
                              </p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Zoom Slider */}
                  <div className="w-full max-w-md space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] text-gray-400 font-mono tracking-widest">ZOOM: {zoom.toFixed(1)}x</span>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="text-white hover:text-red-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>
                        <button type="button" onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="text-white hover:text-red-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>

                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default Register