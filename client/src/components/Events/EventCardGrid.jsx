import React from 'react'
import { motion } from 'framer-motion'
import { TextureOverlay } from './EventUIComponents'
import CustomEventCard from './CustomEventCard'

const EventCardGrid = ({ 
    currentClub, 
    eventsLoading, 
    handleBackToClubs, 
    handleEventClick, 
    goToPrevClub, 
    goToNextClub 
}) => {
    return (
        <div className="min-h-screen bg-[#121212] pt-24 pb-12 px-4 md:px-12 relative">
            {/* Texture */}
            <TextureOverlay opacity={0.05} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none"></div>

            {/* Club Navigation Arrows */}
            <button onClick={goToPrevClub} className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 text-white transition-all backdrop-blur-sm group">
                <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            </button>
            <button onClick={goToNextClub} className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 text-white transition-all backdrop-blur-sm group">
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-16 relative">
                    <button
                        onClick={handleBackToClubs}
                        className="flex items-center gap-3 text-xs font-mono text-gray-500 hover:text-white uppercase tracking-[0.2em] mb-6 transition-colors"
                    >
                        <span>←</span> Back to Directory
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
                        <div>
                            <h4 className="font-mono text-red-600 text-xs tracking-[0.4em] uppercase mb-2">Decrypted Archive // Sector_{currentClub?.slug.toUpperCase()}</h4>
                            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none font-serif">
                                {currentClub?.name}
                            </h1>
                        </div>
                        <p className="text-gray-400 font-serif italic text-lg max-w-md text-right mt-4 md:mt-0">
                            "{currentClub?.tagline}"
                        </p>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="flex flex-wrap justify-center gap-10 w-full max-w-7xl mx-auto px-4">
                    {eventsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4 w-full">
                            <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Syncing Classified Files...</p>
                        </div>
                    ) : currentClub?.events?.length > 0 ? (
                        currentClub.events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(33.33%-2.5rem)]"
                            >
                                <CustomEventCard
                                    event={event}
                                    onClick={() => handleEventClick(event.id)}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 w-full">
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">No intelligence found in this sector yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EventCardGrid
