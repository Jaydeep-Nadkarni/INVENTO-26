import React from 'react'
import tex1 from '../assets/UI/button-texture-1.png'
import tex2 from '../assets/UI/button-texture-1.png'
import tex3 from '../assets/UI/button-texture-3.png'

const Navbar = () => {
  const navItems = ['Home', 'Events', 'Schedule', 'Contact']
  const textures = [tex1, tex2, tex3]

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

      {/* Register Button - The "Power" Button */}
      <button
        style={{
          backgroundImage: `url(${tex2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="px-8 py-2 text-black font-black uppercase tracking-tighter hover:brightness-110 active:translate-y-[2px] transition-all relative overflow-hidden"
      >
        <span className="relative z-10">Register</span>
      </button>
    </nav>
  )
}

export default Navbar
