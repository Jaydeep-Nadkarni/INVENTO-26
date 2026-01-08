import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Navbar from '../components/Navbar'
import EventsGrid from '../components/Events/EventsGrid'

const Events = () => {
  const navigate = useNavigate()

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
      {/* Background */}
      <div
        className='fixed inset-0 bg-cover bg-center bg-no-repeat z-0'
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'></div>
      </div>

      {/* Navigation */}
      <Navbar onEventsClick={handleNavbarEventsClick} />

      {/* Events Grid */}
      <div className="relative z-10">
        <EventsGrid />
      </div>
    </motion.div>
  )
}

export default Events
