import React from 'react'
import { motion } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Navbar from '../components/Navbar'

const Contact = () => {
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
      <Navbar />

      {/* Content */}
      <div className="relative z-10 pt-24 px-4 md:px-8 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl md:text-6xl font-black text-red-700 uppercase tracking-tighter mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              textShadow: '2px 2px 0px #000, 4px 4px 0px #444, 0 0 20px rgba(220, 38, 38, 0.5)'
            }}
          >
            Contact Us
          </h1>
          <div className="inline-block bg-black/80 text-yellow-500 px-6 py-2 border-2 border-yellow-600/50 backdrop-blur-sm">
            <p className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase">
              [ INVENTO 2026 - GET IN TOUCH ]
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50/95 rounded-lg shadow-2xl p-8 md:p-12"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-amber-50/95 mix-blend-multiply rounded-lg"></div>
          <div className="relative z-10">
            <p className="text-lg text-gray-600 text-center font-serif">
              Contact information coming soon...
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Contact
