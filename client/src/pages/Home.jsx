import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Briefcase from '../components/Briefcase'
import BriefcaseInsider from '../components/BriefcaseInsider'

const Home = () => {
  const [isBriefcaseOpen, setIsBriefcaseOpen] = useState(false)

  return (
    <div className='w-full bg-[#0a0a0a] relative overflow-x-hidden selection:bg-red-700/30'>
      {/* Fixed Background with subtle blur */}
      <div
        className='fixed inset-0 bg-cover bg-center bg-no-repeat z-0'
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'></div>
      </div>

      <Navbar />

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
          className="w-full max-w-[1000px] aspect-video flex flex-col items-center"
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
          <div className="w-full grow h-[500px] md:h-[600px] relative">
            <Briefcase onClick={() => setIsBriefcaseOpen(true)} />
          </div>
        </motion.div>
      </section>


      {/* Insider View */}
      <BriefcaseInsider
        isOpen={isBriefcaseOpen}
        onClose={() => setIsBriefcaseOpen(false)}
      />

      {/* Footer Space */}
      {!isBriefcaseOpen && (
        <div className="h-[20vh] relative z-10 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      )}
    </div>
  )
}

export default Home
