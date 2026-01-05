import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import paperTexture from '../assets/UI/paper-texture.jpg'
import pageTurnSound from '../assets/audios/page-turn.mp3'
import closeSound from '../assets/audios/briefcase-open.mp3'

const clubsData = [
    {
        id: 1,
        name: 'Melodia',
        tagline: 'Music & Performance Club',
        event: 'Harmony Night 2026',
        date: 'February 15, 2026',
        time: '6:00 PM - 9:00 PM',
        venue: 'Main Auditorium',
        description: 'A musical evening featuring live performances, band battles, and acoustic sessions. Experience the symphony of talent as students showcase their musical prowess.',
        color: '#dc2626',
        position: { x: 15, y: 15 },
        rotation: -4,
        events: [
            { name: 'Solo Singing', type: 'solo', maxTeamSize: 1, description: 'Showcase your vocal talent in a solo performance. Sing your heart out and mesmerize the audience.' },
            { name: 'Band Battle', type: 'team', maxTeamSize: 4, description: 'Form a band and compete against other groups. Bring your instruments and rock the stage.' },
            { name: 'Acoustic Jam', type: 'team', maxTeamSize: 4, description: 'Create unplugged magic with your team. Acoustic instruments only, pure musical talent.' },
            { name: 'Beat Boxing', type: 'solo', maxTeamSize: 1, description: 'Show off your vocal percussion skills. Create beats, rhythms, and sounds using only your voice.' },
        ],
    },
    {
        id: 2,
        name: 'Community Development Club',
        tagline: 'Social Impact Initiative',
        event: 'Social Impact Summit',
        date: 'February 18, 2026',
        time: '10:00 AM - 4:00 PM',
        venue: 'Conference Hall A',
        description: 'Workshop on community service initiatives, NGO collaborations, and sustainable development goals. Learn how to make a real difference in society.',
        color: '#16a34a',
        position: { x: 42, y: 12 },
        rotation: 3,
        events: [
            { name: 'Social Entrepreneurship', type: 'team', maxTeamSize: 4, description: 'Pitch your innovative social business idea. Solve real-world problems while creating sustainable impact.' },
            { name: 'Community Outreach', type: 'team', maxTeamSize: 4, description: 'Plan and present a community service project. Make a difference in your local community.' },
            { name: 'NGO Case Study', type: 'solo', maxTeamSize: 1, description: 'Analyze and present a case study on successful NGO initiatives and their impact on society.' },
        ],
    },
    {
        id: 3,
        name: 'Women Empowerment Club',
        tagline: 'Leadership & Equality',
        event: 'Empower Her 2026',
        date: 'February 20, 2026',
        time: '2:00 PM - 5:00 PM',
        venue: 'Seminar Hall',
        description: 'Panel discussion on women leadership, gender equality, and breaking barriers. Featuring inspiring speakers and interactive workshops.',
        color: '#9333ea',
        position: { x: 72, y: 18 },
        rotation: -3,
        events: [
            { name: 'Leadership Talk', type: 'solo', maxTeamSize: 1, description: 'Deliver an inspiring speech on women leadership and empowerment. Share your vision and ideas.' },
            { name: 'Panel Discussion', type: 'team', maxTeamSize: 4, description: 'Participate in a moderated panel discussing gender equality, challenges, and solutions.' },
            { name: 'Empowerment Workshop', type: 'team', maxTeamSize: 4, description: 'Conduct an interactive workshop on skills development and confidence building for women.' },
        ],
    },
    {
        id: 4,
        name: 'Dance Club',
        tagline: 'Rhythm & Movement',
        event: 'Rhythm Revolution',
        date: 'February 22, 2026',
        time: '5:00 PM - 8:00 PM',
        venue: 'Open Air Theatre',
        description: 'Inter-college dance competition featuring hip-hop, contemporary, classical, and fusion performances. Battle for the ultimate dance supremacy.',
        color: '#ea580c',
        position: { x: 18, y: 45 },
        rotation: 5,
        events: [
            { name: 'Solo Dance', type: 'solo', maxTeamSize: 1, description: 'Express yourself through solo dance performance. Any style - classical, contemporary, hip-hop, or fusion.' },
            { name: 'Group Dance', type: 'team', maxTeamSize: 4, description: 'Choreograph and perform a synchronized group routine. Showcase teamwork and creativity.' },
            { name: 'Duet Performance', type: 'team', maxTeamSize: 4, description: 'Partner dance performance showcasing chemistry and coordination between dancers.' },
            { name: 'Street Dance Battle', type: 'team', maxTeamSize: 4, description: 'Face-off in an intense street dance battle. Freestyle, breaking, popping, and locking allowed.' },
        ],
    },
    {
        id: 5,
        name: 'HR Club',
        tagline: 'Talent & Strategy',
        event: 'Talent Acquisition Workshop',
        date: 'February 25, 2026',
        time: '11:00 AM - 3:00 PM',
        venue: 'Business Lab',
        description: 'Corporate recruitment strategies session with industry experts. Learn about modern HR practices, talent management, and organizational behavior.',
        color: '#0891b2',
        position: { x: 48, y: 42 },
        rotation: -5,
        events: [
            { name: 'HR Case Study', type: 'team', maxTeamSize: 4, description: 'Analyze and solve complex HR scenarios. Present your strategic solutions to industry experts.' },
            { name: 'Mock Interview', type: 'solo', maxTeamSize: 1, description: 'Face a realistic job interview simulation. Get feedback from HR professionals on your performance.' },
            { name: 'Recruitment Drive', type: 'team', maxTeamSize: 4, description: 'Design and execute a complete recruitment strategy for a fictional company scenario.' },
        ],
    },
    {
        id: 6,
        name: 'Photography Club',
        tagline: 'Lens & Vision',
        event: 'Lens & Light Exhibition',
        date: 'February 27, 2026',
        time: '9:00 AM - 6:00 PM',
        venue: 'Art Gallery',
        description: 'Student photography showcase featuring portraits, landscapes, street photography, and experimental art. Capture the world through different perspectives.',
        color: '#ca8a04',
        position: { x: 75, y: 48 },
        rotation: 2,
        events: [
            { name: 'Photography', type: 'solo', maxTeamSize: 1, description: 'Submit your best photographs across various categories. Show your unique perspective and vision.' },
            { name: 'Photo Story', type: 'team', maxTeamSize: 4, description: 'Create a compelling narrative through a series of photographs. Tell a story without words.' },
            { name: 'Videography', type: 'team', maxTeamSize: 4, description: 'Produce a short video showcasing your cinematography and editing skills. Any genre welcome.' },
            { name: 'Short Film', type: 'team', maxTeamSize: 4, description: 'Create a complete short film with story, direction, and production. Showcase your filmmaking talent.' },
        ],
    },
    {
        id: 7,
        name: 'Literary Club',
        tagline: 'Words & Wisdom',
        event: 'WordSmith Chronicles',
        date: 'March 1, 2026',
        time: '3:00 PM - 6:00 PM',
        venue: 'Library Auditorium',
        description: 'Poetry slam and creative writing competition. Express yourself through the power of words, stories, and spoken word performances.',
        color: '#7c3aed',
        position: { x: 22, y: 75 },
        rotation: -2,
        events: [
            { name: 'Poetry Slam', type: 'solo', maxTeamSize: 1, description: 'Perform your original poetry on stage. Spoken word, rhyme, or free verse - let your words flow.' },
            { name: 'Creative Writing', type: 'solo', maxTeamSize: 1, description: 'Submit your original short story, essay, or creative piece. Show your literary prowess.' },
            { name: 'Debate', type: 'team', maxTeamSize: 4, description: 'Engage in formal debate on contemporary topics. Argue your position with logic and eloquence.' },
            { name: 'Story Telling', type: 'solo', maxTeamSize: 1, description: 'Narrate a captivating story to the audience. Engage listeners with your storytelling skills.' },
        ],
    },
    {
        id: 8,
        name: 'Tech Club',
        tagline: 'Innovation & Code',
        event: 'CodeBreaker Hackathon',
        date: 'March 3-4, 2026',
        time: '24 Hours Non-Stop',
        venue: 'Computer Lab Complex',
        description: '24-hour coding challenge with prizes. Build innovative solutions, collaborate with peers, and compete for glory in this ultimate tech showdown.',
        color: '#0284c7',
        position: { x: 68, y: 78 },
        rotation: 4,
        events: [
            { name: 'Hackathon', type: 'team', maxTeamSize: 4, description: 'Build a working prototype in 24 hours. Solve real-world problems with innovative tech solutions.' },
            { name: 'Web Development', type: 'team', maxTeamSize: 4, description: 'Create a fully functional website or web application. Showcase your frontend and backend skills.' },
            { name: 'App Development', type: 'team', maxTeamSize: 4, description: 'Develop a mobile or desktop application. Focus on user experience and functionality.' },
            { name: 'Coding Challenge', type: 'solo', maxTeamSize: 1, description: 'Solve algorithmic problems and coding puzzles. Test your problem-solving and coding speed.' },
        ],
    },
]

