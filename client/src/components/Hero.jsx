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
    <div className="relative w-full w-max-[90%] h-screen mx-auto flex items-center justify-center overflow-hidden p-4">
      
      {/* Center Logo Section */}
      <div className="z-20 transform flex flex-col items-center">
        <div className="relative">
          {/* Main Text */}
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-red-700 drop-shadow-2xl" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                textShadow: '2px 2px 0px #000, 4px 4px 0px #444, 6px 6px 15px rgba(0,0,0,0.5)'
              }}>
            INVENTO
          </h1>
          
          {/* Top Secret Stamp */}
          <div className="absolute -top-6 -right-12 transform rotate-12 border-4 border-red-600 px-2 py-1 text-red-600 font-bold text-xl uppercase tracking-widest opacity-80 mix-blend-multiply">
            Top Secret
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-2 bg-black/80 text-yellow-500 px-4 py-1 rounded border border-yellow-600/50 backdrop-blur-sm">
          <p className="text-lg md:text-xl font-mono tracking-[0.2em] uppercase">
            Spyverse 2026
          </p>
        </div>
        
        <p className="mt-4 text-white italic font-serif text-sm md:text-base max-w-xs text-center">
          "Smiles in the Spotlight, Secrets in the Shadow"
        </p>
      </div>

      {/* Top Left - Photo 1 (Hat/Spy image) */}
      <div className="absolute top-8 left-8 md:top-12 md:left-16 z-10 hidden md:block">
        <div className="relative w-40">
          <img src={pin} alt="pin" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 z-20" />
          <img src={img1} alt="Spy 1" className="w-full shadow-xl" />
        </div>
      </div>

      {/* Top Left - Photo 2 (Silhouette) - positioned separately */}
      <div className="absolute top-8 left-48 md:top-12 md:left-60 z-10 hidden md:block">
        <div className="relative w-40">
          <img src={pin} alt="pin" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 z-20" />
          <img src={img2} alt="Spy 2" className="w-full shadow-xl" />
        </div>
      </div>

      {/* Top Right - Year 2026 */}
      <div className="absolute top-16 right-12 md:top-20 md:right-24 z-10 hidden md:block">
        <div className="relative transform rotate-3 ">
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
        <div className="transform">
          <img src={windowsPlayer} alt="Media Player" className="w-70 md:w-[320px] shadow-2xl border-2 border-gray-600 rounded-sm" />
        </div>
      </div>

    </div>
  )
}

export default Hero