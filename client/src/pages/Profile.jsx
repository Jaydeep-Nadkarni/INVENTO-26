import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  School: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  IdCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  ),
  Status: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 12.048-5.409 12.051-12.047a11.815 11.815 0 00-3.536-8.509z" />
    </svg>
  ),
  PDF: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H8c-1.1 0-2 .9-2 2v12H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 2h8v10h-8V4zm0 12h8v6H4v-4h8v-2z" />
      <path d="M12 16h3v2h-3v-2z" />
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  )
}

// Skeleton Component
const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4 mb-8">
      <div className="w-24 h-24 bg-[#d4c5a3]/50 rounded-full animate-pulse"></div>
      <div className="space-y-3 flex-1">
        <div className="h-6 w-3/4 bg-[#d4c5a3]/50 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-[#d4c5a3]/50 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 w-full bg-[#d4c5a3]/30 rounded animate-pulse border-b border-[#a89b85]/30"></div>
      ))}
    </div>
  </div>
);


const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(isMobileDevice())
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)

  // Listen for mobile/desktop switches
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
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

  const handleOpenLinks = (eventId) => {
    setSelectedEventId(eventId);
    setShowLinksModal(true);
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#1a1a1a] font-serif flex items-center justify-center p-4"
    >
      {/* Background - Dark Noir Theme */}
      <div className="fixed inset-0 z-0 bg-neutral-950" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundBlendMode: 'overlay', opacity: 0.4 }} />
      <Navbar />

      <div className="relative z-10 w-full max-w-4xl mt-16 md:mt-0">

        {/* The Stack Effect - Pages behind */}
        <div className="absolute top-2 left-2 w-full h-full bg-[#e8e0cc] border border-[#8c7e60] shadow-lg transform -rotate-2 rounded z-0 opacity-80" style={{ backgroundImage: `url(${paperTexture})` }}></div>
        <div className="absolute top-1 left-1 w-full h-full bg-[#f0eadd] border border-[#8c7e60] shadow-md transform rotate-1 rounded z-0 opacity-90" style={{ backgroundImage: `url(${paperTexture})` }}></div>

        {/* Main Dossier Page */}
        <div className="relative bg-[#f4f1ea] w-full min-h-[600px] shadow-2xl rounded p-8 md:p-12 border border-[#d4c5a3] z-10" style={{ backgroundImage: `url(${paperTexture})` }}>

          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07] z-0">
            <h1 className="text-8xl md:text-9xl font-black text-red-900 -rotate-45 uppercase tracking-widest whitespace-nowrap">CLASSIFIED</h1>
          </div>

          {/* Stamp */}
          <div className="absolute top-6 right-6 z-10 opacity-80">
            <div className="border-4 border-red-800 p-2 transform rotate-12">
              <span className="text-red-800 font-bold text-lg uppercase tracking-widest">TOP SECRET</span>
            </div>
          </div>

          {/* Header */}
          <div className="relative z-10 border-b-2 border-dashed border-[#8c7e60] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h2 className="text-4xl font-black text-[#1a1a1a] uppercase tracking-widest mb-1 font-teko">Agent Profile</h2>
              <p className="font-mono text-xs text-red-800 font-bold uppercase tracking-widest">Authorized Personnel Only // Level 4 Clearance</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="font-mono text-[#5c5446] text-xs uppercase">Dossier ID: {user?._id || 'UNKNOWN'}</p>
              <p className="font-mono text-[#5c5446] text-xs uppercase">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Content Area */}
          {loading ? (
            <ProfileSkeleton />
          ) : user ? (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">

              {/* Left Column: Photo & Details */}
              <div className="md:col-span-1 space-y-6">
                {/* Photo Box */}
                <div className="relative w-40 h-40 mx-auto transform -rotate-2 bg-white p-2 shadow-lg border border-gray-300">
                  <img
                    src={user.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                    alt="Agent"
                    className="w-full h-full object-cover filter sepia-[.3] contrast-110"
                  />
                  <div className="absolute -bottom-6 w-full text-center">
                    <span className="font-handwriting text-xl text-blue-900 transform -rotate-6 inline-block">Agent {user.name.split(' ')[0]}</span>
                  </div>
                  {/* Paperclip effect could go here */}
                  <div className="absolute -top-3 left-1/2 w-4 h-8 border-2 border-gray-400 rounded-full transform -translate-x-1/2 bg-gray-100 z-20"></div>
                </div>

                {/* Stats Panel */}
                <div className="bg-[#e8e4da] p-4 border border-[#8c7e60] mt-8">
                  <div className="mb-2 flex items-center">
                    <Icons.User />
                    <div>
                      <p className="text-[10px] uppercase text-[#5c5446] tracking-widest">Full Name</p>
                      <p className="font-bold text-[#1a1a1a] font-mono">{user.name}</p>
                    </div>
                  </div>
                  <div className="mb-2 flex items-center">
                    <Icons.Email />
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase text-[#5c5446] tracking-widest">Contact Frequency</p>
                      <p className="font-bold text-[#1a1a1a] font-mono text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mb-2 flex items-center">
                    <Icons.School />
                    <div>
                      <p className="text-[10px] uppercase text-[#5c5446] tracking-widest">Affiliation</p>
                      <p className="font-bold text-[#1a1a1a] font-mono leading-tight">{user.clgName}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-[#1a1a1a] text-[#f4f1ea] py-3 font-bold uppercase tracking-widest hover:bg-red-900 transition-colors shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Terminate Session
                </button>
              </div>

              {/* Right Column: Mission Log */}
              <div className="md:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1a1a1a] uppercase font-teko tracking-wide border-b-4 border-red-800 inline-block">Assigned Missions</h3>
                  <span className="bg-[#1a1a1a] text-[#f4f1ea] text-[10px] px-2 py-1 font-mono uppercase rounded">Active Status</span>
                </div>

                {user.registeredEvents && user.registeredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {user.registeredEvents.map((evt, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/60 p-4 border-l-4 border-red-800 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-white/90 transition-all"
                        onClick={() => handleOpenLinks(evt)}
                      >
                        <div>
                          <p className="font-bold text-lg text-[#1a1a1a] font-teko uppercase tracking-wide">{evt}</p>
                          <p className="text-xs text-[#5c5446] font-mono uppercase">Status: Confirmed</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-red-800 underline uppercase">View Intel</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#8c7e60] p-8 text-center bg-[#8c7e60]/5">
                    <p className="font-mono text-[#5c5446] uppercase mb-4">No active missions detected.</p>
                    <Link to="/events" className="inline-block bg-red-800 text-white px-6 py-2 font-bold uppercase tracking-widest text-sm hover:bg-red-900 transition-colors">Abort R&R / Find Mission</Link>
                  </div>
                )}

                {/* Recent Activity / Meta */}
                <div className="mt-12 pt-6 border-t border-[#8c7e60]/30">
                  <h4 className="text-sm font-bold text-[#5c5446] uppercase tracking-widest mb-4">Operations Log</h4>
                  <div className="font-mono text-xs text-[#5c5446] space-y-2">
                    <p>&gt; User verification status: <span className={user.isVerified ? "text-green-700 font-bold" : "text-red-700 font-bold"}>{user.isVerified ? "CLEARED" : "PENDING"}</span></p>
                    <p>&gt; Last login: {new Date().toLocaleString()}</p>
                    <p>&gt; Security Protocol: Encrypted (SHA-256)</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

        </div>
      </div>

      {/* Links Modal */}
      <AnimatePresence>
        {showLinksModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with click handler */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowLinksModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#f4f1ea] w-full max-w-sm p-6 border-2 border-[#1a1a1a] shadow-[20px_20px_0px_rgba(0,0,0,0.5)] z-50"
              style={{ backgroundImage: `url(${paperTexture})` }}
              onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
            >
              <div className="absolute -top-3 -right-3 bg-red-600 text-white p-1 cursor-pointer hover:bg-red-700 transition" onClick={() => setShowLinksModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>

              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-widest mb-6 font-teko border-b-2 border-black pb-2">Mission Intel</h3>

              <div className="space-y-4">
                <a href="#" className="flex items-center p-3 bg-green-100 border border-green-300 hover:bg-green-200 transition-colors group">
                  <Icons.WhatsApp />
                  <span className="font-bold text-green-900 uppercase text-sm group-hover:underline">Secure Comms Channel</span>
                </a>
                <a href="#" className="flex items-center p-3 bg-red-100 border border-red-300 hover:bg-red-200 transition-colors group">
                  <Icons.PDF />
                  <span className="font-bold text-red-900 uppercase text-sm group-hover:underline">Declassified Briefing (Rulebook)</span>
                </a>
              </div>

              <div className="mt-6 text-center">
                <p className="text-[10px] font-mono text-gray-500 uppercase">Do not share outside authorized channels.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Profile
