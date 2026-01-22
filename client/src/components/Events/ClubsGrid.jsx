import React from 'react'
import { motion } from 'framer-motion'
import { TextureOverlay } from './EventUIComponents'
import paperTexture from '../../assets/UI/paper-texture.jpg'

const EventGridCard = ({ club, index, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group cursor-pointer perspective-1000"
            onClick={onSelect}
        >
            <motion.div
                whileHover={{
                    y: -10,
                    rotateX: 2,
                    rotateY: -2,
                    boxShadow: '20px 20px 60px rgba(0,0,0,0.5)',
                }}
                className="relative w-full aspect-4/5 overflow-hidden rounded-sm transition-all duration-500"
                style={{
                    backgroundColor: '#ebe8e3',
                    backgroundImage: `url(${paperTexture})`,
                    backgroundSize: 'cover',
                }}
            >
                <div className="absolute inset-0 bg-amber-50/80 mix-blend-multiply" />
                <TextureOverlay opacity={0.4} />

                {/* Card Top Binding/Tape */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-900/5 backdrop-blur-sm transform rotate-1 flex items-center justify-center z-30">
                    <div className="w-full h-px bg-black/10" />
                </div>

                {/* Content Container */}
                <div className="relative z-30 h-full p-8 flex flex-col">
                    {/* Club Meta Info */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-1">
                            <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-[0.3em]">
                                Archive #0{club.id}
                            </span>
                            <span className="block text-[8px] font-mono text-red-800 font-bold uppercase tracking-widest">
                                Classified
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center opacity-30">
                            <div className="w-1 h-1 rounded-full bg-black" />
                        </div>
                    </div>

                    {/* Main Image/Graphic Placeholder */}
                    <div className={`relative ${club.illustration ? 'mb-0' : 'mb-8'} flex-1 group-hover:scale-105 transition-transform duration-700 overflow-hidden`}>
                        <div className="absolute inset-0 border-2 border-black/5 m-2" />

                        {/* Background Letter */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <h3
                                className="text-[12rem] md:text-[18rem] font-black text-black/[0.08] select-none"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {club.name.charAt(0)}
                            </h3>
                        </div>

                        {club.illustration && (
                            <img
                                src={club.illustration}
                                alt={club.name}
                                className="absolute inset-0 w-full h-full object-contain object-bottom grayscale group-hover:grayscale-0 transition-all duration-700 z-10"
                            />
                        )}

                        <div className="absolute z-12 bottom-4 -right-2 transform rotate-[-15deg] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0">
                            <div className="px-3 py-1 border-2 border-red-700 text-red-700 text-[10px] font-black uppercase tracking-tighter">
                                INVENTO 2026
                            </div>
                        </div>
                    </div>

                    {/* Club Name */}
                    <div className="space-y-4">
                        <div className="h-px w-full bg-black/20" />
                        <h3
                            className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {club.name}
                        </h3>
                        <div className="flex justify-between items-end">
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider max-w-[70%] line-clamp-1">
                                {club.tagline}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                <div className="absolute -right-1 top-24 w-1 h-16 bg-black/20 group-hover:bg-red-600 transition-colors duration-500" />
            </motion.div>
        </motion.div>
    )
}

const ClubsGrid = ({ liveClubs, eventsLoading, handleClubClick }) => {
    return (
        <div className="min-h-screen bg-[#121212] pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
            {/* Background Noise/Grit */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-12 border-b border-dashed border-white/20 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-mono text-red-600 tracking-[0.3em] uppercase mb-2">Decrypted Directory</h2>
                        <h1 className="text-4xl font-serif md:text-5xl font-black text-white uppercase tracking-tighter">Events</h1>
                    </div>
                    <div className="hidden md:block text-xs font-mono text-gray-500">
                        {eventsLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                SYNCING DATABASE...
                            </span>
                        ) : (
                            'LIVE REPOSITORY'
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {liveClubs.map((club, index) => (
                        <EventGridCard
                            key={club.id}
                            club={club}
                            index={index}
                            onSelect={() => handleClubClick(club.slug)}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default ClubsGrid
