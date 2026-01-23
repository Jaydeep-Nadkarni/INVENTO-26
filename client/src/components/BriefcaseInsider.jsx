import React, { useState, useCallback } from 'react'
import { clubsData } from './Events/clubsData'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import paperTexture from '../assets/UI/paper-texture.jpg'
import laptopImg from '../assets/UI/laptop.png'
import policeRadioImg from '../assets/UI/police-radio.webp'
import morseImg from '../assets/UI/morse.png'
import RetroTerminal from './RetroTerminal/RetroTerminal'
import morseAudio from '../assets/audios/morse.wav'
import radioAudio from '../assets/audios/radio.m4a'
import laptopSound from '../assets/audios/laptopn-open.mp3'
import pageTurnSound from '../assets/audios/page-turn.mp3'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BriefcaseInsider = ({ isOpen, onClose, onNavigateToEvents = null }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isMobile, setIsMobile] = useState(false)

    // Detect mobile
    useEffect(() => {
        const isMobileDevice = () => {
            if (typeof window === 'undefined') return false
            return window.matchMedia('(max-width: 767px)').matches
        }
        setIsMobile(isMobileDevice())

        const mediaQuery = window.matchMedia('(max-width: 767px)')
        const handleChange = (e) => setIsMobile(e.matches)
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
    }, [])

    // Load user data whenever the briefcase is opened or component mounts
    useEffect(() => {
        const fetchUser = () => {
            const storedUser = localStorage.getItem('currentUser')
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser))
                } catch (e) {
                    console.error("Error parsing user data:", e)
                }
            } else {
                setUser(null)
            }
        }

        if (isOpen) {
            fetchUser()
        }
    }, [isOpen])

    // Card Data - All Clubs from clubsData
    const [cards, setCards] = useState([
        { id: 1, name: 'Melodia', color: 'bg-red-700' },
        { id: 2, name: 'CDC', color: 'bg-green-600' },
        { id: 3, name: 'WEC', color: 'bg-purple-600' },
        { id: 4, name: 'Dance', color: 'bg-orange-600' },
        { id: 5, name: 'HR', color: 'bg-blue-600' },
        { id: 6, name: 'Media', color: 'bg-yellow-600' },
        { id: 7, name: 'Literary', color: 'bg-violet-600' },
        { id: 8, name: 'Specials', color: 'bg-cyan-600' },
        { id: 9, name: 'Sports', color: 'bg-emerald-600' },
        { id: 10, name: 'Fine Arts', color: 'bg-pink-600' },
        { id: 11, name: 'Title Events', color: 'bg-amber-600' },
        { id: 12, name: 'Fashion', color: 'bg-rose-600' },
        { id: 13, name: 'Gaming', color: 'bg-green-500' },
    ])

    const [selectedCardId, setSelectedCardId] = useState(null)
    const [isIDExpanded, setIsIDExpanded] = useState(false)
    const [isLetterExpanded, setIsLetterExpanded] = useState(false)
    const [statusText, setStatusText] = useState('Swipe cards to shuffle;')
    const [isTerminalOpen, setIsTerminalOpen] = useState(false)
    const [isMorseOpen, setIsMorseOpen] = useState(false)
    const [morseStep, setMorseStep] = useState(0)
    const [isRadioPlaying, setIsRadioPlaying] = useState(false)
    const [osBootProgress, setOsBootProgress] = useState(0)
    const audioRef = useRef(null)
    const morseAudioRef = useRef(null)

    // Block Inspect and right-click for the entire briefcase experience
    useEffect(() => {
        if (isOpen) {
            const handleContextMenu = (e) => e.preventDefault()
            const handleKeyDown = (e) => {
                if (
                    e.keyCode === 123 || // F12
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
                    (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83)) // Ctrl+U (View Source), Ctrl+S (Save)
                ) {
                    e.preventDefault()
                }
            }
            window.addEventListener('contextmenu', handleContextMenu)
            window.addEventListener('keydown', handleKeyDown)
            return () => {
                window.removeEventListener('contextmenu', handleContextMenu)
                window.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [isOpen])

    // Background OS Loading Simulation
    useEffect(() => {
        if (isOpen) {
            // Reset boot progress to 0 when briefcase is opened
            // The loading animation will now only trigger when handleLaptopClick is called (on laptop click)
            setOsBootProgress(0)
        } else {
            setOsBootProgress(0)
            setIsTerminalOpen(false)
        }
    }, [isOpen])

    useEffect(() => {
        audioRef.current = new Audio(radioAudio)
        audioRef.current.loop = false
        
        // Stop the radio and update status when audio ends
        audioRef.current.onended = () => {
            setIsRadioPlaying(false)
            setStatusText("Radio Signal Lost...")
        }

        morseAudioRef.current = new Audio(morseAudio)

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
            if (morseAudioRef.current) {
                morseAudioRef.current.pause()
                morseAudioRef.current.currentTime = 0
            }
        }
    }, [])

    // Synchronize Morse Audio with Window State
    useEffect(() => {
        if (isMorseOpen) {
            if (morseAudioRef.current) {
                morseAudioRef.current.currentTime = 0
                morseAudioRef.current.play().catch(e => console.log("Morse audio error:", e))
            }
        } else {
            if (morseAudioRef.current) {
                morseAudioRef.current.pause()
                morseAudioRef.current.currentTime = 0
            }
        }
    }, [isMorseOpen])

    // Stop radio if briefcase is closed
    useEffect(() => {
        if (!isOpen && isRadioPlaying) {
            stopRadioIfPlaying()
        }
    }, [isOpen])

    const playEffect = (soundFile) => {
        const audio = new Audio(soundFile)
        audio.play().catch(e => console.log("Sound effect failed:", e))
    }

    const stopRadioIfPlaying = () => {
        if (isRadioPlaying && audioRef.current) {
            audioRef.current.pause()
            setIsRadioPlaying(false)
        }
    }

    const moveCardToBack = () => {
        playEffect(pageTurnSound)
        setCards((prev) => {
            const newCards = [...prev]
            // Shift first card (top of stack) to end (creates infinite loop effect)
            const topCard = newCards.shift()
            newCards.push(topCard)
            return newCards
        })
    }

    const handleCardClick = useCallback((id) => {
        const card = cards.find(c => c.id === id)
        if (selectedCardId === id) {
            // If already selected, navigate
            const club = clubsData.find(c => c.id === id)
            if (club) {
                navigate(`/${club.slug}`)
            } else {
                // Fallback if ID doesn't match standard clubs (e.g. if we add more specials later)
                navigate('/events')
            }
        } else {
            // Select/Pop out
            playEffect(pageTurnSound)
            setSelectedCardId(id)
            setStatusText(`Inspecting: ${card.name} File. Click "OPEN" to reveal details. Click outside the card to close.`)
        }
    }, [selectedCardId, cards, navigate])

    const handleCloseCard = useCallback((e) => {
        e.stopPropagation()
        setSelectedCardId(null)
        setStatusText('Swipe cards to shuffle;')
    }, [])

    const handleRadioClick = useCallback((e) => {
        e.stopPropagation()
        if (isRadioPlaying) {
            audioRef.current.pause()
            setIsRadioPlaying(false)
            setStatusText("Radio Signal Lost...")
        } else {
            setIsMorseOpen(false) // Close morse if playing
            audioRef.current.play()
            setIsRadioPlaying(true)
            setStatusText("Intercepted: Frequency 148.5")
        }
    }, [isRadioPlaying])

    const handleMorseClick = useCallback((e) => {
        e.stopPropagation()
        stopRadioIfPlaying()
        setMorseStep(0) // Reset animation
        setIsMorseOpen(true)
        setStatusText("Incoming Transmission: Decrypting...")
    }, [])

    // Dynamic morse terminal animation
    useEffect(() => {
        if (!isMorseOpen) {
            setMorseStep(0)
            return
        }

        const timers = [
            setTimeout(() => setMorseStep(1), 400),   // System init
            setTimeout(() => setMorseStep(2), 800),   // Signal detected
            setTimeout(() => setMorseStep(3), 1200),  // Decryption
            setTimeout(() => setMorseStep(4), 1600),  // Show encrypted
            setTimeout(() => setMorseStep(5), 2200),  // Processing
            setTimeout(() => setMorseStep(6), 2600),  // Translation complete
            setTimeout(() => setMorseStep(7), 3000),  // Show decrypted
            setTimeout(() => setMorseStep(8), 3400),  // Success status
        ]

        return () => timers.forEach(timer => clearTimeout(timer))
    }, [isMorseOpen])

    const handleLaptopClick = useCallback((e) => {
        e.stopPropagation()
        stopRadioIfPlaying()
        playEffect(laptopSound)
        setIsTerminalOpen(true)
        setStatusText("Accessing the laptop...")
    }, [])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* MOBILE VIEW: Cards only */}
                    {isMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-100 bg-black flex items-center justify-center overflow-hidden will-change-transform"
                            onClick={onClose}
                            style={{
                                WebkitTouchCallout: 'none',
                                WebkitUserSelect: 'none',
                                overscrollBehavior: 'none',
                                position: 'fixed',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden'
                            }}
                        >
                            {/* Mobile Cards Container */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden will-change-transform"
                                onClick={(e) => e.stopPropagation()}
                                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                            >
                                {/* Mobile: Show only cards in center */}
                                <div className="absolute inset-0 flex items-center justify-center will-change-transform" style={{ perspective: '1000px', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                                    <div className="relative w-56 h-80 will-change-transform" style={{ perspective: '1000px', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                                        {/* Cards Stack */}
                                        {cards.slice().reverse().map((card, index) => {
                                            const isTop = index === cards.length - 1
                                            const isSelected = selectedCardId === card.id

                                            return (
                                                <Card
                                                    key={card.id}
                                                    data={card}
                                                    index={index}
                                                    total={cards.length}
                                                    isTop={isTop}
                                                    isSelected={isSelected}
                                                    onSwipe={moveCardToBack}
                                                    onClick={() => handleCardClick(card.id)}
                                                    onClose={handleCloseCard}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Mobile close button */}
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute top-16 right-6 z-1001 text-white text-2xl font-bold hover:text-red-500 transition-colors"
                                    onClick={onClose}
                                >
                                    ✕
                                </motion.button>

                                {/* Mobile status text */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-60 pointer-events-none w-full flex justify-center px-4">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={statusText}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                            className="px-4 py-2 text-center"
                                        >
                                            <p className="text-white font-mono text-xs tracking-[0.3em] uppercase whitespace-normal">
                                                <span className="opacity-50 mr-2">≫</span>
                                                {statusText}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Mobile expanded card overlay */}
                                <AnimatePresence>
                                    {selectedCardId && (
                                        <>
                                            <motion.div
                                                layoutId={`card-${selectedCardId}`}
                                                initial={{ scale: 1, zIndex: 100 }}
                                                animate={{ scale: 1.4, x: 0, y: 0, rotate: 0, zIndex: 1000 }}
                                                exit={{ scale: 1, zIndex: 100 }}
                                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                                className="fixed inset-0 m-auto w-56 h-80 z-1000"
                                                style={{
                                                    backgroundImage: `url(${paperTexture})`,
                                                    backgroundSize: 'cover',
                                                    backgroundBlendMode: 'multiply'
                                                }}
                                            >
                                                <div className="relative w-full h-full bg-[#f4f1ea] rounded shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden cursor-default transform-gpu">
                                                    {/* Paper texture overlay */}
                                                    <div className="absolute inset-0 bg-[#f8f5eb]/80 mix-blend-multiply z-0 pointer-events-none"></div>

                                                    <div className="relative flex-1 p-6 flex flex-col h-full z-10">
                                                        {/* ID Header */}
                                                        <div className="flex justify-between items-center mb-6">
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="w-12 h-1 bg-black/80"></div>
                                                                <div className="w-8 h-0.5 bg-gray-400"></div>
                                                            </div>
                                                            <span className="font-mono text-[7px] text-gray-500 tracking-[0.2em] uppercase bg-transparent px-1">
                                                                DOC_Ref_{2026 + selectedCardId}
                                                            </span>
                                                        </div>

                                                        {/* Main Content Area */}
                                                        <div className="flex-1 flex flex-col justify-start pt-0 space-y-6 relative">

                                                            {/* 1. Header: Club Name (Top) */}
                                                            <div className="relative pb-2 z-10">
                                                                <p className="font-mono text-[8px] text-gray-500 uppercase tracking-widest pl-1 border-l-2 border-red-800/60 mb-1 opacity-70">Subject:</p>
                                                                <h2 className={`font-serif font-black text-3xl text-gray-900 uppercase tracking-tight mix-blend-color-burn leading-[0.85] break-words ${cards.find(c => c.id === selectedCardId)?.name.length > 9 ? 'text-2xl' : ''}`}>
                                                                    {cards.find(c => c.id === selectedCardId)?.name}
                                                                </h2>
                                                                {/* Decorative dash */}
                                                                <div className="mt-3 w-12 h-0.5 bg-black/10"></div>
                                                            </div>

                                                            {/* Confidential Watermark - Behind skeleton text */}
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                                                                <div className="border-[3px] border-red-700/12 px-2 py-1 rounded-sm rotate-[-25deg]">
                                                                    <span className="text-red-700/12 font-serif font-black text-xl uppercase tracking-[0.1em] block leading-none">Confidential</span>
                                                                </div>
                                                            </div>

                                                            {/* 2. Skeleton Illusion (Bottom) */}
                                                            <div className="space-y-3 opacity-60 relative z-10">
                                                                {/* Fake Paragraph 1 */}
                                                                <div className="space-y-1.5">
                                                                    <div className="h-1.5 bg-black/10 w-full rounded-sm"></div>
                                                                    <div className="h-1.5 bg-black/10 w-[92%] rounded-sm"></div>
                                                                    <div className="h-1.5 bg-black/10 w-[96%] rounded-sm"></div>
                                                                    <div className="flex gap-2 w-full pt-1">
                                                                        <div className="h-1.5 bg-black/10 w-2/3 rounded-sm"></div>
                                                                        {/* Redacted word */}
                                                                        <div className="h-2 bg-black/80 w-1/4 rounded-xs skew-x-[-10deg] opacity-80"></div>
                                                                    </div>
                                                                </div>

                                                                {/* Spacer */}
                                                                <div className="h-4"></div>

                                                                {/* Fake Paragraph 2 */}
                                                                <div className="space-y-1.5">
                                                                    <div className="h-1.5 bg-black/5 w-full rounded-sm"></div>
                                                                    <div className="h-1.5 bg-black/5 w-[85%] rounded-sm"></div>
                                                                    <div className="flex items-center gap-2 pt-1">
                                                                        <div className="w-1.5 h-1.5 bg-black/20 rounded-full"></div>
                                                                        <div className="h-1 bg-black/10 w-1/3 rounded-full"></div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        {/* Footer Section - Centered OPEN FILE Button */}
                                                        <div className="z-10 mt-auto flex flex-col items-center gap-3">
                                                            {/* OPEN FILE Button - Red stamp style, centered */}
                                                            <button
                                                                onClick={() => {
                                                                    const club = clubsData.find(c => c.id === selectedCardId)
                                                                    if (club) {
                                                                        navigate(`/${club.slug}`)
                                                                    } else {
                                                                        navigate('/events')
                                                                    }
                                                                }}
                                                                className="group relative border-[2.5px] border-red-700/50 px-6 py-2 rounded-sm hover:border-red-700/80 transition-all hover:scale-105 active:scale-95"
                                                            >
                                                                <span className="text-red-700/70 group-hover:text-red-700 font-black text-[10px] uppercase tracking-[0.3em] block leading-none transition-colors">
                                                                    OPEN FILE
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.7 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 z-999 bg-black/70 backdrop-blur-md"
                                                onClick={handleCloseCard}
                                            />
                                        </>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* DESKTOP VIEW: Full briefcase */}
                    {!isMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-100 bg-black/90 backdrop-blur-md flex items-center justify-center overflow-hidden"
                            onClick={onClose}
                        >
                            {/* Briefcase Container */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                className="relative w-full max-w-full h-screen bg-[#0F0F0F] rounded-xl shadow-2xl overflow-hidden border border-[#333]"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    boxShadow: 'inset 0 0 200px rgba(0,0,0,1), 0 50px 100px -20px rgba(0,0,0,0.7)'
                                }}
                            >
                                {/* Briefcase Rim/Walls */}
                                <div className="absolute inset-x-0 top-0 h-4 bg-[#1a1a1a] border-b border-[#333] z-50"></div>
                                <div className="absolute inset-x-0 bottom-0 h-4 bg-[#1a1a1a] border-t border-[#333] z-50"></div>
                                <div className="absolute inset-y-0 left-0 w-4 bg-[#1a1a1a] border-r border-[#333] z-50"></div>
                                <div className="absolute inset-y-0 right-0 w-4 bg-[#1a1a1a] border-l border-[#333] z-50"></div>

                                {/* Main Content Area */}
                                <div className="absolute inset-4 bg-[#0a0a0a] rounded flex overflow-hidden">
                                    {/* Dark velvet texture overlay */}
                                    <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23333' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>

                                    {/* --- LEFT SECTION: Envelope & ID --- */}
                                    <div className="absolute left-0 top-0 bottom-0 w-[30%] p-8 z-30">

                                        {/* ID Card - Horizontal Agent ID */}
                                        <div className="absolute top-[12%] left-[18%] w-65 h-40 z-40" style={{ perspective: '1000px' }}>
                                            <motion.div
                                                layoutId="id-card"
                                                drag={!isIDExpanded}
                                                dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
                                                whileHover={{ scale: 1.02, rotate: 0 }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setIsIDExpanded(true)
                                                    setStatusText("Inspecting Agent Badge...")
                                                }}
                                                className="relative w-full h-full bg-[#f4f7f9] rounded shadow-2xl overflow-hidden flex flex-col border-t-[6px] border-blue-900 cursor-pointer"
                                                style={{ boxShadow: '5px 10px 30px rgba(0,0,0,0.5)' }}
                                            >
                                                <TextureOverlay opacity={0.12} />

                                                {/* INVENTO Header */}
                                                <div className="w-full bg-blue-900 py-1 px-3 flex justify-between items-center">
                                                    <span className="text-[10px] font-black text-white tracking-widest uppercase">INVENTO 2026</span>
                                                    <div className="flex gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 overflow-hidden">
                                                    {/* Left Column: Photo & Official Seal */}
                                                    <div className="w-[32%] h-full bg-white/60 border-r border-gray-300 flex flex-col items-center py-2">
                                                        <div className="w-16 h-20 bg-gray-200 border-2 border-[#d4af37] rounded-sm overflow-hidden flex items-center justify-center relative shadow-inner mb-1.5">
                                                            {user ? (
                                                                <img src={user.profilePhoto ? (user.profilePhoto.startsWith('data:') || user.profilePhoto.startsWith('http') ? user.profilePhoto : `${import.meta.env.VITE_API_URL}${user.profilePhoto}`) : (user.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")} alt="User" className="w-full h-full object-cover grayscale contrast-125 transition-all duration-700" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-300 flex flex-col items-center justify-center text-gray-500 text-[6px] font-bold text-center px-1">
                                                                    <span className="text-lg opacity-30">👤</span>
                                                                    UNAUTHORIZED
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 border border-black/10"></div>
                                                        </div>
                                                        <div className="mt-0.5 opacity-60 scale-75">
                                                            <div className="w-8 h-8 rounded-full border border-red-800 flex items-center justify-center -rotate-12">
                                                                <span className="text-[4px] font-black text-red-800 text-center leading-1">Verified</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Column: Info & Barcodes */}
                                                    <div className="flex-1 h-full p-2.5 flex flex-col justify-between relative bg-white/40">
                                                        {user ? (
                                                            <div className="space-y-1">
                                                                <h3 className="font-sans font-black text-gray-800 text-sm uppercase tracking-tight leading-none mb-0.5">
                                                                    {user.name}
                                                                </h3>
                                                                <p className="text-[7px] text-gray-600 font-bold uppercase tracking-wider line-clamp-1 mb-1">
                                                                    {user.clgName || user.college || "KLE TECH UNIVERSITY"}
                                                                </p>
                                                                <div className="bg-blue-100/50 p-1 border-l-2 border-blue-900">
                                                                    <div className="text-[5px] text-blue-900 font-mono font-bold tracking-widest uppercase">Agent ID</div>
                                                                    <div className="text-[8px] text-gray-900 font-mono font-black tracking-[0.15em]">{user._id || user.id || "INV-####"}</div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-full flex flex-col justify-center items-center gap-1">
                                                                <span className="text-[8px] font-black text-red-800 animate-pulse">LOGIN REQUIRED</span>
                                                                <button
                                                                    className="px-2 py-1 bg-blue-900 text-white text-[7px] font-bold uppercase rounded-sm hover:bg-blue-800 transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        navigate('/login')
                                                                    }}
                                                                >
                                                                    Identify Agent
                                                                </button>
                                                            </div>
                                                        )}

                                                        <div className="mt-auto pt-1.5 border-t border-gray-200 flex justify-between items-end">
                                                            <div className="space-y-0.5">
                                                                <div className="text-[5px] text-gray-400 font-mono uppercase tracking-tighter">Verified</div>
                                                                <div className="text-[5px] text-gray-500 font-mono font-bold uppercase">Exp: 17 MAR 2026</div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Disclaimer Line */}
                                                <div className="w-full bg-[#1a1a1a] py-0.5 px-2 text-center border-t border-[#333]">
                                                    <p className="text-[4.5px] text-gray-500 uppercase font-mono tracking-tighter">
                                                        This is not the official passes/ID card for INVENTO 2026. For simulation only.
                                                    </p>
                                                </div>

                                                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                                            </motion.div>
                                        </div>

                                        {/* Morse Telegraph Device - Below ID Card */}
                                        <div className="absolute top-[42%] left-[0%] w-48 z-40">
                                            <motion.div
                                                whileHover={{ scale: 1.00 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleMorseClick}
                                                className="relative cursor-pointer group"
                                            >
                                                <img
                                                    src={morseImg}
                                                    alt="Morse Telegraph"
                                                    className="w-full drop-shadow-2xl opacity-90 transition-opacity group-hover:opacity-100"
                                                />
                                                {/* Status light on the device */}
                                                <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-yellow-500/40 animate-pulse pointer-events-none"></div>
                                            </motion.div>
                                        </div>

                                        {/* Confidential Envelope - Bigger */}
                                        <div className="absolute bottom-[5%] left-[10%] w-80 h-52 z-30" style={{ perspective: '1000px' }}>
                                            <motion.div
                                                layoutId="confidential-envelope"
                                                drag={!isLetterExpanded}
                                                dragConstraints={{ left: -100, right: 300, top: -200, bottom: 0 }}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    playEffect(pageTurnSound)
                                                    setIsLetterExpanded(true)
                                                    setStatusText("Reading Classified Intel...")
                                                }}
                                                className="relative w-full h-full bg-[#d6cfc2] shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden"
                                                style={{ rotate: '-3deg', boxShadow: '5px 10px 25px rgba(0,0,0,0.4)' }}
                                            >
                                                <TextureOverlay opacity={0.6} />
                                                <div className="absolute inset-0 border-2 border-[#c4b090] m-3"></div>
                                                {/* Envelope Flap visual */}
                                                <div className="absolute top-0 right-0 border-t-60 border-r-60 border-t-[#ebe1d1] border-r-[#b8aa8e] shadow-sm transform rotate-90"></div>

                                                <div className="flex flex-col items-center gap-2 transform -rotate-6">
                                                    <span className="font-serif text-[#8f2727] font-bold text-2xl tracking-[0.2em] uppercase mix-blend-multiply opacity-90 border-2 border-[#8f2727] px-2 py-1 rounded-sm"
                                                        style={{ transform: 'rotate(-5deg)' }}>
                                                        CONFIDENTIAL
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* --- CENTER LEFT: Police Radio --- */}
                                    <div
                                        className="absolute left-[27%] bottom-[18%] w-60 md:w-50 z-20 pointer-events-none"
                                    >
                                        <motion.div
                                            className="relative w-full h-full pointer-events-auto"
                                            drag
                                            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                                            onClick={handleRadioClick}
                                        >
                                            <img
                                                src={policeRadioImg}
                                                alt="Police Radio"
                                                className="w-full drop-shadow-2xl opacity-90 cursor-pointer"
                                                style={{ rotate: '0deg' }}
                                            />
                                            {/* Radio Indicator LED */}
                                            <div
                                                className={`absolute top-[48%] right-[42%] w-1.5 h-1.5 rounded-full z-30 transition-all duration-300 ${isRadioPlaying
                                                    ? 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse'
                                                    : 'bg-red-900/50'
                                                    }`}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* --- CENTER: Card Bundle --- */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                        <div className="pointer-events-auto relative w-56 h-80" style={{ perspective: '1000px' }}>
                                            <div className="absolute -top-16 left-0 right-0 text-center">
                                                <span className="text-[#C8A951] text-xs font-mono tracking-widest uppercase opacity-70">Evidence Bundle</span>
                                            </div>

                                            {/* Stack Base Shadow */}
                                            <div className="absolute inset-0 bg-black/50 blur-2xl rounded-lg transform translate-y-12 translate-x-6"></div>

                                            {/* Cards Stack */}
                                            {cards.slice().reverse().map((card, index) => {
                                                const isTop = index === cards.length - 1
                                                const isSelected = selectedCardId === card.id

                                                return (
                                                    <Card
                                                        key={card.id}
                                                        data={card}
                                                        index={index}
                                                        total={cards.length}
                                                        isTop={isTop}
                                                        isSelected={isSelected}
                                                        onSwipe={moveCardToBack}
                                                        onClick={() => handleCardClick(card.id)}
                                                        onClose={handleCloseCard}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* --- RIGHT SECTION: Laptop --- */}
                                    <div className="absolute -right-[1%] top-0 bottom-0 w-[50%] flex items-center justify-end z-40 pointer-events-none">
                                        <motion.div
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="relative h-[95%] w-auto flex items-center justify-center pointer-events-auto"
                                            style={{ rotate: '-2deg' }}
                                        >
                                            <img
                                                src={laptopImg}
                                                alt="Secure Laptop"
                                                className="h-full w-auto object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
                                                onClick={handleLaptopClick}
                                            />
                                        </motion.div>
                                    </div>



                                </div>

                                {/* --- STATUS FOOTER --- */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-60 pointer-events-none w-full flex justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={statusText}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                            className="px-6 py-2 "
                                        >
                                            <p className="text-white font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase whitespace-nowrap">
                                                <span className="opacity-50 mr-2">≫</span>
                                                {statusText}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-60 pointer-events-none w-full flex justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                            className="px-6 py-2 "
                                        >
                                            <p className="text-white font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase whitespace-nowrap">
                                                <span className="opacity-50 mr-2">≫</span>
                                                Click on the items to explore
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>


                                {/* --- OVERLAYS --- */}
                                <AnimatePresence>
                                    {/* Expanded Card View */}
                                    {selectedCardId && (
                                        <>
                                            <motion.div
                                                layoutId={`card-${selectedCardId}`}
                                                initial={{ scale: 1, zIndex: 100 }}
                                                animate={{ scale: 1.8, x: 0, y: 0, rotate: 0, zIndex: 1000 }}
                                                exit={{ scale: 1, zIndex: 100 }}
                                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                                className="fixed inset-0 m-auto w-56 h-80 z-1000"
                                                style={{
                                                    backgroundImage: `url(${paperTexture})`,
                                                    backgroundSize: 'cover',
                                                    backgroundBlendMode: 'multiply'
                                                }}
                                            >
                                                <div className="relative w-full h-full bg-[#f4f1ea] rounded shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden cursor-default transform-gpu">
                                                    {/* Paper texture overlay */}
                                                    <div className="absolute inset-0 bg-[#f8f5eb]/80 mix-blend-multiply z-0 pointer-events-none"></div>

                                                    <div className="relative flex-1 p-6 flex flex-col h-full z-10">
                                                        {/* ID Header */}
                                                        <div className="flex justify-between items-center mb-6">
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="w-12 h-1 bg-black/80"></div>
                                                                <div className="w-8 h-0.5 bg-gray-400"></div>
                                                            </div>
                                                            <span className="font-mono text-[7px] text-gray-500 tracking-[0.2em] uppercase bg-transparent px-1">
                                                                DOC_Ref_{2026 + selectedCardId}
                                                            </span>
                                                        </div>

                                                        {/* Main Content Area */}
                                                        <div className="flex-1 flex flex-col justify-start pt-0 space-y-6 relative">

                                                            {/* 1. Header: Club Name (Top) */}
                                                            <div className="relative pb-2 z-10">
                                                                <p className="font-mono text-[8px] text-gray-500 uppercase tracking-widest pl-1 border-l-2 border-red-800/60 mb-1 opacity-70">Subject:</p>
                                                                <h2 className={`font-serif font-black text-3xl text-gray-900 uppercase tracking-tight mix-blend-color-burn leading-[0.85] break-words ${cards.find(c => c.id === selectedCardId)?.name.length > 9 ? 'text-2xl' : ''}`}>
                                                                    {cards.find(c => c.id === selectedCardId)?.name}
                                                                </h2>
                                                                {/* Decorative dash */}
                                                                <div className="mt-3 w-12 h-0.5 bg-black/10"></div>
                                                            </div>

                                                            {/* Confidential Watermark - Behind skeleton text */}
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                                                                <div className="border-[3px] border-red-700/12 px-8 py-3 rounded-sm rotate-[-25deg]">
                                                                    <span className="text-red-700/12 font-serif tracking-[0.1em] font-black text-2xl uppercase block leading-none">Confidential</span>
                                                                </div>
                                                            </div>

                                                            {/* 2. Skeleton Illusion (Bottom) */}
                                                            <div className="space-y-3 opacity-60 relative z-10">
                                                                {/* Fake Paragraph 1 */}
                                                                <div className="space-y-1.5">
                                                                    <div className="h-1.5 bg-black/10 w-full rounded-sm"></div>
                                                                    <div className="h-1.5 bg-black/10 w-[92%] rounded-sm"></div>
                                                                    <div className="h-1.5 bg-black/10 w-[96%] rounded-sm"></div>
                                                                    <div className="flex gap-2 w-full pt-1">
                                                                        <div className="h-1.5 bg-black/10 w-2/3 rounded-sm"></div>
                                                                        {/* Redacted word */}
                                                                        <div className="h-2 bg-black/80 w-1/4 rounded-xs skew-x-[-10deg] opacity-80"></div>
                                                                    </div>
                                                                </div>

                                                                {/* Spacer */}
                                                                <div className="h-4"></div>

                                                                {/* Fake Paragraph 2 */}
                                                                <div className="space-y-1.5">
                                                                    <div className="h-1.5 bg-black/5 w-full rounded-sm"></div>
                                                                    <div className="h-1.5 bg-black/5 w-[85%] rounded-sm"></div>
                                                                    <div className="flex items-center gap-2 pt-1">
                                                                        <div className="w-1.5 h-1.5 bg-black/20 rounded-full"></div>
                                                                        <div className="h-1 bg-black/10 w-1/3 rounded-full"></div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        {/* Footer Section - Centered OPEN FILE Button */}
                                                        <div className="mt-auto flex flex-col items-center gap-3">
                                                            {/* OPEN FILE Button - Red stamp style, centered */}
                                                            <button
                                                                onClick={() => {
                                                                    const club = clubsData.find(c => c.id === selectedCardId)
                                                                    if (club) {
                                                                        navigate(`/${club.slug}`)
                                                                    } else {
                                                                        navigate('/events')
                                                                    }
                                                                }}
                                                                className="group relative border-[2.5px] border-red-700/50 px-6 py-2 rounded-sm hover:border-red-700/80 transition-all hover:scale-105 active:scale-95"
                                                            >
                                                                <span className="text-red-700/70 group-hover:text-red-700 font-black text-[10px] uppercase tracking-[0.3em] block leading-none transition-colors">
                                                                    OPEN FILE
                                                                </span>
                                                            </button>


                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.7 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black z-900 backdrop-blur-md"
                                                onClick={() => handleCloseCard({ stopPropagation: () => { } })}
                                            />
                                        </>
                                    )}

                                    {/* Terminal View */}
                                    {isTerminalOpen && (
                                        <RetroTerminal
                                            isOpen={isTerminalOpen}
                                            onClose={() => setIsTerminalOpen(false)}
                                            initialBootProgress={osBootProgress}
                                        />
                                    )}

                                    {/* Enlarged ID Card View */}
                                    {isIDExpanded && (
                                        <>
                                            <motion.div
                                                layoutId="id-card"
                                                initial={{ scale: 1, zIndex: 100 }}
                                                animate={{ scale: 1.5, x: 0, y: 0, rotate: 0, zIndex: 1000 }}
                                                className="fixed inset-0 m-auto w-65 h-40 z-1000"
                                            >
                                                <div className="relative w-full h-full bg-[#f4f7f9] rounded shadow-2xl overflow-hidden flex flex-col border-t-[6px] border-blue-900 cursor-default">
                                                    <TextureOverlay opacity={0.12} />
                                                    {/* INVENTO Header */}
                                                    <div className="w-full bg-blue-900 py-1 px-3 flex justify-between items-center">
                                                        <span className="text-[10px] font-black text-white tracking-widest uppercase">INVENTO 2026</span>
                                                    </div>

                                                    <div className="flex flex-1">
                                                        {/* Photo Section */}
                                                        <div className="w-[32%] h-full bg-white/60 border-r border-gray-300 flex flex-col items-center py-2">
                                                            <div className="w-16 h-20 bg-gray-200 border-2 border-[#d4af37] rounded-sm overflow-hidden flex items-center justify-center relative shadow-inner">
                                                                {user ? (
                                                                    <img src={user.profilePhoto ? (user.profilePhoto.startsWith('data:') || user.profilePhoto.startsWith('http') ? user.profilePhoto : `${import.meta.env.VITE_API_URL}${user.profilePhoto}`) : (user.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")} alt="User" className="w-full h-full object-cover contrast-125" />
                                                                ) : (
                                                                    <div className="text-gray-400 text-[6px] font-bold uppercase">Unknown</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Info Section */}
                                                        <div className="flex-1 h-full p-2.5 flex flex-col justify-between bg-white/40">
                                                            {user ? (
                                                                <div className="space-y-1">
                                                                    <div>
                                                                        <h3 className="font-sans font-black text-gray-800 text-sm uppercase tracking-tight leading-tight">
                                                                            {user.name}
                                                                        </h3>
                                                                        <p className="text-[8px] text-gray-600 font-medium uppercase tracking-wider">
                                                                            {user.clgName || user.college || "KLE TECH UNIVERSITY"}
                                                                        </p>
                                                                    </div>
                                                                    <div className="bg-blue-100/50 p-1.5 border-l-2 border-blue-900 mt-2">
                                                                        <div className="text-[6px] text-blue-900 font-mono font-bold tracking-widest uppercase">Agent ID</div>
                                                                        <div className="text-[10px] text-gray-900 font-mono font-black tracking-[0.15em]">{user._id || user.id || "INV-####"}</div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="h-full flex flex-col justify-center items-center gap-2">
                                                                    <span className="text-[10px] font-black text-red-800 animate-pulse uppercase tracking-widest">Login Required</span>
                                                                    <button
                                                                        onClick={() => navigate('/login')}
                                                                        className="text-[8px] bg-blue-900 text-white px-3 py-1 font-bold uppercase tracking-tighter hover:bg-black transition-colors"
                                                                    >
                                                                        Identify Agent
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div className="mt-auto pt-1.5 border-t border-gray-200 flex justify-between items-end">
                                                                <div className="space-y-0.5">
                                                                    <div className="text-[6px] text-gray-400 font-mono uppercase">Verified Operative</div>
                                                                    <div className="text-[6px] text-gray-500 font-mono font-bold uppercase">Exp: 17 MAR 2026</div>
                                                                </div>
                                                                <div className="flex flex-col items-end opacity-40">
                                                                    <div className="w-12 h-4 bg-black/80 flex gap-px p-px">
                                                                        {[...Array(15)].map((_, i) => (
                                                                            <div key={i} className={`h-full bg-white ${Math.random() > 0.5 ? 'w-px' : 'w-0.5'}`} />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Disclaimer */}
                                                    <div className="w-full bg-[#1a1a1a] py-0.5 px-2 text-center border-t border-[#333]">
                                                        <p className="text-[4.5px] text-gray-500 uppercase font-mono tracking-tighter">
                                                            This is not the official passes/ID card for INVENTO 2026. For simulation only.
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.6 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black z-900 backdrop-blur-sm"
                                                onClick={() => setIsIDExpanded(false)}
                                            />
                                        </>
                                    )}
                                    {/* Enlarged Confidential Letter View */}
                                    {isLetterExpanded && (
                                        <>
                                            <motion.div
                                                layoutId="confidential-envelope"
                                                initial={{ scale: 1, zIndex: 100 }}
                                                animate={{ scale: 1, x: 0, y: 0, rotate: 0, zIndex: 1000 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="fixed inset-0 m-auto w-[90%] max-w-125 h-[85vh] z-1000"
                                            >
                                                <div className="relative w-full h-full bg-[#f4f1ea] shadow-2xl flex flex-col p-8 md:p-12 overflow-hidden border border-[#d1ccbf]">
                                                    <TextureOverlay opacity={0.4} />

                                                    {/* Letter Header */}
                                                    <div className="flex justify-between items-start mb-8 relative z-10 border-b-2 border-[#8f2727]/30 pb-4">
                                                        <div>
                                                            <h2 className="font-serif font-black text-3xl text-[#8f2727] tracking-tighter uppercase leading-none mb-1">
                                                                Classified
                                                            </h2>
                                                            <p className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
                                                                Directives #2026-INV
                                                            </p>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end">
                                                            <p className="font-mono text-[8px] text-gray-400 uppercase">Priority: High</p>
                                                            <p className="font-mono text-[8px] text-gray-400 uppercase">{new Date().toLocaleDateString('en-GB')}</p>
                                                            <div className="mt-2 px-2 py-0.5 border border-red-800 text-red-800 text-[8px] font-bold uppercase rotate-1">KLE Technological University</div>
                                                        </div>
                                                    </div>

                                                    {/* Letter Content */}
                                                    <div className="flex-1 relative z-10 font-serif text-gray-800 space-y-6 overflow-y-auto hide-scrollbar">
                                                        <div className="space-y-1">
                                                            <p className="font-bold text-sm">TO: {user?.name || "Participant"}</p>
                                                            <p className="font-bold text-sm">SUBJECT: OPERATION INVENTO 2026</p>
                                                        </div>

                                                        <p className="text-base text-sm leading-relaxed italic border-l-4 border-[#8f2727]/20 pl-4 py-1 bg-black/5">
                                                            "The boundaries between creativity and innovation are fading. INVENTO returns in 2026 as SPYVERSE, a space where ideas, talent, and expression converge at KLE Technological University"
                                                        </p>

                                                        <p>Dear {user?.name || "Participant"},</p>

                                                        <div className="space-y-4 text-sm leading-relaxed">
                                                            <p>
                                                                You are invited to be a part of <span className="bg-red-200 px-1 font-bold">INVENTO 2026</span>, the annual fest of KLE Technological University, Dr. M.S. Sheshgiri Campus. What began as a celebration of talent has evolved into a platform where talent, culture, and creativity intersect.
                                                            </p>
                                                            <p>
                                                                This year’s edition brings together some of the most passionate minds, performers, and creators across diverse domains, all united under a single experience <span className="font-bold">SPYVERSE</span>.
                                                            </p>
                                                            <p>
                                                                We invite you to explore, participate, and become a part of INVENTO 2026.
                                                            </p>
                                                        </div>

                                                        <div className="pt-8 opacity-80 pb-4">
                                                            <p className="text-xs font-bold uppercase mb-4">Team INVENTO,</p>
                                                            <p className="font-serif italic text-xs">KLE Technological University, <br /> Dr. M.S. Sheshgiri Campus</p>
                                                        </div>
                                                    </div>

                                                    {/* Texture Overlay for realistic paper */}
                                                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/2 to-black/5 pointer-events-none"></div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.6 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black z-900 backdrop-blur-sm"
                                                onClick={() => {
                                                    setIsLetterExpanded(false)
                                                    setStatusText('Click on the items to explore')
                                                }}
                                            />
                                        </>
                                    )}

                                    {/* Morse Transmission View - Vintage Spy Tool Design */}
                                    {isMorseOpen && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                                            onClick={() => {
                                                setIsMorseOpen(false)
                                                setStatusText('Click on the items to explore')
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.9, opacity: 0 }}
                                                transition={{ type: "spring", damping: 20 }}
                                                className="relative w-full max-w-3xl"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Old CRT Monitor Frame */}
                                                <div className="relative bg-[#2a2520] rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,0.5)]">
                                                    {/* Monitor Bezel */}
                                                    <div className="relative bg-[#1a1816] rounded-lg p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                                                        {/* Screen */}
                                                        <div className="relative bg-black rounded overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                                            {/* CRT Screen Glow */}
                                                            <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-black/50"></div>

                                                            {/* Scanlines Effect */}
                                                            <div className="absolute inset-0 pointer-events-none z-50" style={{
                                                                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,255,0,0.03) 3px)',
                                                                animation: 'scanline 8s linear infinite'
                                                            }}></div>

                                                            {/* Screen Flicker */}
                                                            <div className="absolute inset-0 bg-green-500/5 pointer-events-none animate-pulse" style={{ animationDuration: '0.1s' }}></div>

                                                            {/* Terminal Content */}
                                                            <div className="relative z-10 h-full p-6 font-mono text-green-500 overflow-y-auto hide-scrollbar">
                                                                {/* Terminal Header */}
                                                                <div className="border-b border-green-500/30 pb-3 mb-4">
                                                                    <div className="flex justify-between items-center">
                                                                        <div>
                                                                            <div className="text-xs opacity-70">CLASSIFIED TRANSMISSION SYSTEM v2.4</div>
                                                                            <div className="text-[10px] opacity-50 mt-1">SECURE CHANNEL :: FREQ 148.5 MHz</div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                                                            <span className="text-[10px] opacity-70">RECEIVING</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Terminal Output */}
                                                                <div className="space-y-3 text-sm">
                                                                    {morseStep >= 1 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 0.6, x: 0 }}
                                                                            className="opacity-60"
                                                                        >
                                                                            <span className="text-yellow-500">[SYSTEM]</span> Initializing morse decoder...
                                                                        </motion.div>
                                                                    )}

                                                                    {morseStep >= 2 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 0.6, x: 0 }}
                                                                            className="opacity-60"
                                                                        >
                                                                            <span className="text-yellow-500">[SYSTEM]</span> Signal detected on frequency 148.5 MHz
                                                                        </motion.div>
                                                                    )}

                                                                    {morseStep >= 3 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 0.6, x: 0 }}
                                                                            className="opacity-60"
                                                                        >
                                                                            <span className="text-yellow-500">[SYSTEM]</span> Decryption in progress...
                                                                        </motion.div>
                                                                    )}

                                                                    {morseStep >= 4 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            className="my-4 border-l-2 border-green-500/30 pl-4 py-2 bg-green-500/5"
                                                                        >
                                                                            <div className="text-[10px] opacity-50 mb-2">ENCRYPTED STREAM:</div>
                                                                            <div className="text-yellow-400/80 text-xs tracking-[0.2em] break-all leading-relaxed">
                                                                                .-- . .-.. -.-. --- -- . / - --- / .. -. ...- . -. - --- / ..--- ----- ..--- -.... / ... .--. -.-- / ...- . .-. ... .
                                                                            </div>
                                                                        </motion.div>
                                                                    )}

                                                                    {morseStep >= 5 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 0.6, x: 0 }}
                                                                            className="opacity-60"
                                                                        >
                                                                            <span className="text-yellow-500">[DECODER]</span> Processing morse sequence...
                                                                        </motion.div>
                                                                    )}

                                                                    {morseStep >= 6 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 0.6, x: 0 }}
                                                                            className="opacity-60"
                                                                        >
                                                                            <span className="text-yellow-500">[DECODER]</span> Translation complete.
                                                                        </motion.div>
                                                                    )}

                                                                    {morseStep >= 7 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            transition={{ type: "spring", damping: 15 }}
                                                                            className="my-4 border border-green-500/40 p-4 bg-green-500/10 rounded"
                                                                        >
                                                                            <div className="text-[10px] opacity-50 mb-2">DECRYPTED MESSAGE:</div>
                                                                            <div className="text-green-400 text-lg font-bold tracking-wide uppercase">
                                                                                Welcome to INVENTO 2026
                                                                            </div>
                                                                        </motion.div>
                                                                    )}

                                                                    {morseStep >= 8 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 0.6, x: 0 }}
                                                                            className="opacity-60"
                                                                        >
                                                                            <span className="text-green-500">[STATUS]</span> Transmission received successfully
                                                                        </motion.div>
                                                                    )}

                                                                    {/* Blinking Cursor */}
                                                                    {morseStep >= 8 && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            className="flex items-center gap-1 mt-4"
                                                                        >
                                                                            <span className="opacity-70">$</span>
                                                                            <span className="inline-block w-2 h-4 bg-green-500 animate-pulse"></span>
                                                                        </motion.div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Screen Vignette */}
                                                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] rounded"></div>
                                                        </div>
                                                    </div>

                                                    {/* Monitor Controls */}
                                                    <div className="mt-4 flex justify-between items-center px-2">
                                                        <div className="flex gap-3">
                                                            {/* Fake Control Knobs */}
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#3a3530] to-[#1a1510] border-2 border-[#0a0805] shadow-inner flex items-center justify-center">
                                                                <div className="w-1 h-3 bg-white/20 rounded-full rotate-45"></div>
                                                            </div>
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#3a3530] to-[#1a1510] border-2 border-[#0a0805] shadow-inner flex items-center justify-center">
                                                                <div className="w-1 h-3 bg-white/20 rounded-full -rotate-12"></div>
                                                            </div>
                                                        </div>

                                                        {/* Close Button */}
                                                        <button
                                                            onClick={() => {
                                                                setIsMorseOpen(false)
                                                                setStatusText('Click on the items to explore')
                                                            }}
                                                            className="px-4 py-2 bg-gradient-to-b from-[#4a4540] to-[#2a2520] hover:from-[#5a5550] hover:to-[#3a3530] text-white/90 text-xs font-mono font-bold uppercase tracking-wider rounded border-2 border-[#1a1510] shadow-lg transition-all active:translate-y-0.5"
                                                        >
                                                            [ESC] Close Terminal
                                                        </button>
                                                    </div>

                                                    {/* Power LED */}
                                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 z-70 px-6 py-2 text-white/70 hover:text-white flex items-center gap-3 transition-all shadow-lg group backdrop-blur-md"
                                >
                                    <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] uppercase">Close The Briefcase &gt;&gt;</span>
                                </button>

                            </motion.div>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    )
}

