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

// Module-level flag tracks if we've already run the intro since JS loaded
let introHasPlayed = false;

const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [showIntro, setShowIntro] = useState(false)
  const [showBlackout, setShowBlackout] = useState(false)
  const [isBriefcaseOpen, setIsBriefcaseOpen] = useState(false)
  const [showCallout, setShowCallout] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  
  const [isIntroPath] = useState(() => {
    // 1. If we already played it in this memory session, never play again
    if (introHasPlayed) return false;

    // 2. Check the flag set by NavigationManager in App.jsx
    const shouldPlay = sessionStorage.getItem('shouldPlayIntro') === 'true';
    
    if (shouldPlay) {
      introHasPlayed = true;
      // We keep the flag in sessionStorage for a moment, or clear it here
      // Clearing it here is safe because introHasPlayed prevents re-runs in same JS session
      sessionStorage.removeItem('shouldPlayIntro');
      return true;
    }

    return false;
  });
  
  const hoverTimerRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const scrollPositionRef = useRef(0)

  const playSound = (audioFile) => {
    const audio = new Audio(audioFile)
    audio.play().catch(e => console.log("Audio play failed:", e))
  }

  // Define scroll lock functions before usage
  const lockScroll = () => {
    scrollPositionRef.current = window.scrollY;
    // Apply inline styles for immediate effect
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = '100%';
    
    // Toggle classes for CSS-based locking
    document.documentElement.classList.add('scroll-locked');
    document.body.classList.add('scroll-locked');
  };

  const unlockScroll = () => {
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    
    document.documentElement.classList.remove('scroll-locked');
    document.body.classList.remove('scroll-locked');
    
    window.scrollTo(0, scrollPositionRef.current);
  };

  // Real Asset Loading Tracker
  useEffect(() => {
    if (!isIntroPath) return;

    setIsLoading(true);
    lockScroll();

    const assets = [
      { type: 'image', src: bgImage },
      { type: 'video', src: introVideo },
      { type: 'audio', src: introAudio }
    ];

    let loadedCount = 0;
    const totalAssets = assets.length;

    const updateProgress = () => {
      loadedCount++;
      const newProgress = Math.round((loadedCount / totalAssets) * 100);
      setLoadProgress(newProgress);
    };

    assets.forEach(asset => {
      if (asset.type === 'image') {
        const img = new Image();
        img.src = asset.src;
        img.onload = updateProgress;
        img.onerror = updateProgress; // Don't block on error
      } else if (asset.type === 'video') {
        const video = document.createElement('video');
        video.src = asset.src;
        video.oncanplaythrough = updateProgress;
        video.onerror = updateProgress;
      } else if (asset.type === 'audio') {
        const audio = new Audio();
        audio.src = asset.src;
        audio.oncanplaythrough = updateProgress;
        audio.onerror = updateProgress;
      }
    });

    return () => {
      if (isLoading || showIntro) unlockScroll();
    };
  }, [isIntroPath]);

  const handleLoaderComplete = () => {
    setIsLoading(false)
    setShowIntro(true)
    setIsMuted(true);
  }

  const handleVideoEnd = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setShowIntro(false)
    setShowBlackout(true)
    
    // If we're using audio tag, fade it out
    if (audioRef.current && !audioRef.current.muted) {
       fadeAudioOut();
    }
    
    // After blackout transition, unlock scroll
    setTimeout(() => {
      setShowBlackout(false)
      unlockScroll()
    }, 1000)
  }

  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleVideoEnd();
  }

  const toggleMute = () => {
    const isNowMuted = !isMuted;
    setIsMuted(isNowMuted);
    
    if (audioRef.current) {
      audioRef.current.muted = isNowMuted;
      audioRef.current.volume = isNowMuted ? 0 : 1;
      if (!isNowMuted) {
        audioRef.current.play().catch(e => console.log("Audio sync failed:", e));
      }
    }
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
          await videoRef.current.play();
          // audio is handled in handleLoaderComplete now
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
        {isLoading && (
          <Loader key="loader" progress={loadProgress} onComplete={handleLoaderComplete} />
        )}

        {showIntro && (
          <motion.div
            key="intro-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-9999 bg-black cursor-pointer"
            onClick={() => isMuted && toggleMute()}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover pointer-events-none"
              playsInline
              preload="auto"
            >
              <source src={introVideo} type="video/mp4" />
            </video>
            
            {/* Unmute button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="absolute top-10 right-10 z-10000 text-white/70 hover:text-white font-mono text-sm tracking-widest uppercase border border-white/30 px-4 py-2 bg-black/50 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                skipIntro();
              }}
              className="absolute bottom-10 right-10 z-10000 text-white/50 hover:text-white font-mono text-xs tracking-widest uppercase border border-white/20 px-4 py-2 bg-black/50 backdrop-blur-sm transition-all"
            >
              Skip Intro [ESC]
            </button>
          </motion.div>
        )}
        
        {showBlackout && (
          <motion.div
            key="blackout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-9998 bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isLoading || showIntro || showBlackout ? 0 : 1,
          y: isLoading || showIntro || showBlackout ? 20 : 0
        }}
        transition={{ 
          duration: 1.2, 
          ease: "easeOut",
          delay: (isIntroPath && showBlackout) ? 0.3 : 0 
        }}
        className="w-full bg-[#0a0a0a] relative selection:bg-red-700/30"
      >
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
    </motion.div>
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