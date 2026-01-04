import React from 'react'

const Navbar = () => {
  const navItems = ['Home', 'Events', 'Schedule', 'Contact']

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-yellow-600/20">
      {/* Logo/Brand */}
      <div className="text-yellow-500 font-serif font-bold text-2xl tracking-tighter">
        INVENTO <span className="text-xs align-top opacity-70">'26</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-yellow-500/80 hover:text-yellow-400 font-mono text-sm uppercase tracking-widest transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Register Button */}
      <button className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-sm transform -skew-x-12 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(139,69,19,1)] active:translate-y-1 active:shadow-none">
        <span className="inline-block skew-x-12 uppercase tracking-tighter">Register</span>
      </button>
    </nav>
  )
}

export default Navbar