// Texture Helper Component - Memoized to prevent unnecessary re-renders
const TextureOverlay = React.memo(({ opacity = 0.4 }) => (
    <div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply"
        style={{
            backgroundImage: `url(${paperTexture})`,
            backgroundSize: 'cover',
            opacity: opacity
        }}
    ></div>
))

// Individual Card Component - Memoized to prevent unnecessary re-renders during drag operations
const Card = React.memo(({ data, index, total, isTop, isSelected, onSwipe, onClick, onClose }) => {
    // Determine visuals based on stack position (0 is bottom, total-1 is top)
    const rotate = (index % 2 === 0 ? 1 : -1) * (index * 0.4) + (isTop ? 0 : (Math.random() * 2 - 1))
    const offset = (total - 1 - index) * 2 // slight vertical stack offset

    // Drag Logic
    const x = useMotionValue(0)
    const rotateValue = useTransform(x, [-300, 300], [-15, 15])
    const opacity = useTransform(x, [-400, -250, 0, 250, 400], [0, 1, 1, 1, 0])
    const scaleValue = useTransform(x, [-200, 0, 200], [0.95, 1.02, 0.95])

    // Reset drag position when this card becomes the top card
    useEffect(() => {
        if (isTop) {
            x.set(0)
        }
    }, [isTop, x])

    const handleDragEnd = (_, info) => {
        if (!isTop || isSelected) return;

        const dragDistance = Math.abs(info.offset.x)
        const velocity = Math.abs(info.velocity.x)

        // Swiped far enough - trigger shuffle/next
        if (dragDistance > 100 || velocity > 500) {
            onSwipe()
        } else {
            // Spring back if not swiped far enough
            x.set(0)
        }
    }

    const handleClick = (e) => {
        // Only trigger click if movement was minimal (not a swipe)
        if (isTop && Math.abs(x.get()) < 5) {
            onClick()
        }
    }

    if (isSelected) return null

    return (
        <motion.div
            layoutId={`card-${data.id}`}
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotateValue : rotate,
                zIndex: index,
                y: offset,
                opacity: isTop ? opacity : 1,
                scale: isTop ? scaleValue : 1,
                willChange: 'transform, opacity',
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: 'cover',
                backgroundBlendMode: 'multiply'
            }}
            drag={isTop && !isSelected ? "x" : false}
            dragConstraints={{ left: -1500, right: 1500 }}
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            className={`absolute top-0 left-0 w-56 h-80 bg-[#f4f1ea] rounded shadow-[0_4px_15px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing transform-gpu  flex flex-col overflow-hidden`}
        >
            {/* Darken the texture slightly with an overlay since the image might be bright */}
            <div className="absolute inset-0 bg-[#f8f5eb]/80 mix-blend-multiply z-0 pointer-events-none"></div>

            <div className="relative flex-1 p-6 flex flex-col h-full z-10">
                {/* ID Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-0.5">
                        <div className="w-12 h-1 bg-black/80"></div>
                        <div className="w-8 h-0.5 bg-gray-400"></div>
                    </div>
                    <span className="font-mono text-[7px] text-gray-500 tracking-[0.2em] uppercase bg-transparent px-1">
                        DOC_Ref_{2026 + data.id}
                    </span>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-start pt-0 space-y-6">

                    {/* 1. Header: Club Name (Top) */}
                    <div className="relative pb-2">
                        <p className="font-mono text-[8px] text-gray-500 uppercase tracking-widest pl-1 border-l-2 border-red-800/60 mb-1 opacity-70">Subject:</p>
                        <h2 className={`font-serif font-black text-3xl text-gray-900 uppercase tracking-tight mix-blend-color-burn leading-[0.85] break-words ${data.name.length > 9 ? 'text-2xl' : ''}`}>
                            {data.name}
                        </h2>
                        {/* Decorative dash */}
                        <div className="mt-3 w-12 h-0.5 bg-black/10"></div>
                    </div>

                    {/* 2. Skeleton Illusion (Bottom) */}
                    <div className="space-y-3 opacity-60">
                        {/* Fake Paragraph 1 */}
                        <div className="space-y-1.5">
                            <div className="h-1.5 bg-black/10 w-full rounded-sm"></div>
                            <div className="h-1.5 bg-black/10 w-[92%] rounded-sm"></div>
                            <div className="h-1.5 bg-black/10 w-[96%] rounded-sm"></div>
                            <div className="flex gap-2 w-full pt-1">
                                <div className="h-1.5 bg-black/10 w-2/3 rounded-sm"></div>
                                {/* Redacted word */}
                                <div className="h-2 bg-black/80 w-1/4 rounded-xs skew-x-[-10deg] opacity-80"></div>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="h-4"></div>

                        {/* Fake Paragraph 2 */}
                        <div className="space-y-1.5">
                            <div className="h-1.5 bg-black/5 w-full rounded-sm"></div>
                            <div className="h-1.5 bg-black/5 w-[85%] rounded-sm"></div>
                            <div className="flex items-center gap-2 pt-1">
                                <div className="w-1.5 h-1.5 bg-black/20 rounded-full"></div>
                                <div className="h-1 bg-black/10 w-1/3 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Section */}
                <div className="mt-auto flex justify-between items-end  pt-4">
                    <div className="flex flex-col gap-1">
                        <div className="h-1 bg-gray-900/[0.08] w-8 rounded-full"></div>
                        <div className="h-1 bg-gray-900/[0.04] w-12 rounded-full"></div>
                    </div>
                    {/* Security Stamp Style */}
                    <div className="border-2 border-red-700/30 px-2 py-0.5 rounded-sm rotate-[-10deg] scale-90">
                        <span className="text-red-700/50 font-black text-[7px] uppercase tracking-widest block leading-none">Confidential</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
})


export default BriefcaseInsider