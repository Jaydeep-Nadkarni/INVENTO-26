import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import paperTexture from '../../assets/UI/paper-texture.jpg'
import pageTurnSound from '../../assets/audios/page-turn.mp3'
import closeSound from '../../assets/audios/briefcase-open.mp3'
import { useParams, useNavigate } from 'react-router-dom'
import { clubsData } from './clubsData'

const TextureOverlay = ({ opacity = 0.4 }) => (
    <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
            backgroundImage: `url(${paperTexture})`,
            backgroundSize: 'cover',
            opacity: opacity,
            mixBlendMode: 'multiply'
        }}
    />
)

const EventsGrid = () => {
    const { clubSlug, eventSlug } = useParams()
    const navigate = useNavigate()

    const playSound = (audioFile) => {
        const audio = new Audio(audioFile)
        audio.play().catch(e => console.log("Audio play failed:", e))
    }

    const currentClub = clubsData.find(c => c.slug === clubSlug)
    const currentEvent = currentClub?.events.find(e => e.id === eventSlug)

    const handleClubClick = (slug) => {
        playSound(pageTurnSound)
        navigate(`/${slug}`)
    }

    const handleEventClick = (eSlug) => {
        playSound(pageTurnSound)
        navigate(`/${clubSlug}/${eSlug}`)
    }

    const handleBackToClubs = () => {
        playSound(closeSound)
        navigate('/events')
    }

    const handleBackToEvents = () => {
        playSound(closeSound)
        navigate(`/${clubSlug}`)
    }

    // Render Club Selection Grid
    if (!clubSlug) {
        return (
            <div className="relative z-10 w-full px-4 md:px-8 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] md:text-sm font-mono tracking-[0.4em] text-red-600/80 mb-4 uppercase">
                            [ Global Directory ]
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4"
                            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 30px rgba(220, 38, 38, 0.4)' }}>
                            The Dossiers
                        </h1>
                        <div className="h-1 w-32 bg-red-800/50 mb-8" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {clubsData.map((club, index) => (
                        <EventGridCard
                            key={club.id}
                            club={club}
                            index={index}
                            onSelect={() => handleClubClick(club.slug)}
                        />
                    ))}
                </div>
            </div>
        )
    }

    // Render Events Grid for a specific club
    if (clubSlug && !eventSlug) {
        return (
            <div className="relative z-10 w-full px-4 md:px-8 pt-32 pb-20 min-h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto"
                >
                    <button
                        onClick={handleBackToClubs}
                        className="mb-12 group flex items-center gap-4 text-white hover:text-red-500 transition-colors"
                    >
                        <span className="text-2xl transition-transform group-hover:-translate-x-2">←</span>
                        <span className="font-mono text-xs uppercase tracking-widest">Back to Directory</span>
                    </button>

                    <div className="mb-16">
                        <p className="font-mono text-[10px] text-red-500 tracking-[0.4em] uppercase mb-2">
                            Decrypted Archive // Sector_{currentClub?.slug.toUpperCase()}
                        </p>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-serif">
                            {currentClub?.name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentClub?.events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleEventClick(event.id)}
                                className="group cursor-pointer relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden"
                                style={{
                                    backgroundColor: '#ebe8e3',
                                    backgroundImage: `url(${paperTexture})`,
                                    backgroundSize: 'cover',
                                    boxShadow: '10px 10px 30px rgba(0,0,0,0.3)'
                                }}
                            >
                                <div className="absolute inset-0 bg-amber-50/90 mix-blend-multiply" />
                                <TextureOverlay opacity={0.3} />
                                <div className="relative z-30 p-8 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[8px] font-mono text-gray-400 tracking-[0.3em] uppercase">Protocol_{index + 1}</span>
                                            <div className="px-2 py-0.5 border border-black/10 text-[8px] font-mono uppercase">{event.type}</div>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter font-serif leading-none group-hover:text-red-800 transition-colors">
                                            {event.name}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-black/10 pt-4">
                                        <p className="text-[10px] text-gray-500 font-serif italic line-clamp-2 pr-8">
                                            {event.description}
                                        </p>
                                        <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        )
    }

    // Render Event Details (Horizontal View)
    if (eventSlug && currentEvent) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 pt-24 md:pt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-7xl h-[85vh] md:aspect-[16/9] flex flex-col md:flex-row bg-[#fdfbf7] rounded-sm shadow-2xl overflow-hidden"
                    style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
                >
                    <TextureOverlay opacity={0.3} />

                    {/* Left Panel: Visual / Title */}
                    <div className="relative z-30 w-full md:w-[35%] bg-[#1a1a1a] text-white p-8 md:p-10 flex flex-col justify-between overflow-hidden shrink-0">
                        {/* Decorative Circle */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                        <div className="relative z-10 flex flex-col h-full">
                            <button
                                onClick={handleBackToEvents}
                                className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest hover:text-white transition-colors mb-8"
                            >
                                ← Back to dossier
                            </button>

                            <div className="mt-auto mb-auto">
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none font-serif mb-2 text-yellow-500">
                                    {currentEvent.themeName || currentEvent.name}
                                </h2>
                                <h3 className="text-xl md:text-2xl font-serif italic text-gray-400 mb-6">
                                    ( {currentEvent.realName || currentEvent.name} )
                                </h3>

                                <div className="space-y-4 font-mono text-sm text-gray-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-red-600"></div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-500">Registration Fee</p>
                                            <p className="text-xl font-bold text-white">{currentEvent.fee || 'Free'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Big decorative letter */}
                            <div className="absolute -bottom-10 -left-4 opacity-10 select-none pointer-events-none">
                                <h4 className="text-[12rem] font-black tracking-tighter leading-none">
                                    {(currentEvent.themeName || currentEvent.name).charAt(0)}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Data - Scrollable */}
                    <div className="relative z-30 flex-1 flex flex-col h-full overflow-hidden bg-[#fdfbf7]">
                        {/* Slots Badge */}
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold font-mono text-xs px-6 py-2 z-40 shadow-md">
                            SLOTS AVAILABLE : {currentEvent.slotsAvailable || 'Unlimited'}
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 md:p-12 hide-scrollbar">
                            <div className="max-w-4xl mx-auto space-y-10">

                                {/* Description */}
                                <section>
                                    <p className="text-lg md:text-xl font-serif text-gray-800 leading-relaxed italic border-l-4 border-yellow-500 pl-6 py-2 bg-yellow-500/5 rounded-r-lg">
                                        "{currentEvent.description}"
                                    </p>
                                </section>

                                {/* Quick Stats Grid */}
                                <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-black/5">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Team Size</p>
                                        <p className="font-bold text-gray-900 text-lg">{currentEvent.teamSize || 1}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Rounds</p>
                                        <p className="font-bold text-gray-900 text-lg">{currentEvent.rounds || 1}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Date</p>
                                        <p className="font-bold text-gray-900 text-lg">{currentEvent.date}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Venue</p>
                                        <p className="font-bold text-gray-900 text-lg">{currentEvent.venue}</p>
                                    </div>
                                </section>

                                {/* Rules */}
                                {currentEvent.rules && (
                                    <section>
                                        <h3 className="font-bold text-xl uppercase tracking-tight mb-4 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-black rounded-full"></span> Rules & Regulations
                                        </h3>
                                        <ul className="space-y-3 ml-2">
                                            {currentEvent.rules.map((rule, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-gray-700 font-medium">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {/* Round Details */}
                                {currentEvent.roundDetails && (
                                    <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-xl uppercase tracking-tight mb-6">Round Details</h3>
                                        <div className="grid gap-8">
                                            {currentEvent.roundDetails.map((round, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <h4 className="font-bold text-red-700 text-lg border-b border-gray-100 pb-2">{round.title}</h4>
                                                    <ul className="space-y-1">
                                                        {round.details.map((detail, dIdx) => (
                                                            <li key={dIdx} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-300">
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Contact & Register Action */}
                                <section className="pt-8 flex flex-col md:flex-row items-end justify-between gap-8 border-t border-black/10">
                                    <div className="w-full md:w-auto">
                                        <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-gray-500">Event Heads</h4>
                                        <div className="space-y-2">
                                            {currentEvent.contacts && currentEvent.contacts.map((contact, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-white px-4 py-2 rounded border border-gray-200 shadow-sm">
                                                    <span className="font-bold text-gray-900 text-sm">{contact.name}</span>
                                                    <div className="h-4 w-px bg-gray-300"></div>
                                                    <span className="font-mono text-red-600 text-sm">{contact.phone}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full md:w-auto px-10 py-4 bg-red-700 text-white font-black text-lg uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-xl rounded-sm flex items-center justify-center gap-4 group">
                                        <span>Register Now</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleBackToEvents}
                        className="absolute top-4 right-4 md:top-6 md:right-8 w-8 h-8 md:w-10 md:h-10 bg-black/10 hover:bg-black text-black hover:text-white flex items-center justify-center transition-all z-50 rounded-full"
                    >
                        <span className="text-lg font-bold">✕</span>
                    </button>
                </motion.div>
            </div>
        )
    }

    return null
}

// Event Grid Card Component
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
                className="relative w-full aspect-[4/5] overflow-hidden rounded-sm transition-all duration-500"
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
                    <div className="relative mb-8 flex-1 group-hover:scale-105 transition-transform duration-700 overflow-hidden">
                        <div className="absolute inset-0 border-2 border-black/5 m-2" />
                        <div className="w-full h-full bg-black/5 flex items-center justify-center grayscale opacity-60 group-hover:opacity-100 transition-opacity">
                            <h3
                                className="text-8xl md:text-9xl font-black text-black/5 select-none pointer-events-none"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {club.name.charAt(0)}
                            </h3>
                        </div>

                        <div className="absolute bottom-4 -right-2 transform rotate-[-15deg] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0">
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
                            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                                +
                            </div>
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

export default EventsGrid
