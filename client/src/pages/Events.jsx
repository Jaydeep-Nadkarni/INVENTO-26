import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Navbar from '../components/Navbar'
import EventsGrid from '../components/Events/EventsGrid'

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
};

const Events = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(isMobileDevice())

  // Listen for mobile/desktop switches
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const handleNavbarEventsClick = () => {
    // Already on events page
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Mobile: Lightweight flat gradient background */}
      {isMobile ? (
        <div className='fixed inset-0 z-0 bg-gradient-to-b from-gray-900 via-black to-gray-950' />
      ) : (
        // Desktop: Full background image with subtle blur
        <div
          className='fixed inset-0 bg-cover bg-center bg-no-repeat z-0'
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'></div>
        </div>
      )}

      {/* Navigation */}
      <Navbar onEventsClick={handleNavbarEventsClick} isMobile={isMobile} />

      {/* Events Grid */}
      <div className="relative z-10">
        <EventsGrid />
      </div>
    </motion.div>
  )
}

export default Events
