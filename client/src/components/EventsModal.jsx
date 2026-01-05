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
        events: [
            { name: 'Hackathon', type: 'team', maxTeamSize: 4, description: 'Build a working prototype in 24 hours. Solve real-world problems with innovative tech solutions.' },
            { name: 'Web Development', type: 'team', maxTeamSize: 4, description: 'Create a fully functional website or web application. Showcase your frontend and backend skills.' },
            { name: 'App Development', type: 'team', maxTeamSize: 4, description: 'Develop a mobile or desktop application. Focus on user experience and functionality.' },
            { name: 'Coding Challenge', type: 'solo', maxTeamSize: 1, description: 'Solve algorithmic problems and coding puzzles. Test your problem-solving and coding speed.' },
        ],
    },
]

const EventsModal = ({ isOpen, onClose }) => {
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

    const handleFolderClick = (club) => {
        playSound(pageTurnSound)
        setSelectedClub(club)
    }

    const handleCloseFolder = (e) => {
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
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm overflow-y-auto"
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

                {/* Content Container */}
                <div className="min-h-screen py-20">
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-7xl mx-auto px-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-5xl md:text-7xl font-black text-red-700 uppercase tracking-tighter mb-4"
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    textShadow: '2px 2px 0px #000, 4px 4px 0px #444'
                                }}>
                                Classified Events
                            </h1>
                            <div className="inline-block bg-black/80 text-yellow-500 px-6 py-2 border-2 border-yellow-600/50 backdrop-blur-sm">
                                <p className="text-sm md:text-base font-mono tracking-[0.3em] uppercase">
                                    [ INVENTO 2026 - MISSION DOSSIERS ]
                                </p>
                            </div>
                        </motion.div>

                        {/* Clubs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {clubsData.map((club, index) => (
                                <motion.div
                                    key={club.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                                >
                                    <ClubFolder
                                        club={club}
                                        onClick={() => handleFolderClick(club)}
                                        isSelected={selectedClub?.id === club.id}
                                    />
                                </motion.div>
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
                            className="fixed inset-0 z-[105] flex items-center justify-center bg-black/95 backdrop-blur-md"
                            onClick={handleCloseFolder}
                        >
                            <motion.div
                                initial={{ scale: 0.8, rotateY: -90 }}
                                animate={{ scale: 1, rotateY: 0 }}
                                exit={{ scale: 0.8, rotateY: 90 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="relative w-full max-w-3xl mx-4 p-8 md:p-12"
                                style={{
                                    backgroundImage: `url(${paperTexture})`,
                                    backgroundSize: 'cover',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Paper texture overlay */}
                                <div className="absolute inset-0 bg-amber-50/95 mix-blend-multiply"></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Close button */}
                                    <button
                                        onClick={handleCloseFolder}
                                        className="absolute -top-4 -right-4 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center font-bold text-xl"
                                    >
                                        ✕
                                    </button>

                                    {/* Top Secret Stamp */}
                                    <div className="absolute -top-6 -left-6 transform -rotate-12">
                                        <div className="border-4 border-red-600 px-4 py-2 bg-red-600/10 backdrop-blur-sm">
                                            <p className="text-red-600 font-black text-xl tracking-widest uppercase">
                                                Top Secret
                                            </p>
                                        </div>
                                    </div>

                                    {/* Club Header */}
                                    <div className="border-b-4 border-black/20 pb-6 mb-6">
                                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2"
                                            style={{ color: selectedClub.color }}>
                                            {selectedClub.name}
                                        </h2>
                                        <p className="text-sm font-mono text-gray-600 tracking-wider uppercase">
                                            {selectedClub.tagline}
                                        </p>
                                    </div>

                                    {/* Event Details */}
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

                                        {/* Register Button */}
                                        <div className="flex justify-center pt-4">
                                            <button
                                                className="px-8 py-3 font-black uppercase tracking-wider text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                style={{ backgroundColor: selectedClub.color }}
                                            >
                                                Register Now
                                            </button>
                                        </div>
                                    </div>

                                    {/* Classification Footer */}
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

// Club Folder Component
const ClubFolder = ({ club, onClick, isSelected }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="relative cursor-pointer group"
        >
            {/* Folder */}
            <div
                className="relative h-48 p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{
                    backgroundImage: `url(${paperTexture})`,
                    backgroundSize: 'cover',
                }}
            >
                {/* Paper overlay */}
                <div className="absolute inset-0 bg-amber-100/90 group-hover:bg-amber-50/90 transition-colors"></div>

                {/* Tab */}
                <div
                    className="absolute -top-1 left-6 w-24 h-8 transform -skew-x-12"
                    style={{ backgroundColor: club.color }}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Classified Stamp */}
                    <div className="absolute -top-2 -right-2 transform rotate-12 opacity-30 group-hover:opacity-50 transition-opacity">
                        <div className="border-4 px-3 py-1" style={{ borderColor: club.color }}>
                            <p className="font-black text-xs tracking-widest uppercase" style={{ color: club.color }}>
                                Classified
                            </p>
                        </div>
                    </div>

                    {/* Club Name */}
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-1" style={{ color: club.color }}>
                            {club.name}
                        </h3>
                        <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
                            {club.tagline}
                        </p>
                    </div>

                    {/* Event Preview */}
                    <div className="mt-4">
                        <div className="h-px bg-black/20 mb-2"></div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-2">
                            {club.event}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 font-mono">
                            {club.date}
                        </p>
                    </div>
                </div>

                {/* Click indicator */}
                <div className="absolute bottom-3 right-3 z-10">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: club.color }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Glow effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                    style={{ backgroundColor: club.color }}
                ></div>
            </div>
        </motion.div>
    )
}

export default EventsModal
