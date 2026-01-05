import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import paperTexture from '../../assets/UI/paper-texture.jpg'
import pageTurnSound from '../../assets/audios/page-turn.mp3'
import closeSound from '../../assets/audios/briefcase-open.mp3'

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
            { name: 'Solo Singing', type: 'solo', maxTeamSize: 1, description: 'Showcase your vocal talent in a solo performance.' },
            { name: 'Band Battle', type: 'team', maxTeamSize: 4, description: 'Form a band and compete against other groups.' },
            { name: 'Acoustic Jam', type: 'team', maxTeamSize: 4, description: 'Create unplugged magic with your team.' },
            { name: 'Beat Boxing', type: 'solo', maxTeamSize: 1, description: 'Show off your vocal percussion skills.' },
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
        description: 'Workshop on community service initiatives and sustainable development goals.',
        color: '#16a34a',
        events: [
            { name: 'Social Entrepreneurship', type: 'team', maxTeamSize: 4, description: 'Pitch your innovative social business idea.' },
            { name: 'Community Outreach', type: 'team', maxTeamSize: 4, description: 'Plan and present a community service project.' },
            { name: 'NGO Case Study', type: 'solo', maxTeamSize: 1, description: 'Analyze successful NGO initiatives.' },
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
        description: 'Panel discussion on women leadership and gender equality.',
        color: '#9333ea',
        events: [
            { name: 'Leadership Talk', type: 'solo', maxTeamSize: 1, description: 'Deliver an inspiring speech on empowerment.' },
            { name: 'Panel Discussion', type: 'team', maxTeamSize: 4, description: 'Participate in moderated panel discussion.' },
            { name: 'Empowerment Workshop', type: 'team', maxTeamSize: 4, description: 'Conduct an interactive workshop.' },
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
        description: 'Inter-college dance competition featuring multiple styles.',
        color: '#ea580c',
        events: [
            { name: 'Solo Dance', type: 'solo', maxTeamSize: 1, description: 'Express yourself through dance performance.' },
            { name: 'Group Dance', type: 'team', maxTeamSize: 4, description: 'Choreograph and perform synchronized routine.' },
            { name: 'Duet Performance', type: 'team', maxTeamSize: 4, description: 'Partner dance showcasing chemistry.' },
            { name: 'Street Dance Battle', type: 'team', maxTeamSize: 4, description: 'Face-off in intense dance battle.' },
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
        description: 'Corporate recruitment strategies with industry experts.',
        color: '#0891b2',
        events: [
            { name: 'HR Case Study', type: 'team', maxTeamSize: 4, description: 'Analyze and solve HR scenarios.' },
            { name: 'Mock Interview', type: 'solo', maxTeamSize: 1, description: 'Face realistic interview simulation.' },
            { name: 'Recruitment Drive', type: 'team', maxTeamSize: 4, description: 'Design recruitment strategy.' },
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
        description: 'Student photography showcase with various perspectives.',
        color: '#ca8a04',
        events: [
            { name: 'Photography', type: 'solo', maxTeamSize: 1, description: 'Submit best photographs.' },
            { name: 'Photo Story', type: 'team', maxTeamSize: 4, description: 'Create narrative through photos.' },
            { name: 'Videography', type: 'team', maxTeamSize: 4, description: 'Produce short video.' },
            { name: 'Short Film', type: 'team', maxTeamSize: 4, description: 'Create complete short film.' },
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
        description: 'Poetry slam and creative writing competition.',
        color: '#7c3aed',
        events: [
            { name: 'Poetry Slam', type: 'solo', maxTeamSize: 1, description: 'Perform original poetry.' },
            { name: 'Creative Writing', type: 'solo', maxTeamSize: 1, description: 'Submit creative piece.' },
            { name: 'Debate', type: 'team', maxTeamSize: 4, description: 'Engage in formal debate.' },
            { name: 'Story Telling', type: 'solo', maxTeamSize: 1, description: 'Narrate captivating story.' },
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
        description: '24-hour coding challenge with innovative solutions.',
        color: '#0284c7',
        events: [
            { name: 'Hackathon', type: 'team', maxTeamSize: 4, description: 'Build prototype in 24 hours.' },
            { name: 'Web Development', type: 'team', maxTeamSize: 4, description: 'Create functional website.' },
            { name: 'App Development', type: 'team', maxTeamSize: 4, description: 'Develop application.' },
            { name: 'Coding Challenge', type: 'solo', maxTeamSize: 1, description: 'Solve algorithmic problems.' },
        ],
    },
]

const EventsGrid = () => {
    const [selectedClub, setSelectedClub] = useState(null)

    const playSound = (audioFile) => {
        const audio = new Audio(audioFile)
        audio.play().catch(e => console.log("Audio play failed:", e))
    }

    const handleCardClick = (club) => {
        playSound(pageTurnSound)
        setSelectedClub(club)
    }

    const handleCloseModal = () => {
        playSound(closeSound)
        setSelectedClub(null)
    }

    const handleCloseCard = (e) => {
        e.stopPropagation()
        playSound(pageTurnSound)
        setSelectedClub(null)
    }

    return (
        <div className="relative z-10 w-full px-4 md:px-8 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
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
                    Classified Events
                </h1>
                <div className="inline-block bg-black/80 text-yellow-500 px-6 py-2 border-2 border-yellow-600/50 backdrop-blur-sm">
                    <p className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase">
                        [ INVENTO 2026 - MISSION DOSSIERS ]
                    </p>
                </div>
            </motion.div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {clubsData.map((club, index) => (
                    <EventGridCard
                        key={club.id}
                        club={club}
                        index={index}
                        onSelect={() => handleCardClick(club)}
                    />
                ))}
            </div>

            {/* Club Details Modal */}
            <AnimatePresence>
                {selectedClub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 overflow-y-auto"
                        onClick={handleCloseModal}
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
                                    <h2
                                        className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2"
                                        style={{ color: selectedClub.color }}
                                    >
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
        </div>
    )
}

// Event Grid Card Component
const EventGridCard = ({ club, index, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={onSelect}
            className="group cursor-pointer h-full"
        >
            <motion.div
                whileHover={{ y: -8, boxShadow: `0 20px 40px ${club.color}40` }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full bg-amber-50/90 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
            >
                {/* Top Color Bar */}
                <div
                    className="w-full h-12 md:h-16"
                    style={{ backgroundColor: club.color }}
                />

                {/* Card Content */}
                <div className="p-5 md:p-6 space-y-3 h-[calc(100%-3rem)] md:h-[calc(100%-4rem)] flex flex-col">
                    {/* Club Name */}
                    <div className="space-y-1">
                        <h3
                            className="text-lg md:text-xl font-black uppercase tracking-tight leading-tight"
                            style={{ color: club.color }}
                        >
                            {club.name}
                        </h3>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                            {club.tagline}
                        </p>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-2 flex-1">
                        <p className="text-sm md:text-base font-bold text-gray-900">
                            {club.event}
                        </p>
                        <p className="text-xs text-gray-600 font-mono">
                            {club.date}
                        </p>
                    </div>

                    {/* Footer with Arrow Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
                            ID: {club.id.toString().padStart(3, '0')}
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110"
                            style={{ backgroundColor: club.color }}
                        >
                            →
                        </motion.button>
                    </div>
                </div>

                {/* Hover Overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                    style={{ backgroundColor: club.color }}
                />
            </motion.div>
        </motion.div>
    )
}

export default EventsGrid
