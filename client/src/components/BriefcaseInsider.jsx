import React, { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import paperTexture from '../assets/UI/paper-texture.jpg'
import laptopImg from '../assets/UI/laptop.png'
import policeRadioImg from '../assets/UI/police-radio.png'
import RetroTerminal from './RetroTerminal/RetroTerminal'
import radioAudio from '../assets/auidos/radio.m4a'
import { useRef, useEffect } from 'react'

const BriefcaseInsider = ({ isOpen, onClose, user = null }) => {
    // Card Data
    const [cards, setCards] = useState([
        { id: 1, name: 'HR and Literary', color: 'bg-red-700' },
        { id: 2, name: 'Dance', color: 'bg-blue-600' },
        { id: 3, name: 'Singing', color: 'bg-emerald-600' },
        { id: 4, name: 'Fashion', color: 'bg-yellow-500' },
        { id: 5, name: 'Media', color: 'bg-purple-600' },
        { id: 6, name: 'Sports', color: 'bg-pink-600' },
        { id: 7, name: 'CDC', color: 'bg-orange-600' },
        { id: 8, name: 'WEC', color: 'bg-blue-600' },
        { id: 9, name: 'Specials', color: 'bg-green-600' },
        { id: 10, name: 'Title Events', color: 'bg-yellow-600' },
    ])

    const [selectedCardId, setSelectedCardId] = useState(null)
    const [statusText, setStatusText] = useState('Swipe cards to shuffle;')
    const [isTerminalOpen, setIsTerminalOpen] = useState(false)
    const [isRadioPlaying, setIsRadioPlaying] = useState(false)
    const audioRef = useRef(null)

    useEffect(() => {
        audioRef.current = new Audio(radioAudio)
        audioRef.current.loop = true
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    const moveCardToBack = () => {
        setCards((prev) => {
            const newCards = [...prev]
            const topCard = newCards.shift()
            newCards.push(topCard)
            return newCards
        })
    }

    const handleCardClick = (id) => {
        const card = cards.find(c => c.id === id)
        if (selectedCardId === id) {
            // If already selected, navigate
            window.location.href = `#club-${id}`
        } else {
            // Select/Pop out
            setSelectedCardId(id)
            setStatusText(`Inspecting: ${card.name} File. Click "Access File" to reveal details. Click outside the card to close.`)
        }
    }

    const handleCloseCard = (e) => {
        e.stopPropagation()
        setSelectedCardId(null)
        setStatusText('Swipe cards to shuffle;')
    }

    const handleRadioClick = (e) => {
        e.stopPropagation()
        if (isRadioPlaying) {
            audioRef.current.pause()
            setIsRadioPlaying(false)
            setStatusText("Radio Signal Lost...")
        } else {
            audioRef.current.play()
            setIsRadioPlaying(true)
            setStatusText("Intercepted: Frequency 148.5")
        }
    }

    const handleLaptopClick = (e) => {
        e.stopPropagation()
        setIsTerminalOpen(true)
        setStatusText("Accessing the laptop...")
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center overflow-hidden"
                    onClick={onClose}
                >
                    {/* Briefcase Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="relative w-full max-w-[100vw] h-[100vh] bg-[#0F0F0F] rounded-xl shadow-2xl overflow-hidden border border-[#333]"
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
                                <div className="absolute top-[12%] left-[12%] w-[260px] h-[160px] perspective-1000 z-40">
                                    <motion.div
                                        drag
                                        dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
                                        whileHover={{ scale: 1.02, rotate: 0 }}
                                        className="relative w-full h-full bg-[#f4f7f9] rounded shadow-2xl overflow-hidden flex border-t-[6px] border-[#002f6c]"
                                        style={{ rotate: '-3deg', boxShadow: '5px 10px 30px rgba(0,0,0,0.5)' }}
                                    >
                                        <TextureOverlay opacity={0.12} />

                                        {/* Left Column: Photo & Official Seal */}
                                        <div className="w-[32%] h-full bg-white/60 border-r border-gray-300 flex flex-col items-center py-3">
                                            <div className="w-16 h-20 bg-gray-200 border-2 border-[#d4af37] rounded-sm overflow-hidden flex items-center justify-center relative shadow-inner mb-1.5">
                                                {user ? (
                                                    <img src={user.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-[8px] font-bold">MISSING</div>
                                                )}
                                                <div className="absolute inset-0 border border-black/10"></div>
                                            </div>
                                            <div className="mt-1 opacity-60">
                                                <div className="w-8 h-8 rounded-full border border-red-800 flex items-center justify-center -rotate-12">
                                                    <span className="text-[4px] font-black text-red-800 text-center leading-[4px]">OFFICIAL<br />SEAL</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Info & Barcodes */}
                                        <div className="flex-1 h-full p-3.5 flex flex-col justify-between relative">
                                            <div>
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-[#002f6c] tracking-[0.1em] uppercase">Intelligence Agency</span>
                                                        <span className="text-[7px] font-bold text-red-700 opacity-80 uppercase tracking-widest">Authorized Personnel</span>
                                                    </div>
                                                </div>
                                                <h3 className="font-sans font-black text-gray-800 text-lg uppercase tracking-tighter leading-tight drop-shadow-sm">
                                                    {user?.name || "REDACTED"}
                                                </h3>
                                                <p className="text-[9px] text-gray-600 font-medium uppercase tracking-wider mt-0.5">
                                                    {user?.college || "KLE TECH UNIVERSITY"}
                                                </p>
                                            </div>

                                            <div className="mt-auto space-y-1.5">
                                                <div className="flex justify-between items-end border-t border-gray-200 pt-2">
                                                    <div className="space-y-0.5">
                                                        <div className="text-[6px] text-gray-400 font-mono uppercase">Level 4 Clearance</div>
                                                        <div className="text-[6px] text-gray-500 font-mono font-bold uppercase">Exp: 12 JAN 2026</div>
                                                    </div>
                                                    {/* Fake Barcode */}
                                                    <div className="flex gap-[1px] h-6 items-end opacity-70">
                                                        {[2, 4, 1, 3, 2, 5, 2, 4].map((h, i) => (
                                                            <div key={i} className={`bg-black w-[1.5px]`} style={{ height: `${h * 3}px` }}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                                    </motion.div>
                                </div>

                                {/* Confidential Envelope - Bigger */}
                                <div className="absolute bottom-[5%] left-[10%] w-80 h-52 z-30">
                                    <motion.div
                                        drag
                                        dragConstraints={{ left: -100, right: 300, top: -200, bottom: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative w-full h-full bg-[#d6cfc2] shadow-2xl flex items-center justify-center"
                                        style={{ rotate: '3deg', boxShadow: '5px 10px 25px (0,0,0,0.4)' }}
                                    >
                                        <TextureOverlay opacity={0.6} />
                                        <div className="absolute inset-0 border-[2px] border-[#c4b090] m-3"></div>
                                        {/* Envelope Flap visual */}
                                        <div className="absolute top-0 right-0 border-t-[60px] border-r-[60px] border-t-[#ebe1d1] border-r-[#b8aa8e] shadow-sm transform rotate-90"></div>

                                        <div className="flex flex-col items-center gap-2 transform -rotate-2">
                                            <span className="font-serif text-[#8f2727] font-bold text-3xl tracking-[0.2em] uppercase mix-blend-multiply opacity-90 border-2 border-[#8f2727] px-4 py-2 rounded-sm"
                                                style={{ transform: 'rotate(-5deg)' }}>
                                                TOP SECRET
                                            </span>
                                            <span className="font-mono text-[10px] text-gray-500 tracking-widest">DO NOT OPEN</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* --- CENTER LEFT: Police Radio --- */}
                            <div
                                className="absolute left-[27%] bottom-[18%] w-60 md:w-[200px] z-20 pointer-events-none"
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
                                <div className="pointer-events-auto relative w-56 h-80 perspective-1000">
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
                            <div className="absolute right-[-5%] top-0 bottom-0 w-[50%] flex items-center justify-end z-40 pointer-events-none">
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
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-full flex justify-center">
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


                        {/* --- OVERLAYS --- */}
                        <AnimatePresence>
                            {/* Expanded Card View */}
                            {selectedCardId && (
                                <>
                                    <motion.div
                                        layoutId={`card-${selectedCardId}`}
                                        initial={{ scale: 1, zIndex: 100 }}
                                        animate={{ scale: 1.5, x: 0, y: 0, rotate: 0, zIndex: 1000 }}
                                        className="fixed inset-0 m-auto w-64 h-96 z-[1000]"
                                    >
                                        <div className="relative w-full h-full bg-[#ebe8e3] rounded-lg shadow-2xl flex flex-col p-4 cursor-default transform-gpu">
                                            <TextureOverlay opacity={0.5} />
                                            <div className="w-full aspect-square bg-[#0a0a0a] p-1 shadow-inner relative overflow-hidden flex items-center justify-center">
                                                <div className={`w-full h-full ${cards.find(c => c.id === selectedCardId)?.color} opacity-80`}></div>
                                            </div>
                                            <div className="mt-6 text-center">
                                                <h2 className="font-serif font-black text-4xl text-gray-800 tracking-tighter uppercase mix-blend-multiply leading-none">
                                                    {cards.find(c => c.id === selectedCardId)?.name}
                                                </h2>
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => window.location.href = `#club-${selectedCardId}`}
                                                        className="px-6 py-2 bg-gray-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-red-700 transition-colors"
                                                    >
                                                        Access File
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black z-[900] backdrop-blur-sm"
                                        onClick={() => handleCloseCard({ stopPropagation: () => { } })}
                                    />
                                </>
                            )}

                            {/* Terminal View */}
                            <RetroTerminal
                                isOpen={isTerminalOpen}
                                onClose={() => setIsTerminalOpen(false)}
                            />
                        </AnimatePresence>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-[70] w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#333] hover:bg-red-900/80 text-white/70 hover:text-white flex items-center justify-center transition-all shadow-lg group"
                        >
                            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">×</span>
                        </button>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Texture Helper Component
const TextureOverlay = ({ opacity = 0.4 }) => (
    <div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply"
        style={{
            backgroundImage: `url(${paperTexture})`,
            backgroundSize: 'cover',
            opacity: opacity
        }}
    ></div>
)

// Individual Card Component
const Card = ({ data, index, total, isTop, isSelected, onSwipe, onClick, onClose }) => {
    // Determine visuals based on stack position (0 is bottom, total-1 is top)
    const rotate = (index % 2 === 0 ? 1 : -1) * (index * 0.4) + (isTop ? 0 : (Math.random() * 2 - 1))
    const offset = (total - 1 - index) * 2 // slight vertical stack offset

    // Drag Logic
    const x = useMotionValue(0)
    const rotateValue = useTransform(x, [-200, 200], [-15, 15])
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

    const handleDragEnd = (_, info) => {
        if (!isSelected && Math.abs(info.offset.x) > 100) {
            // Swiped far enough - trigger shuffle/next
            onSwipe()
        }
    }

    if (isSelected) return null // Handled by parent overlay now

    return (
        <motion.div
            layoutId={`card-${data.id}`}
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotateValue : rotate,
                zIndex: index,
                y: offset,
                opacity: isTop ? opacity : 1,
                scale: isTop ? 1.05 : 1
            }}
            drag={isTop && !isSelected ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onClick={() => isTop ? onClick() : null}
            className={`absolute top-0 left-0 w-56 h-80 bg-[#ebe8e3] rounded shadow-sm cursor-grab active:cursor-grabbing transform-gpu border border-gray-300`}
        >
            <div className="absolute inset-0 rounded shadow-[1px_1px_4px_rgba(0,0,0,0.1)]"></div>
            <TextureOverlay opacity={0.5} />
            <div className="relative w-full h-full p-3 flex flex-col items-center">
                <div className="w-24 h-6 bg-yellow-100/50 absolute -top-2 rotate-1 opacity-80 backdrop-blur-sm mix-blend-multiply shadow-sm"></div>
                <div className="w-full aspect-square mt-4 bg-white p-2 shadow-inner relative overflow-hidden group">
                    <div className={`w-full h-full ${data.color} relative`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-40"></div>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <h3 className="font-serif font-black text-3xl text-gray-800 tracking-tighter uppercase mix-blend-multiply leading-none transform rotate-1 opacity-90">
                        {data.name}
                    </h3>
                    <p className="font-mono text-[10px] text-gray-400 mt-2 tracking-widest uppercase">
                        Evidence #{100 + data.id}
                    </p>
                </div>
                <div className="absolute bottom-6 right-6 text-red-700/60 border-4 border-red-700/60 px-2 py-1 text-[10px] font-black rotate-[-12deg] tracking-widest uppercase rounded-sm mix-blend-multiply">
                    Verified
                </div>
                {isTop && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">Inspect</span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}


export default BriefcaseInsider