import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { scheduleData } from '../components/Events/scheduleData'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.jpg'

const Schedule = () => {
  const [selectedDayId, setSelectedDayId] = useState(0)

  const currentDayData = scheduleData.find(d => d.dayId === selectedDayId)
  const currentEvents = currentDayData ? currentDayData.events : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#1a1a1a] relative overflow-hidden font-serif"
    >
      {/* Background */}
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

      <Navbar />

      <div className="relative z-10 pt-24 px-4 pb-0 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 h-screen">

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
                    ? 'w-40 h-32 md:w-56 md:h-44 bg-[#f4f1ea] shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
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
                    December
                  </span>

                  {/* Day Number */}
                  <span className={`font-black leading-none tracking-tighter ${isActive ? 'text-6xl md:text-8xl text-black' : 'text-4xl md:text-6xl text-gray-800'}`}>
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
                {currentEvents.map((event, idx) => (
                  <motion.div
                    key={`${selectedDayId}-${event.id}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative flex gap-6 md:gap-8 py-5 border-b border-dashed border-gray-400 last:border-0 hover:bg-black/5 transition-colors rounded-lg px-4 -mx-4"
                  >
                    {/* Time */}
                    <div className="w-20 pt-2 shrink-0 text-right">
                      <span className="font-mono font-bold text-lg text-gray-900 block">{event.time}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Title with rounds in brackets */}
                      <h3 className="text-xl md:text-2xl font-black text-black uppercase leading-tight font-serif group-hover:text-red-800 transition-colors mb-2">
                        {event.themeName || event.realName} 
                        {event.rounds > 1 && <span className="text-lg font-bold text-gray-800 font-sans ml-4"> (Round 1)</span>}
                      </h3>

                      {/* Real Name for club events */}
                      {event.isClubEvent && event.realName !== (event.themeName || event.realName) && (
                        <p className="text-gray-600 italic font-serif text-sm mb-3">
                          {event.realName}
                        </p>
                      )}

                      {/* Location with icon */}
                      <div className="flex items-center gap-2 text-sm font-mono text-red-700 font-medium">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0C7.58 0 4 3.58 4 8C4 14.14 12 24 12 24C12 24 20 14.14 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z" />
                        </svg>
                        <span className="uppercase tracking-wider">{event.venue}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {currentEvents.length < 5 && (
                <div className="h-32 flex items-center justify-center opacity-20">
                  <span className="font-serif italic text-2xl text-gray-400">Classified Area</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Schedule
