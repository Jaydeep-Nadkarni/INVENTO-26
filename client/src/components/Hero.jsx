import React from 'react'
import img1 from '../assets/UI/img1.png'
import img2 from '../assets/UI/img2.png'
import pin from '../assets/UI/pin.png'
import news from '../assets/UI/news.png'
import inventoLogo from '../assets/UI/invento-logo.png'
import year2026 from '../assets/UI/2026.png'
import windowsPlayer from '../assets/UI/windows-player.jpg'

const Hero = () => {
  return (
    <div className="relative w-full h-screen mx-auto flex items-center justify-center overflow-hidden p-4">
      
      {/* Center Logo Section */}
      <div className="z-20 transform hover:scale-105 transition-transform duration-300">
        <img src={inventoLogo} alt="Invento Logo" className="w-100 md:w-125 drop-shadow-2xl" />
      </div>

      {/* Top Left - Photo 1 (Hat/Spy image) */}
      <div className="absolute top-8 left-8 md:top-12 md:left-16 z-10 hidden md:block">
        <div className="relative hover:scale-105 transition-transform duration-300 w-40">
          <img src={pin} alt="pin" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 z-20" />
          <img src={img1} alt="Spy 1" className="w-full shadow-xl" />
        </div>
      </div>

      {/* Top Left - Photo 2 (Silhouette) - positioned separately */}
      <div className="absolute top-8 left-48 md:top-12 md:left-60 z-10 hidden md:block">
        <div className="relative hover:scale-105 transition-transform duration-300 w-40">
          <img src={pin} alt="pin" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 z-20" />
          <img src={img2} alt="Spy 2" className="w-full shadow-xl" />
        </div>
      </div>

      {/* Top Right - Year 2026 */}
      <div className="absolute top-16 right-12 md:top-20 md:right-24 z-10 hidden md:block">
        <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-300">
           <img src={pin} alt="pin" className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 z-20" />
           <img src={year2026} alt="2026" className="w-36 shadow-xl" />
        </div>
      </div>

      {/* Bottom Left - Newspaper Clipping */}
      <div className="absolute bottom-10 left-4 md:bottom-12 md:left-8 z-10 hidden md:block">
        <div className="relative transform duration-300">
           <img src={pin} alt="pin" className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 z-20" />
           <img src={news} alt="Newspaper" className="w-72 md:w-80 shadow-2xl" />
        </div>
      </div>

      {/* Bottom Right - Retro Video Player */}
      <div className="absolute bottom-10 right-8 md:bottom-12 md:right-10 z-10 hidden md:block">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <img src={windowsPlayer} alt="Media Player" className="w-70 md:w-[320px] shadow-2xl border-2 border-gray-600 rounded-sm" />
        </div>
      </div>

    </div>
  )
}

export default Hero