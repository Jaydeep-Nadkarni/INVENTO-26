import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'
import { apiGet } from '../utils/apiClient'
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
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
        const { data } = await apiGet('/api/users/profile', navigate)
        const userData = data.user || data;
        setUser(userData)
        localStorage.setItem('currentUser', JSON.stringify(userData))
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

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Firebase sign out error:', err)
    }
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
      className="min-h-screen relative overflow-hidden bg-[#1a1a1a] font-serif flex items-center justify-center p-4 lg:p-8"
    >
      {/* Background - Dark Noir Theme */}
      <div className="fixed inset-0 z-0 bg-neutral-950" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundBlendMode: 'overlay', opacity: 0.4 }} />
      
      {isMobile ? (
        <Navbar position="absolute" isMobile={isMobile} />
      ) : (
        <Link 
          to="/" 
          className="fixed top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all group shadow-lg"
        >
          <Icons.ArrowLeft />
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:inline">Home</span>
        </Link>
      )}

      <div className="relative z-10 w-full max-w-5xl mt-20 md:mt-10">

        {/* The Stack Effect - Pages behind */}
        <div className="absolute -top-5 -left-4 w-full h-full bg-[#dfd7c2] border border-[#d4c5a3] shadow-sm transform -rotate-3 rounded z-0 opacity-60" style={{ backgroundImage: `url(${paperTexture})` }}></div>
        <div className="absolute -top-3 -left-2 w-full h-full bg-[#e8e0cc] border border-[#d4c5a3] shadow-md transform -rotate-1 rounded z-0 opacity-80" style={{ backgroundImage: `url(${paperTexture})` }}></div>
        <div className="absolute -top-1 left-1 w-full h-full bg-[#f0eadd] border border-[#d4c5a3] shadow-lg transform rotate-1 rounded z-0 opacity-95" style={{ backgroundImage: `url(${paperTexture})` }}></div>

        {/* Main Dossier Page */}
        <div className="relative bg-[#f4f1ea] w-full min-h-[600px] shadow-2l rounded-sm p-6 md:p-12 border border-[#d4c5a3] z-10" style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-black-900 uppercase tracking-tighter leading-none mb-2">AGENT
                <br/> <h1 className='text-red-900'>PROFILE</h1></h1>
              <div className="h-1.5 w-24 bg-red-900 mb-2"></div>
              <p className="font-mono text-sm text-red-800 font-bold uppercase tracking-[0.3em]">PARTICIPANT ID: INV{user?._id?.slice(-4) || '0000'}</p>
            </div>
            
            <div className="mt-6 md:mt-0 text-right">
              <p className="font-mono text-[10px] text-red-800 uppercase tracking-widest font-bold">STATUS</p>
              <p className="text-red-800 font-bold flex items-center justify-end">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                ACTIVE
              </p>
            </div>
          </div>

          {loading ? (
            <ProfileSkeleton />
          ) : user ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pb-12">
              
              {/* Photo Area */}
              <div className="md:col-span-5 lg:col-span-4">
                <div className="relative w-full aspect-[4/5] bg-white p-4 shadow-2xl border border-gray-300 transform -rotate-2">
                  {/* Paperclip */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-16 border-2 border-gray-400 rounded-full bg-gray-200/50 z-20"></div>
                  <img
                    src={user.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                    alt="Agent"
                    className="w-full h-full object-cover"
                  />
                  {/* Red Stamp Overlay */}
                  <div className="absolute bottom-6 right-6 w-28 h-28 border-4 border-red-800/40 rounded-full flex items-center justify-center -rotate-12 pointer-events-none">
                     <span className="text-red-800/40 font-bold text-xs text-center uppercase leading-none">INVENTO '26<br/>CAPTURED</span>
                  </div>
                </div>
              </div>

              {/* Bio & Details Area */}
              <div className="md:col-span-7 lg:col-span-8 space-y-10">
                <div>
                  <p className="text-lg font-mono text-red-800 uppercase tracking-widest font-bold mb-1">FULL NAME</p>
                  <h2 className="text-6xl md:text-6xl font-black text-[#1a1a1a] leading-tight tracking-tighter">{user.name}</h2>
                  <p className="text-xl md:text-xl text-[#5c5446] font-mono mt-3 uppercase">{user.clgName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t-2 border-black pt-8">
                  <div className="flex border-l-2 border-black pl-4">
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold mb-1">EMAIL ADDRESS</p>
                      <p className="font-bold text-[#1a1a1a] font-mono break-all">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex border-l-2 border-black pl-4">
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold mb-1">PHONE</p>
                      <p className="font-bold text-[#1a1a1a] font-mono">{user.phone || "---"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black">
                  <span className="bg-yellow-400 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest">PARTICIPATING EVENTS</span>
                  <div className="mt-4">
                    {user.registeredEvents && user.registeredEvents.length > 0 ? (
                      <div className="flex flex-wrap gap-2 uppercase font-mono text-sm font-bold text-[#5c5446]">
                        {user.registeredEvents.map((event, index) => (
                          <div key={index} className="bg-[#e0d7bc] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-2">
                            {event}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-[#5c5446] uppercase text-sm">NO EVENTS REGISTERED YET</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer Interactive Section */}
          <div className="mt-0 pt-12 space-y-10 border-t-2 border-black border-dotted">
            {/* Quick Links Row */}
            <div className="flex flex-wrap gap-4 align-middle justify-center font-sans">
              <button onClick={() => setShowLinksModal(true)} className="flex items-center gap-3 bg-[#fffefd] p-3 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <Icons.WhatsApp />
                <div className="text-left leading-none uppercase">
                   <p className="text-[8px] font-bold text-gray-500">LINKS</p>
                   <p className="text-xs font-bold">WHATSAPP LINKS</p>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-[#fffefd] p-3 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <Icons.PDF />
                <div className="text-left leading-none uppercase">
                   <p className="text-[8px] font-bold text-gray-500">DOWNLOAD</p>
                   <p className="text-xs font-bold">EVENTS SCHEDULE</p>
                </div>
              </button>
            </div>

            {/* Separator Dash Line */}
            <div className="w-full border-t border-dashed border-gray-400 py-4"></div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <button onClick={() => navigate('/')} className="px-12 py-5 bg-[#0a111b] text-white border-2 border-[#0a111b] shadow-[6px_6px_0px_#991b1b] font-bold uppercase tracking-[0.2em] text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                RETURN TO BASE
              </button>
              <button onClick={handleLogout} className="px-12 py-5 bg-[#b4b4b4] text-red-700 border-4 border-red-700 shadow-[6px_6px_0px_#000000] font-bold uppercase tracking-[0.2em] text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-al hover:bg-red-700 hover:text-white">
                LOG OUT
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 right-8 font-mono text-[8px] text-gray-400 uppercase pointer-events-none">
            DOSSIER_CREATED_OUT_7E/3<br/>
            SECURITY CLEARANCE LEVEL 4+
          </div>
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
                {/* Render WhatsApp links from fetched user.eventDetails if available */}
                {user && user.eventDetails && user.eventDetails.length > 0 ? (
                  user.eventDetails.map((e, idx) => {
                    const raw = e.whatsappLink || '';
                    let href = '#';
                    try {
                      if (/^https?:\/\//i.test(raw)) {
                        href = raw;
                      } else if (/^[+\d]/.test(raw)) {
                        const digits = raw.replace(/\D/g, '');
                        if (digits) href = `https://wa.me/${digits}`;
                      }
                    } catch (err) {
                      href = '#';
                    }

                    return (
                      <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-green-100 border border-green-300 hover:bg-green-200 transition-colors group">
                        <Icons.WhatsApp />
                        <span className="font-bold text-green-900 uppercase text-sm group-hover:underline">{e.name}{e.type ? ` (${e.type})` : ''}</span>
                      </a>
                    )
                  })
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">No WhatsApp links available for your events.</div>
                )}

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
