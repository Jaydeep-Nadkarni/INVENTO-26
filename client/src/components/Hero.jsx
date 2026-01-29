import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import img1 from '../assets/UI/img1.png'
import img2 from '../assets/UI/img2.png'
import pin from '../assets/UI/pin.png'
import news from '../assets/UI/BREAKING.png'
import paperTexture from '../assets/UI/paper-texture.jpg'
import year2026 from '../assets/UI/2026.png'
import handprint from '../assets/UI/handprint.webp'
import windowsPlayer from '../assets/UI/windows-player.jpg'
import inventoLogo from '../assets/UI/Invento-logo.png'

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  React.useEffect(() => {
    const calculateCountdown = () => {
      // Target: February 26, 2026 at 12:00 AM (midnight)
      const targetDate = new Date(2026, 1, 26, 0, 0, 0).getTime() // Month is 0-indexed
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      className="mt-2 relative"
    >
      {/* Elegant Dark Background with Gradient */}
      <div className="relative bg-transparent rounded-lg px-6 sm:px-8 md:px-12 py-2 sm:py-8 md:py-2 mx-4 overflow-hidden ">
        {/* Decorative light effects */}


        {/* Main Content */}
        <div className="relative flex flex-col items-center gap-4">

          {/* Timer Display */}
          <div className="flex gap-2 sm:gap-4 md:gap-4 justify-center items-center">
            {/* Days */}
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl md:text-8xl leading-none"
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  fontVariantNumeric: 'tabular-nums', 
                  color: 'white',
                  WebkitTextStroke: '2px black',
                  textShadow: '4px 4px 0px #000',
                  paintOrder: 'stroke fill'
                }}>
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="mt-2 text-lg sm:text-lg tracking-widest" 
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  color: 'white',
                  WebkitTextStroke: '1px black',
                  textShadow: '2px 2px 0px #000',
                  paintOrder: 'stroke fill'
                }}>
                Days
              </span>
            </div>

            {/* Colon */}
            <div className="pb-8 md:pb-10">
              <span className="text-5xl sm:text-6xl md:text-7xl" 
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  color: 'white',
                  WebkitTextStroke: '2px black',
                  textShadow: '4px 4px 0px #000',
                  paintOrder: 'stroke fill'
                }}>:</span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl md:text-8xl leading-none"
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  fontVariantNumeric: 'tabular-nums', 
                  color: 'white',
                  WebkitTextStroke: '2px black',
                  textShadow: '4px 4px 0px #000',
                  paintOrder: 'stroke fill'
                }}>
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="mt-2 text-lg sm:text-lg tracking-widest" 
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  color: 'white',
                  WebkitTextStroke: '1px black',
                  textShadow: '2px 2px 0px #000',
                  paintOrder: 'stroke fill'
                }}>
                Hours
              </span>
            </div>

            {/* Colon */}
            <div className="pb-8 md:pb-10">
              <span className="text-5xl sm:text-6xl md:text-7xl" 
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  color: 'white',
                  WebkitTextStroke: '2px black',
                  textShadow: '4px 4px 0px #000',
                  paintOrder: 'stroke fill'
                }}>:</span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl md:text-8xl leading-none"
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  fontVariantNumeric: 'tabular-nums', 
                  color: 'white',
                  WebkitTextStroke: '2px black',
                  textShadow: '4px 4px 0px #000',
                  paintOrder: 'stroke fill'
                }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="mt-2 text-lg sm:text-lg tracking-widest" 
                style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  color: 'white',
                  WebkitTextStroke: '1px black',
                  textShadow: '2px 2px 0px #000',
                  paintOrder: 'stroke fill'
                }}>
                Minutes
              </span>
            </div> 
          </div>
        </div>
      </div>

      {/* Glow effect shadow */}

    </motion.div>
  )
}

const Hero = () => {
  const navigate = useNavigate();

  const handleEasterEgg = () => {
    navigate('/something');
  };

  const handleNewspaper = () => {
    navigate('/newspaper');
  };
  
  const handleDevelopers = () => {
    navigate('/developers');
  }

  return (
    <div className="relative w-full max-w-[90%] h-screen mx-auto flex items-center justify-center overflow-hidden pt-20 md:pt-24">

      {/* Center Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-20 transform flex flex-col items-center"
      >
        <div className="relative mb-6">
          <img src={inventoLogo} alt="INVENTO Logo" className="h-48 md:h-72 w-auto drop-shadow-2xl" />
        </div>
        <CountdownTimer />
      </motion.div>

      {/* Pins and Photos - Static on Desktop, Hidden on Mobile */}
      <div className="absolute top-20 left-4 md:top-32 md:left-8 z-10 hidden md:block">
        <motion.div
          onClick={handleEasterEgg}
          className="relative w-32 md:w-36 cursor-pointer"
        >
          <img src={pin} alt="pin" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 z-20" />
          <img src={img1} alt="Spy 1" className="w-full shadow-xl" />
        </motion.div>
      </div>

      <div className="absolute top-20 left-36 md:top-18 md:left-48 z-10 hidden lg:block">
        <motion.div
          onClick={handleEasterEgg}
          className="relative w-32 md:w-36 cursor-pointer"
        >
          <img src={pin} alt="pin" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 z-20" />
          <img src={img2} alt="Spy 2" className="w-full shadow-xl" />
        </motion.div>
      </div>

      <div className="absolute top-20 right-4 md:top-24 md:right-8 z-10 hidden md:block">
        <div className="relative transform flex items-start gap-2">
          {/* Handprint on the left */}
          <motion.div
            onClick={handleDevelopers}
            className="relative rotate-0 cursor-pointer"
          >
            <img src={pin} alt="pin" className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 z-20" />
            <img src={handprint} alt="handprint" className="w-16 md:w-36 opacity-70 transform" />
          </motion.div>
          {/* 2026 card with pin */}
          <motion.div
            onClick={handleEasterEgg}
            className="relative top-20 -rotate-6 ml-6 cursor-pointer"
          >
            <img src={pin} alt="pin" className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 z-20" />
            <img src={year2026} alt="2026" className="w-28 md:w-32 shadow-xl" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-2 md:bottom-16 md:left-24 z-10 hidden md:block">
        <motion.div
          onClick={handleNewspaper}
          className="relative transform cursor-pointer"
        >
          {/* Paper textured background for newspaper */}
          <div
            className="w-56 md:w-50 shadow-2xl relative z-10 rounded-sm overflow-hidden"
            style={{
              backgroundImage: `url(${paperTexture})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              padding: '4px'
            }}
          >
            {/* Newspaper artwork sits above the texture; use multiply to blend slightly */}
            <img
              src={news}
              alt="Newspaper"
              className="w-full block"
              style={{ mixBlendMode: 'multiply', display: 'block' }}
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-4 md:bottom-12 md:right-8 z-10 hidden md:block">
        <motion.div
          onClick={handleEasterEgg}
          className="transform cursor-pointer"
        >
          <img src={windowsPlayer} alt="Media Player" className="w-56 md:w-72 shadow-2xl border-2 border-gray-600 rounded-sm" />
        </motion.div>
      </div>

    </div>
  )
}

export default Hero
