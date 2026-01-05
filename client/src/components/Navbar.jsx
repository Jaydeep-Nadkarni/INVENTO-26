import React from 'react'
import tex1 from '../assets/UI/button-texture-1.png'
import tex2 from '../assets/UI/button-texture-1.png'
import tex3 from '../assets/UI/button-texture-3.png'

const Navbar = ({ onEventsClick }) => {
  const navItems = ['Home', 'Events', 'Schedule', 'Contact']
  const textures = [tex1, tex2, tex3]

  const handleNavClick = (item, e) => {
    if (item === 'Events' && onEventsClick) {
      e.preventDefault()
      onEventsClick()
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center  justify-between">
      {/* Logo/Brand */}
      <div className="text-yellow-500 font-serif font-bold text-xl tracking-tighter">
        INVENTO <span className="text-xs align-top opacity-70">'26</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-4">
        {navItems.map((item, index) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={(e) => handleNavClick(item, e)}
            style={{
              backgroundImage: `url(${textures[index % textures.length]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              imageRendering: 'pixelated'
            }}
            className="px-5 py-2 text-gray-900 font-bold text-[10px] uppercase tracking-wider hover:brightness-110 active:border-t-black/60 active:border-l-black/60 active:border-b-white/50 active:border-r-white/50 active:translate-y-[1px] transition-all duration-75 relative overflow-hidden"
          >
            <span className="relative z-10">{item}</span>
          </a>
        ))}
      </div>

      {/* Register Button - TOP SECRET STAMP */}
      <button
        style={{
          backgroundImage: `url(${tex3})`,
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
          backgroundColor: '#991b1b'
        }}
        className="px-5 py-1.5 border-[3px] border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2),inset_0_0_10px_rgba(0,0,0,0.5)] transform active:scale-95 transition-all duration-300 flex flex-col items-center justify-center group"
      >
        <span className="text-[8px] text-red-400/80 font-mono tracking-[0.3em] font-bold">TOP SECRET</span>
        <span className="text-lg text-white font-black tracking-tighter uppercase italic leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Register
        </span>
      </button>
    </nav>
  )
}

export default Navbar
