import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { shouldSkipAnimations } from '../utils/performanceOptimization'
import tex1 from '../assets/UI/button-texture-1.webp'
import tex2 from '../assets/UI/button-texture-3.webp'
import tex3 from '../assets/UI/button-texture-3.webp'
import registerBtn from '../assets/UI/register.png'
import inventoLogo from '../assets/UI/Invento-logo.png'

const Navbar = ({ onEventsClick, isMobile, position = 'fixed', light = false }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const textures = [tex1, tex2, tex3]

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('scroll-locked')
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('scroll-locked')
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('scroll-locked')
    }
  }, [mobileMenuOpen, isMobile])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Sponsors', path: '/sponsors' },
    { label: 'Contact', path: '/contact' }
  ]

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser')
    if (user) {
      try {
        setCurrentUser(JSON.parse(user))
      } catch (error) {
        console.error('Error parsing user:', error)
        setCurrentUser(null)
      }
    } else {
      setCurrentUser(null)
    }
  }, [location])

  const handleRegisterClick = () => {
    navigate('/register')
    setMobileMenuOpen(false)
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setMobileMenuOpen(false)
  }

  const handleNavClick = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`${position} top-0 left-0 w-full z-50 px-4 h-16 md:px-6 py-3 md:py-4 flex items-center justify-between transition-colors duration-300 ${
      mobileMenuOpen 
        ? 'bg-black' 
        : (scrolled 
            ? (light ? 'bg-white/10 shadow-sm' : '')
            : 'bg-transparent')
    }`}>
      {/* Logo/Brand */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img src={inventoLogo} alt="INVENTO" className="h-12 md:h-14 w-auto" />
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-4">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            to={item.path}
            style={!light ? {
              backgroundImage: `url(${textures[index % textures.length]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              imageRendering: 'pixelated',
              WebkitImageRendering: 'pixelated'
            } : {}}
            className={`px-5 py-2 font-bold text-[10px] uppercase tracking-wider transition-all duration-75 relative overflow-hidden ${
              light 
                ? 'text-stone-900 hover:text-red-600 active:translate-y-[1px]' 
                : 'text-gray-900 hover:brightness-110 active:border-t-black/60 active:border-l-black/60 active:border-b-white/50 active:border-r-white/50 active:translate-y-[1px]'
            }`}
          >
            <span className="relative z-10">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Section & Mobile Menu Toggle */}
      <div className="flex items-center gap-4 mt-0">
        {/* Mobile Hamburger Menu Button */}
        {isMobile && (
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`md:hidden flex flex-col gap-1.5 transition-colors ${mobileMenuOpen ? 'text-white' : (light ? 'text-stone-900' : 'text-white')} hover:text-yellow-500`}
        aria-label="Toggle menu"
      >
        <motion.span 
          animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          transition={shouldSkipAnimations() ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
          className="block w-6 h-0.5 bg-current origin-center"
        />
        <motion.span 
          animate={mobileMenuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
          transition={shouldSkipAnimations() ? { duration: 0 } : { duration: 0.2, ease: "easeInOut" }}
          className="block w-6 h-0.5 bg-current"
        />
        <motion.span 
          animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          transition={shouldSkipAnimations() ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
          className="block w-6 h-0.5 bg-current origin-center"
        />
      </button>
    )}

        {currentUser ? (
          <button
            type="button"
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full border-2 border-yellow-500 overflow-hidden hover:border-yellow-300 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center bg-gray-800"
            title="View Profile"
          >
            {currentUser.profilePhoto ? (
              <img
                src={
                  currentUser.profilePhoto.startsWith('data:') || currentUser.profilePhoto.startsWith('http') 
                    ? currentUser.profilePhoto 
                    : `${import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')}${currentUser.profilePhoto}`
                }
                alt="Profile"
                onError={(e) => console.error('Navbar image failed:', e.target.src)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg"></span>
            )}
          </button>
        ) : (
          !isMobile && (
            <button
              onClick={handleRegisterClick}
              className="group transform cursor-pointer active:scale-95 transition-all duration-300 focus:outline-none hidden md:block"
            >
              <img 
                src={registerBtn} 
                alt="Register Now" 
                className="w-40 md:w-40 h-auto object-contain" 
              />
            </button>
          )
        )}
      </div>

      {/* Mobile Navigation Menu - Animated Sidebar */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={shouldSkipAnimations() ? { opacity: 0 } : { opacity: 0, y: -20 }}
            animate={shouldSkipAnimations() ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldSkipAnimations() ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={shouldSkipAnimations() ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 top-16 left-0 w-full bg-black z-40 overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-6 min-h-full">
              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <motion.button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  whileHover={shouldSkipAnimations() ? {} : { x: 8, color: '#fbbf24' }}
                  className="text-left text-white font-bold text-sm uppercase tracking-wider hover:text-yellow-500 transition-colors pb-2 border-b border-gray-700"
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Mobile-only menu items */}
              {isMobile && (
                <>
                  <motion.button
                    onClick={() => handleNavClick('/concert')}
                    whileHover={shouldSkipAnimations() ? {} : { x: 8, color: '#fbbf24' }}
                    className="text-left text-white font-bold text-sm uppercase tracking-wider hover:text-yellow-500 transition-colors pb-2 border-b border-gray-700"
                  >
                    Concert
                  </motion.button>
                  <motion.button
                    onClick={() => handleNavClick('/developers')}
                    whileHover={shouldSkipAnimations() ? {} : { x: 8, color: '#fbbf24' }}
                    className="text-left text-white font-bold text-sm uppercase tracking-wider hover:text-yellow-500 transition-colors pb-2 border-b border-gray-700"
                  >
                    Developers
                  </motion.button>
                </>
              )}

              {/* Register button in mobile menu if not logged in */}
              {!currentUser && (
                <button
                  onClick={handleRegisterClick}
                  className="mt-6 self-center transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
                >
                  <img 
                    src={registerBtn} 
                    alt="Register Now" 
                    className="w-48 h-auto object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" 
                  />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay - Close on click */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={shouldSkipAnimations() ? {} : { opacity: 0 }}
            animate={shouldSkipAnimations() ? { opacity: 1 } : { opacity: 1 }}
            exit={shouldSkipAnimations() ? {} : { opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 top-16"
          />
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar

