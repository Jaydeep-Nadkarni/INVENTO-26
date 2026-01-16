import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { scheduleData } from '../components/Events/scheduleData'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.webp'
import spy1 from '../assets/UI/spy1.png'

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
};

const Schedule = () => {
  const [selectedDayId, setSelectedDayId] = useState(0)
  const [isMobile, setIsMobile] = useState(isMobileDevice())

  // Listen for mobile/desktop switches
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const currentDayData = scheduleData.find(d => d.dayId === selectedDayId)
  const currentEvents = currentDayData ? currentDayData.events : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#1a1a1a] relative overflow-hidden font-serif"
    >
      {/* Mobile: Lightweight flat gradient background */}
      {isMobile ? (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-gray-900 via-black to-gray-950" />
      ) : (
        // Desktop: Full background with multiple layers
        <>
          <div
            className="fixed inset-0 z-0 opacity-30"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
        </>
      )}

      <Navbar isMobile={isMobile} />

      <div className="relative z-10 pt-16 md:pt-24 px-4 pb-0 max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-8 h-screen">

        {/* LEFT SIDEBAR: DAY INDEX */}
        <div className="flex flex-row md:flex-col justify-center md:justify-center items-stretch md:items-center gap-3 mb-6 md:mb-0 shrink-0 z-30 md:h-[80vh]">
          {scheduleData.map((day, index) => {
            const isActive = selectedDayId === day.dayId
            return (
              <motion.button
                key={day.dayId}
                onClick={() => setSelectedDayId(day.dayId)}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`
                                    relative flex flex-col items-center justify-center transition-all duration-300
                                    ${isActive
                    ? 'w-32 h-24 md:w-56 md:h-44 bg-[#f4f1ea] shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                    : 'w-32 h-24 md:w-48 md:h-32 bg-[#f4f1ea] shadow-lg opacity-70 hover:opacity-90'}
                                    rounded-2xl border-4 ${isActive ? 'border-red-800' : 'border-gray-800/20'}
                                `}
                style={{
                  backgroundImage: `url(${paperTexture})`,
                  backgroundSize: 'cover'
                }}
              >
                {/* Paper overlay */}
                <div className="absolute inset-0 bg-amber-50/40 mix-blend-multiply rounded-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Month/Label */}
                  <span className={`font-black tracking-tight uppercase font-serif ${isActive ? 'text-base md:text-xl text-gray-800 mb-1' : 'text-sm md:text-base text-gray-700'}`}>
                    {isMobile ? 'FEB' : 'FEBRUARY'}
                  </span>

                  {/* Day Number */}
                  <span className={`font-black leading-none tracking-tighter ${isActive ? 'text-4xl md:text-8xl text-black' : 'text-4xl md:text-6xl text-gray-800'}`}>
                    {day.date.split(' ')[1]}
                  </span>

                  {/* Day Label */}
                  <span className={`font-mono tracking-widest uppercase mt-2 ${isActive ? 'text-xs md:text-sm text-red-700 font-bold' : 'text-[10px] md:text-xs text-gray-600'}`}>
                    {day.label}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* MAIN CONTENT AREA */}
        <motion.div
          layout
          className="flex-1 relative bg-[#f4f1ea] shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[75vh] md:h-[80vh]"
          style={{
            backgroundImage: `url(${paperTexture})`,
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-amber-50/30 mix-blend-multiply pointer-events-none" />

          {/* Spy Background Illustration - Hidden on Mobile */}
          <div className="hidden md:block absolute bottom-0 right-0 z-0 pointer-events-none opacity-40 mix-blend-multiply overflow-hidden">
            <motion.img
              src={spy1}
              alt=""
              className="h-[500px] w-auto object-contain translate-y-1/4 translate-x-1/4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                filter: 'sepia(0.5) contrast(0.8) brightness(0.9)',
              }}
            />
          </div>

          {/* Header */}
          <div className="relative z-10 p-8 md:p-12 pb-6 border-b border-gray-900/10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none font-serif">
                  Itinerary
                </h2>
                <p className="text-red-700 font-mono text-xs md:text-sm tracking-[0.3em] uppercase mt-4">
                  INVENTO 2026
                </p>
              </div>
            </div>
          </div>

          {/* Event List */}
          <div className="flex-1 overflow-y-auto relative z-10 px-6 md:px-12 py-6 custom-scrollbar">
            <style jsx>{`
                            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
                        `}</style>

            <div className="space-y-6 pb-20">
              <AnimatePresence mode='wait'>
                {Object.entries(currentEvents.reduce((acc, event) => {
                  if (!acc[event.time]) acc[event.time] = []
                  acc[event.time].push(event)
                  return acc
                }, {})).map(([time, events], groupIdx) => (
                  <motion.div
                    key={`${selectedDayId}-${time}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: groupIdx * 0.05 }}
                    className="relative flex gap-6 md:gap-8 py-6 border-b border-dashed border-gray-400 last:border-0"
                  >
                    {/* Time Column */}
                    <div className="w-24 shrink-0 flex flex-col items-end relative pt-1">
                      <span className="font-mono font-bold text-xl md:text-xl text-gray-900 block relative z-10 pl-2 leading-none">{time}</span>
                    </div>

                    {/* Events Container */}
                    <div className="flex-1 space-y-6">
                      {events.map((event, idx) => (
                        <div key={event.id} className="group relative">
                          {/* Title with rounds in brackets */}
                          <h3 className="text-xl md:text-2xl font-black text-black uppercase leading-tight font-serif group-hover:text-red-800 transition-colors mb-1">
                            {event.themeName || event.realName}
                          </h3>

                          {/* Real Name for club events */}
                          {event.isClubEvent && event.realName !== (event.themeName || event.realName) && (
                            <p className="text-gray-600 italic font-serif text-sm mb-2">
                              {event.realName}
                            </p>
                          )}

                          {/* Location with icon */}
                          <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-red-700 font-medium">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                              <path d="M12 0C7.58 0 4 3.58 4 8C4 14.14 12 24 12 24C12 24 20 14.14 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z" />
                            </svg>
                            <span className="uppercase tracking-wider">{event.venue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Schedule
