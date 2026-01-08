import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Briefcase from '../components/Briefcase'
import BriefcaseInsider from '../components/BriefcaseInsider'
import Loader from '../components/Loader'
import introVideo from '../assets/UI/intro.mp4'
import introAudio from '../assets/UI/intro.mp3'
import openSound from '../assets/audios/briefcase-open2.mp3'
import closeSound from '../assets/audios/briefcase-open.mp3'

// Track session status globally using sessionStorage to persist across navigations
const getSessionPlayed = () => sessionStorage.getItem('hasPlayedIntro') === 'true';

const Home = () => {
  const navigate = useNavigate()
  const [hasClicked, setHasClicked] = useState(getSessionPlayed())
  const [isLoading, setIsLoading] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [isBriefcaseOpen, setIsBriefcaseOpen] = useState(false)
  const [showCallout, setShowCallout] = useState(false)
  
  const hoverTimerRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  // Reset session flag in sessionStorage on every fresh mount if desired
  // but the user said "if session=1 load it", implying if it's session 1, load.
  // We'll treat the current mount as "session 1" if hasn't clicked.

  const playSound = (audioFile) => {
    const audio = new Audio(audioFile)
    audio.play().catch(e => console.log("Audio play failed:", e))
  }

  useEffect(() => {
    // Check if session=1 is in URL or sessionStorage
    const params = new URLSearchParams(window.location.search);
    if (params.get('session') === '1' && !getSessionPlayed()) {
      handleStartClick();
    }
    
    // Preload critical assets for Home page
    const img = new Image()
    img.src = bgImage
  }, [])

  const handleStartClick = () => {
    setHasClicked(true)
    setIsLoading(true)
    
    // CRITICAL: Unlocking the audio context with a "warm-up" play.
    // This captures the user gesture and ensures audio can play automatically 
    // when the intro video starts without needing another click.
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 1;
        })
        .catch(e => console.log("Audio unlock failed on gesture:", e));
    }
  }

  const handleLoaderComplete = () => {
    setIsLoading(false)
    setShowIntro(true)
  }

  const handleVideoEnd = () => {
    sessionStorage.setItem('hasPlayedIntro', 'true');
    setShowIntro(false)
    fadeAudioOut()
  }

  const skipIntro = () => {
    sessionStorage.setItem('hasPlayedIntro', 'true');
    setShowIntro(false)
    fadeAudioOut()
  }

  const fadeAudioOut = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeDuration = 10000;
      const fadeInterval = 100;
      const volumeStep = 1 / (fadeDuration / fadeInterval);

      const fade = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume -= volumeStep;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fade);
        }
      }, fadeInterval);
    }
  }

  useEffect(() => {
    if (showIntro && videoRef.current && audioRef.current) {
      const playIntro = async () => {
        try {
          audioRef.current.volume = 1; // Ensure volume is up
          await audioRef.current.play();
          await videoRef.current.play();
        } catch (error) {
          console.error("Playback failed:", error);
        }
      };
      playIntro();
    }
  }, [showIntro])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showIntro) {
        skipIntro()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showIntro])

  const handleOpenBriefcase = () => {
    playSound(openSound)
    setIsBriefcaseOpen(true)
    setShowCallout(false)
  }

  const handleCloseBriefcase = () => {
    playSound(closeSound)
    setIsBriefcaseOpen(false)
  }

  const handleNavigateToEvents = () => {
    navigate('/events')
  }

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setShowCallout(true)
    }, 3000)
  }

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
    // We don't necessarily hide it immediately, 
    // maybe keep it for a bit or let it finish animation
  }

  // Effect to hide callout after some time if it's shown
  useEffect(() => {
    if (showCallout) {
      const timer = setTimeout(() => setShowCallout(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showCallout])

  return (
    <>
      <audio ref={audioRef} src={introAudio} preload="auto" />
      
      <AnimatePresence mode="wait">
        {!hasClicked && (
          <motion.div 
            key="trigger"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-500 bg-[#f5f5f5] flex flex-col items-center justify-center font-mono overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-8 z-10"
            >
              <div className="text-red-700 text-sm tracking-[0.5em] font-bold uppercase animate-pulse">
                [ System Authentication Required ]
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartClick}
                className="bg-red-700 text-white px-12 py-4 text-sm tracking-[0.3em] font-black uppercase hover:bg-black transition-colors duration-300 shadow-2xl relative group"
              >
                <span className="relative z-10">Initialize Session</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </motion.button>

              <div className="text-gray-400 text-[10px] tracking-widest mt-4">
                Click to Authorize Classified Access
              </div>
            </motion.div>
          </motion.div>
        )}

        {isLoading && (
          <Loader key="loader" onComplete={handleLoaderComplete} />
        )}

        {showIntro && (
          <motion.div
            key="intro-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-400 bg-black cursor-pointer"
            onClick={() => {
              videoRef.current?.play();
              audioRef.current?.play();
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover"
              playsInline
              preload="auto"
            >
              <source src={introVideo} type="video/mp4" />
            </video>
            
            <button 
              onClick={skipIntro}
              className="absolute bottom-10 right-10 z-410 text-white/50 hover:text-white font-mono text-xs tracking-widest uppercase border border-white/20 px-4 py-2 bg-black/50 backdrop-blur-sm transition-all"
            >
              Skip Intro [ESC]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full bg-[#0a0a0a] relative overflow-x-hidden selection:bg-red-700/30 transition-opacity duration-1000 ${!hasClicked || isLoading || showIntro ? 'opacity-0' : 'opacity-100'}`}>
        {/* Fixed Background with subtle blur */}
      <div
        className='fixed inset-0 bg-cover bg-center bg-no-repeat z-0'
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'></div>
      </div>

      <Navbar onEventsClick={handleNavigateToEvents} />

      {/* Hero Section */}
      <section className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <Hero />
      </section>

      {/* Separation Spacing */}
      <div className="h-[20vh] relative z-10"></div>

      {/* Briefcase Section */}
      <section className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-center py-20 px-4 transition-all duration-700 ${isBriefcaseOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-250 aspect-video flex flex-col items-center"
        >
          {/* Simple Text with Ease Out In */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-black text-red-700 uppercase tracking-tighter drop-shadow-lg"
              style={{ textShadow: '2px 2px 0px #000' }}>
              The Evidence
            </h2>
            <p className="font-mono text-yellow-500/70 text-xs md:text-sm mt-3 tracking-[0.3em]">
              [ CLASSIFIED ASSET #4092-B ]
            </p>
          </motion.div>

          {/* Large Bag Viewport */}
          <div
            className="w-full grow h-125 md:h-150 relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Briefcase onClick={handleOpenBriefcase} />

            {/* Techie Callout */}
            <AnimatePresence>
              {showCallout && (
                <TechieCallout />
              )}
            </AnimatePresence>

            {/* Scroll Trigger for Callout - Active once per refresh */}
            <motion.div
              onViewportEnter={() => setShowCallout(true)}
              viewport={{ once: true, amount: 0.5 }}
              className="absolute inset-0 pointer-events-none"
            />
          </div>
        </motion.div>
      </section>


      {/* Insider View */}
      <BriefcaseInsider
        isOpen={isBriefcaseOpen}
        onClose={handleCloseBriefcase}
        onNavigateToEvents={handleNavigateToEvents}
      />

      {/* Footer Space */}
      {!isBriefcaseOpen && (
        <div className="h-[20vh] relative z-10 bg-linear-to-t from-black via-black/20 to-transparent"></div>
      )}
    </div>
    </>
  )
}

const TechieCallout = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-1/4 right-[10%] pointer-events-none z-30 hidden md:block"
    >
      <svg width="250" height="150" viewBox="0 0 250 150" fill="none">
        {/* Animated Connected Line */}
        <motion.path
          d="M 10 140 L 80 80 L 240 80"
          stroke="white"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Dot at start */}
        <motion.circle
          cx="10" cy="140" r="3"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      </svg>

      {/* Callout Text */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute top-11.25 left-21.25 flex flex-col items-start"
      >
        <div className="bg-white/10 backdrop-blur-md border-l-4 border-white px-4 py-2">
          <h4 className="text-white font-black text-2xl tracking-[0.2em] uppercase leading-none">
            Briefcase
          </h4>
          <p className="text-white/70 font-mono text-[10px] uppercase tracking-[0.4em] mt-1">
            Click to open
          </p>
        </div>

        {/* Animated Accent Blocks */}
        <div className="flex gap-1 mt-1 ml-1">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5 + (i * 0.1) }}
              className="w-4 h-1 bg-white/40 origin-left"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Home