import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import tex1 from '../assets/UI/button-texture-1.png'
import tex2 from '../assets/UI/button-texture-1.png'
import tex3 from '../assets/UI/button-texture-3.png'

const Navbar = ({ onEventsClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const textures = [tex1, tex2, tex3]

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Schedule', path: '/schedule' },
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
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between">
      {/* Logo/Brand */}
      <Link to="/" className="text-yellow-500 font-serif font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
        INVENTO <span className="text-xs align-top opacity-70">'26</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-4">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            to={item.path}
            style={{
              backgroundImage: `url(${textures[index % textures.length]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              imageRendering: 'pixelated',
              WebkitImageRendering: 'pixelated'
            }}
            className="px-5 py-2 text-gray-900 font-bold text-[10px] uppercase tracking-wider hover:brightness-110 active:border-t-black/60 active:border-l-black/60 active:border-b-white/50 active:border-r-white/50 active:translate-y-[1px] transition-all duration-75 relative overflow-hidden"
          >
            <span className="relative z-10">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <button
            type="button"
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full border-2 border-yellow-500 overflow-hidden hover:border-yellow-300 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center bg-gray-800"
            title="View Profile"
          >
            {currentUser.profilePhoto ? (
              <img
                src={currentUser.profilePhoto.startsWith('data:') || currentUser.profilePhoto.startsWith('http') ? currentUser.profilePhoto : `http://localhost:5000${currentUser.profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg"></span>
            )}
          </button>
        ) : (
          <button
            onClick={handleRegisterClick}
            className="group transform hover:scale-105 hover:active:scale-95 transition-all duration-300 focus:outline-none"
          >
            <div className="relative border-[6px] border-red-700 px-1 py-1
              opacity-90 mix-blend-multiply bg-transparent
              cursor-pointer
            "
              style={{
                maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                maskMode: 'alpha',
                WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                WebkitMaskSize: 'contain'
              }}>
              <div className="border-[2px] border-red-700/90 px-3 py-1">
                <span className="block text-red-700 font-black font-sans text-xl md:text-xl tracking-tighter uppercase leading-[0.85] select-none">
                  REGISTER NOW
                </span>
              </div>
            </div>
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
