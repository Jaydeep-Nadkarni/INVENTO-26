import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const [isMobile, setIsMobile] = useState(isMobileDevice())

  // Listen for mobile/desktop switches
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);
  const [showLinksModal, setShowLinksModal] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('currentUser')
      
      if (!token) {
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setLoading(false)
        } else {
          navigate('/login')
        }
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (response.ok) {
          const userData = data.user || data;
          setUser(userData)
          localStorage.setItem('currentUser', JSON.stringify(userData))
        } else if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          navigate('/login')
        }
      } catch (err) {
        console.error('Fetch profile error:', err)
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}>
         <div className="text-white text-xl font-mono bg-black/50 p-4 rounded border border-red-800">LOADING AGENT DATA...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#1a1a1a] font-serif"
    >
      {/* Mobile: Lightweight flat gradient background */}
      {isMobile ? (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-gray-900 via-black to-gray-950" />
      ) : (
        // Desktop: Full background with opacity
        <div
          className="fixed inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

      <Navbar isMobile={isMobile} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-center min-h-screen pt-24 px-4 pb-12"
      >
        <div className="w-full max-w-7xl">
          {/* Document Style Card */}
          <div className="relative">
            <div
              className="rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden border-4 border-gray-800 flex flex-col md:flex-row gap-12"
              style={{
                backgroundColor: '#f4f1ea',
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-amber-50/30 mix-blend-multiply pointer-events-none" />


              {/* LEFT SIDE: Identity & Photo */}
              <div className="relative z-10 flex flex-col items-center md:items-start md:w-1/3">
                <div className="mb-8 w-full">
                  <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tighter uppercase mb-2">
                    AGENT <span className="text-red-700">PROFILE</span>
                  </h1>
                  <div className="h-2 w-24 bg-red-800 mb-4 transition-all duration-500 group-hover:w-full"></div>
                  <p className="text-red-600 text-lg font-mono font-bold tracking-[0.3em] uppercase opacity-70">
                    participant ID: {user._id ? user._id.substring(user._id.length - 4) : (user.id ? String(user.id).substring(String(user.id).length - 4) : '####')}
                  </p>
                </div>

                <div className="relative group">
                  <div className="w-56 h-72 md:w-64 md:h-80 border-4 border-gray-800 bg-white overflow-hidden flex items-center justify-center shadow-[10px_10px_20px_rgba(0,0,0,0.3)] transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto.startsWith('data:') || user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`}
                        alt="Profile"
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    ) : (
                      <div className="text-gray-300 text-8xl grayscale opacity-50 font-black">?</div>
                    )}
                  </div>
                  {/* Photo paper clips or corners? Let's add a subtle tape effect */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-gray-400/30 mix-blend-multiply border border-gray-400/20 rotate-1 shadow-sm"></div>
                  
                  {/* Stamp overlay */}
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-red-600/30 rounded-full flex items-center justify-center -rotate-12 pointer-events-none opacity-40">
                    <div className="text-red-600 font-bold text-center text-xs leading-none">
                      INVENTO '26<br/>CERTIFIED<br/>SPY
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Dossier Details */}
              <div className="relative z-10 flex-1 flex flex-col md:pt-14">
                <div className="grid grid-cols-1 gap-12">
                  {/* Name & Basic Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-[0.2em] opacity-80">Full Name</label>
                      <p className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{user.name}</p>
                      <div className="h-0.5 w-full bg-gray-300 mt-2 opacity-50"></div>
                      <p className="text-lg font-mono font-bold text-gray-500 uppercase mt-2 tracking-widest">{user.clgName || user.college}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-[0.2em] opacity-80">Status</label>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]"></span>
                        <p className="text-sm font-mono font-bold text-red-700 uppercase tracking-widest italic">Active</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Affiliation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-1 border-l-4 border-gray-900 pl-4">
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest opacity-70">Email Address</label>
                      <p className="text-xl font-bold text-gray-800 font-sans italic break-all">{user.email}</p>
                    </div>
                    <div className="space-y-1 border-l-4 border-gray-900 pl-4">
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest opacity-70">Phone</label>
                      <p className="text-2xl font-black text-gray-800 tracking-widest font-mono leading-none">{user.phone || user.contact}</p>
                    </div>
                  </div>

                  {/* Operational Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-300">
                    {/* Events Participated */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono font-bold text-gray-900 uppercase tracking-widest bg-yellow-400 px-2 py-0.5">Participating Events</label>
                      <ul className="space-y-1">
                        {user.registeredEvents && user.registeredEvents.length > 0 ? (
                          user.registeredEvents.map((event, i) => (
                            <li key={i} className="text-sm font-mono font-bold text-gray-800 flex items-center gap-2 uppercase">
                              <span className="text-red-600">»</span> {event}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm font-mono text-gray-500 italic uppercase">No events registered yet</li>
                        )}
                      </ul>
                    </div>

                    {/* Pending Dues */}
                    {user.pendingDues > 0 && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-mono font-bold text-white uppercase tracking-widest bg-red-600 px-2 py-0.5 animate-pulse">Pending Resources</label>
                        <div className="p-3 border-2 border-dashed border-red-600 bg-red-50">
                          <p className="text-xl font-black text-red-700 font-mono tracking-tighter">
                            AMT DUE: ₹{user.pendingDues}
                          </p>
                          <p className="text-[8px] font-mono text-red-800 uppercase mt-1">Settle immediately at command center</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Social & Downloads */}
                  <div className="space-y-6 pt-6 border-t border-gray-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
                      <div className="flex flex-wrap gap-4">
                        {/* View Pass Button - Only for Paid Users */}
                        {user.payment && (
                          <Link 
                            to="/pass" 
                            className="flex items-center gap-3 bg-white border-2 border-gray-800 px-4 py-2 hover:bg-gray-50 transition-all shadow-[4px_4px_0px_#111] group"
                          >
                            <div className="w-8 h-8 rounded-sm bg-[#f5c842] flex items-center justify-center text-black shadow-sm transition-transform group-hover:scale-110">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <span className="block text-[8px] font-mono font-black text-gray-500 uppercase leading-none text-[#b48e1b]">Access</span>
                              <span className="block text-xs font-black text-gray-800 uppercase tracking-tight">View Pass</span>
                            </div>
                          </Link>
                        )}

                        {/* WhatsApp Operational Links Button */}
                        <button
                          onClick={() => setShowLinksModal(true)}
                          className="flex items-center gap-3 bg-white border-2 border-gray-800 px-4 py-2 hover:bg-gray-50 transition-all shadow-[4px_4px_0px_#111] group"
                        >
                          <div className="w-8 h-8 rounded-sm bg-green-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 7.454c-1.679 0-3.325-.45-4.766-1.302l-.342-.204-3.548.93 1.053-3.46-.224-.356C3.935 16.035 3.4 14.356 3.4 12.613 3.4 8.761 6.528 5.633 10.387 5.633c1.868 0 3.623.727 4.945 2.049 1.321 1.321 2.048 3.078 2.048 4.945 0 3.853-3.127 6.98-6.984 6.984m8.46-15.442c-2.261-2.258-5.267-3.5-8.47-3.5-6.6 0-11.97 5.37-11.97 11.97 0 2.11.55 4.167 1.59 6.01L2 22l4.89-1.28c1.77 1.04 3.8 1.59 5.8 1.59 6.6 0 11.99-5.38 11.99-11.98 0-3.2-.24-6.21-2.51-8.47z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <span className="block text-[8px] font-mono font-black text-gray-500 uppercase leading-none text-green-700">Links</span>
                            <span className="block text-xs font-black text-gray-800 uppercase tracking-tight">WhatsApp Links</span>
                          </div>
                        </button>

                        <button className="flex items-center gap-3 bg-white border-2 border-gray-800 px-4 py-2 hover:bg-gray-50 transition-all shadow-[4px_4px_0px_#111]">
                          <div className="w-8 h-8 rounded-sm bg-red-700 flex items-center justify-center text-white font-bold text-xs uppercase">PDF</div>
                          <div className="text-left">
                            <span className="block text-[8px] font-mono font-black text-gray-500 uppercase leading-none">Download</span>
                            <span className="block text-xs font-black text-gray-800 uppercase tracking-tight">Events Schedule</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Registration meta */}
                  <div className="pt-8 mt-4 border-t-2 border-dashed border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                      <div className="bg-red-50 p-3 border-l-4 border-red-600 max-w-sm">
                        <p className="text-[10px] font-mono font-bold text-red-800 uppercase leading-relaxed">
                          <span className="text-sm mr-1"></span>Official passes and entry credentials will be dispatched to your registered email address within 48 hours
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-gray-400 italic uppercase">
                          Dossier created on: {user.registeredAt ? new Date(user.registeredAt).toLocaleString() : 'N/A'}
                        </p>
                        <p className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-widest mt-0.5">Security Clearance: Level 4+</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-12 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="group relative px-8 py-3 bg-gray-900 text-white font-black uppercase tracking-widest text-xs shadow-[5px_5px_0px_#991b1b] hover:shadow-[8px_8px_0px_#991b1b] transition-all"
                  >
                    RETURN TO BASE
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="px-8 py-3 border-2 md:border-4 border-red-800 text-red-800 font-black uppercase tracking-widest text-xs hover:bg-red-800 hover:text-white shadow-[5px_5px_0px_rgba(0,0,0,0.8)] transition-all"
                  >
                    LOG OUT
                  </motion.button>
                </div>
              </div>

              {/* Decorative side elements */}
              <div className="absolute right-0 top-0 h-full w-2 flex flex-col gap-1 py-4 opacity-20 hidden md:flex">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-full h-1 bg-gray-400"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* WhatsApp Links Modal */}
      {showLinksModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowLinksModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-lg bg-[#f4f1ea] border-4 border-gray-900 shadow-[10px_10px_0px_#111] overflow-hidden"
            style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
          >
            <div className="p-1 px-4 border-b-4 border-gray-900 bg-gray-900 flex justify-between items-center">
              <span className="text-white font-mono font-bold text-xs uppercase tracking-[0.2em]">operational_links.log</span>
              <button
                onClick={() => setShowLinksModal(false)}
                className="text-white hover:text-red-500 font-bold transition-colors"
              >
                [✕]
              </button>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Operational frequencies</h3>
                <p className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-widest mt-1">Status: encrypted / authorized agents only</p>
              </div>

              <div className="space-y-4">
                {/* Main HQ */}
                <div className="p-4 border-2 border-dashed border-gray-400 bg-white/50 group hover:border-green-600 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Main HQ - INVENTO '26</p>
                      <p className="text-[9px] font-mono text-gray-500 uppercase">Primary communication channel</p>
                    </div>
                    <a
                      href="https://whatsapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-green-700 shadow-[3px_3px_0px_#111] active:translate-y-px active:shadow-none transition-all"
                    >
                      Connect
                    </a>
                  </div>
                </div>

                {/* Dynamic Event Links placeholder */}
                <div className="py-4 text-center">
                  <p className="text-[10px] font-mono text-gray-400 italic uppercase">
                    {user.registeredEvents && user.registeredEvents.length > 0 
                      ? "Individual mission channel links will update as they become operational."
                      : "Register for operations to unlock mission-specific channels."}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-300">
                <button
                  onClick={() => setShowLinksModal(false)}
                  className="w-full py-3 bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-red-800 transition-colors shadow-[4px_4px_0px_#444]"
                >
                  Close Secure Link
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