// Create web of connections - connect each card to 2-3 others
const connections = [
    { from: 1, to: 2 },
    { from: 1, to: 4 },
    { from: 2, to: 3 },
    { from: 2, to: 5 },
    { from: 3, to: 6 },
    { from: 4, to: 5 },
    { from: 4, to: 7 },
    { from: 5, to: 6 },
    { from: 5, to: 8 },
    { from: 6, to: 8 },
    { from: 7, to: 8 },
]

const EventsModalEvidence = ({ isOpen, onClose }) => {
    const [selectedClub, setSelectedClub] = useState(null)

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const playSound = (audioFile) => {
        const audio = new Audio(audioFile)
        audio.play().catch(e => console.log("Audio play failed:", e))
    }

    const handleCardClick = (club) => {
        playSound(pageTurnSound)
        setSelectedClub(club)
    }

    const handleCloseCard = (e) => {
        e.stopPropagation()
        playSound(pageTurnSound)
        setSelectedClub(null)
    }

    const handleCloseModal = () => {
        playSound(closeSound)
        setSelectedClub(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto"
                onClick={handleCloseModal}
            >
                {/* Close Button */}
                <button
                    onClick={handleCloseModal}
                    className="fixed top-6 right-6 z-[110] text-red-500 hover:text-red-400 transition-colors group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-xl group-hover:bg-red-500/30 transition-all"></div>
                        <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <span className="text-xs font-mono tracking-wider mt-1 block">ESC</span>
                </button>

                {/* Scrollable Content */}
                <div className="min-h-screen py-8 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full max-w-7xl mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-red-700 uppercase tracking-tighter mb-3"
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    textShadow: '2px 2px 0px #000, 4px 4px 0px #444, 0 0 20px rgba(220, 38, 38, 0.5)'
                                }}>
                                Investigation Board
                            </h1>
                            <div className="inline-block bg-black/80 text-yellow-500 px-6 py-2 border-2 border-yellow-600/50 backdrop-blur-sm">
                                <p className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase">
                                    [ CLASSIFIED - CONNECT THE EVIDENCE ]
                                </p>
                            </div>
                        </motion.div>

                        {/* Evidence Board */}
                        <div
                            className="relative w-full rounded-lg shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
                                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 20px 60px rgba(0,0,0,0.9), 0 0 100px rgba(220, 38, 38, 0.1)',
                                minHeight: '800px',
                                paddingBottom: '100px'
                            }}
                        >
                            {/* Grid pattern */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                                backgroundSize: '50px 50px'
                            }}></div>

                            {/* Red vignette */}
                            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-red-950/20"></div>

                            {/* Connection Strings - ALL CARDS CONNECTED */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ minHeight: '800px' }}>
                                <defs>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                {connections.map((conn, index) => {
                                    const fromClub = clubsData.find(c => c.id === conn.from)
                                    const toClub = clubsData.find(c => c.id === conn.to)
                                    if (!fromClub || !toClub) return null

                                    return (
                                        <motion.line
                                            key={`${conn.from}-${conn.to}`}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 0.5 }}
                                            transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
                                            x1={`${fromClub.position.x}%`}
                                            y1={`${fromClub.position.y}%`}
                                            x2={`${toClub.position.x}%`}
                                            y2={`${toClub.position.y}%`}
                                            stroke="#dc2626"
                                            strokeWidth="2"
                                            filter="url(#glow)"
                                        />
                                    )
                                })}
                            </svg>

                            {/* Evidence Cards */}
                            {clubsData.map((club, index) => (
                                <EvidenceCard
                                    key={club.id}
                                    club={club}
                                    index={index}
                                    onClick={() => handleCardClick(club)}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Expanded Club Details */}
                <AnimatePresence>
                    {selectedClub && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[105] flex items-center justify-center bg-black/95 p-4 overflow-y-auto"
                            onClick={handleCloseCard}
                        >
                            <motion.div
                                initial={{ scale: 0.8, rotateY: -90 }}
                                animate={{ scale: 1, rotateY: 0 }}
                                exit={{ scale: 0.8, rotateY: 90 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="relative w-full max-w-3xl p-8 md:p-12 my-8 max-h-[90vh] overflow-y-auto"
                                style={{
                                    backgroundImage: `url(${paperTexture})`,
                                    backgroundSize: 'cover',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 bg-amber-50/95 mix-blend-multiply"></div>

                                <div className="relative z-10">
                                    <button
                                        onClick={handleCloseCard}
                                        className="absolute -top-4 -right-4 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center font-bold text-xl"
                                    >
                                        ✕
                                    </button>

                                    <div className="absolute -top-6 -left-6 transform -rotate-12">
                                        <div className="border-4 border-red-600 px-4 py-2 bg-red-600/10 backdrop-blur-sm">
                                            <p className="text-red-600 font-black text-xl tracking-widest uppercase">
                                                Top Secret
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-b-4 border-black/20 pb-6 mb-6">
                                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2"
                                            style={{ color: selectedClub.color }}>
                                            {selectedClub.name}
                                        </h2>
                                        <p className="text-sm font-mono text-gray-600 tracking-wider uppercase">
                                            {selectedClub.tagline}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-serif">
                                                {selectedClub.event}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-black/5 p-4 border-l-4" style={{ borderColor: selectedClub.color }}>
                                                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Date</p>
                                                <p className="font-bold text-gray-900">{selectedClub.date}</p>
                                            </div>

                                            <div className="bg-black/5 p-4 border-l-4" style={{ borderColor: selectedClub.color }}>
                                                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Time</p>
                                                <p className="font-bold text-gray-900">{selectedClub.time}</p>
                                            </div>

                                            <div className="bg-black/5 p-4 border-l-4 md:col-span-2" style={{ borderColor: selectedClub.color }}>
                                                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Venue</p>
                                                <p className="font-bold text-gray-900">{selectedClub.venue}</p>
                                            </div>
                                        </div>

                                        {/* Events List */}
                                        <div className="bg-black/5 p-6 border-2 border-black/10">
                                            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">Available Events</p>
                                            <div className="space-y-3">
                                                {selectedClub.events?.map((event, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="border-l-4 pl-4 py-2"
                                                        style={{ borderColor: selectedClub.color }}
                                                    >
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <p className="font-bold text-gray-900">{event.name}</p>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 text-gray-600">
                                                                {event.type === 'solo' ? '👤 Solo' : '👥 Team'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Max: {event.maxTeamSize}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-black/5 p-6 border-2 border-dashed border-black/20">
                                            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Mission Brief</p>
                                            <p className="text-gray-800 leading-relaxed font-serif">
                                                {selectedClub.description}
                                            </p>
                                        </div>

                                        <div className="flex justify-center pt-4">
                                            <button
                                                className="px-8 py-3 font-black uppercase tracking-wider text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                style={{ backgroundColor: selectedClub.color }}
                                            >
                                                Register Now
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t-2 border-black/10">
                                        <p className="text-xs font-mono text-gray-400 text-center tracking-widest">
                                            CLASSIFIED DOCUMENT #INV-2026-{selectedClub.id.toString().padStart(3, '0')}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    )
}

// Evidence Card Component
const EvidenceCard = ({ club, index, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: club.rotation }}
            animate={{ opacity: 1, scale: 1, rotate: club.rotation }}
            transition={{ delay: 0.05 * index, duration: 0.3 }}
            style={{
                position: 'absolute',
                left: `${club.position.x}%`,
                top: `${club.position.y}%`,
                transform: 'translate(-50%, -50%)',
            }}
            className="z-20"
        >
            {/* Spy Thumbtack Pin */}
            <motion.div
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index + 0.2, duration: 0.2 }}
            >
                <div className="relative">
                    <div className="absolute inset-0 blur-md opacity-60" style={{ backgroundColor: club.color }}></div>
                    <div className="relative w-5 h-5 rounded-full shadow-lg border-2 border-black/30" style={{ backgroundColor: club.color }}>
                        <div className="absolute inset-1 rounded-full bg-white/30"></div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gradient-to-b from-gray-400 to-gray-600"></div>
                </div>
            </motion.div>

            {/* Card */}
            <motion.div
                whileHover={{ scale: 1.08, rotate: 0, y: -8, zIndex: 50 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="relative w-48 md:w-56 cursor-pointer group"
                style={{ rotate: club.rotation }}
            >
                <div
                    className="relative p-5 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-300 border border-black/20"
                    style={{
                        backgroundImage: `url(${paperTexture})`,
                        backgroundSize: 'cover',
                        boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px ${club.color}20`
                    }}
                >
                    <div className="absolute inset-0 bg-amber-50/90 group-hover:bg-amber-100/90 transition-colors" style={{ boxShadow: `inset 0 0 20px ${club.color}10` }}></div>

                    <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity transform rotate-12">
                        <div className="border-2 px-2 py-0.5" style={{ borderColor: club.color }}>
                            <p className="text-[8px] font-black tracking-widest uppercase" style={{ color: club.color }}>CLASSIFIED</p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-1 w-8" style={{ backgroundColor: club.color }}></div>
                                <div className="h-1 w-3 bg-black/20"></div>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-1" style={{ color: club.color }}>
                                {club.name}
                            </h3>
                            <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{club.tagline}</p>
                        </div>

                        <div className="space-y-2.5">
                            <div className="border-t-2 border-dashed border-black/10 pt-3">
                                <p className="text-sm font-bold text-gray-900 leading-tight mb-2">{club.event}</p>
                            </div>

                            <div className="space-y-1.5 text-xs">
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-400">📅</span>
                                    <p className="text-gray-700 font-mono flex-1">{club.date}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-400">⏰</span>
                                    <p className="text-gray-700 font-mono flex-1">{club.time}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-400">📍</span>
                                    <p className="text-gray-700 font-mono flex-1">{club.venue}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                            <div className="text-[9px] font-mono text-gray-400 tracking-wider">
                                ID: {club.id.toString().padStart(3, '0')}
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="text-[9px] font-mono text-gray-500 group-hover:text-gray-700 transition-colors uppercase">View</div>
                                <svg className="w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" style={{ backgroundColor: club.color }}></div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default EventsModalEvidence
