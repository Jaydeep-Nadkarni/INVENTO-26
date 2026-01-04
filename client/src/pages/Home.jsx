import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Briefcase from '../components/Briefcase'

const Home = () => {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Hero Section transitions: fades and scales up as you scroll away
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.1])
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -50])

  // Briefcase Section entrance: slides up and reveals
  // We keep it visible for a large portion of the page after entrance
  const briefcaseOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.9, 1], [0, 1, 1, 0])
  const briefcaseY = useTransform(scrollYProgress, [0.15, 0.45], [200, 0])
  const briefcaseScale = useTransform(scrollYProgress, [0.15, 0.45], [0.6, 1])

  return (
    <div
      ref={containerRef}
      className='w-full bg-[#0a0a0a] relative'
    >
      {/* Fixed Background - Stays throughout the investigation */}
      <div
        className='fixed inset-0 bg-cover bg-center bg-no-repeat z-0'
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className='absolute inset-0 bg-black/45 backdrop-blur-[1.5px]'></div>
      </div>

      <Navbar />

      {/* Primary Landing (Hero) */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 w-full h-screen flex items-center justify-center pointer-events-none"
      >
        <div className="pointer-events-auto w-full">
          <Hero />
        </div>
      </motion.section>

      {/* 3D Evidence Exposure - The Briefcase */}
      <section className="relative z-10 w-full h-[150vh] flex flex-col items-start justify-start px-4">
        <motion.div
          style={{
            opacity: briefcaseOpacity,
            y: briefcaseY,
            scale: briefcaseScale
          }}
          className="sticky top-0 w-full h-screen flex items-center justify-center pointer-events-none"
        >
          <div className="w-full pointer-events-auto relative">
            <Briefcase />
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home