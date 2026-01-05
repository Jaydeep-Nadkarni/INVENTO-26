import React, { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import paperTexture from '../assets/UI/paper-texture.jpg'
import laptopImg from '../assets/UI/laptop.png'
import policeRadioImg from '../assets/UI/police-radio.png'

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

    const moveCardToBack = () => {
        setCards((prev) => {
            const newCards = [...prev]
            const topCard = newCards.shift()
            newCards.push(topCard)
            return newCards
        })
    }

    const handleCardClick = (id) => {
        if (selectedCardId === id) {
            // If already selected, navigate
            window.location.href = `#club-${id}`
        } else {
            // Select/Pop out
            setSelectedCardId(id)
        }
    }

    const handleCloseCard = (e) => {
        e.stopPropagation()
        setSelectedCardId(null)
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

                                {/* ID Card */}
                                <div className="absolute top-[12%] left-[18%] w-48 h-72 perspective-1000 z-40">
                                    <motion.div
                                        drag
                                        dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
                                        whileHover={{ scale: 1.02, rotate: 0 }}
                                        className="relative w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded shadow-xl overflow-hidden flex flex-col items-center"
                                        style={{ rotate: '-5deg', boxShadow: '2px 4px 15px rgba(0,0,0,0.5)' }}
                                    >
                                        <TextureOverlay opacity={0.3} />

                                        {/* Lanyard Hole */}
                                        <div className="absolute top-2 w-16 h-1 bg-gray-200 rounded-full mx-auto"></div>

                                        {/* Header */}
                                        <div className="w-full h-20 bg-gradient-to-r from-[#002f6c] to-[#003d8f] relative flex items-end justify-center pb-1 overflow-hidden">
                                            <div className="text-[9px] text-white/60 absolute top-1.5 right-2 font-mono tracking-wider">ID: #882-A</div>
                                            <div className="text-white text-[10px] font-bold tracking-widest uppercase opacity-90">Authorized Personnel</div>
                                        </div>

                                        {/* Photo Circle */}
                                        <div className="w-20 h-20 rounded bg-gray-200 border-2 border-white shadow-md -mt-10 relative z-10 overflow-hidden flex items-center justify-center">
                                            {user ? (
                                                <img src={user.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">NO PHOTO</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="mt-3 text-center px-3 w-full">
                                            {user ? (
                                                <>
                                                    <h3 className="font-bold text-gray-800 text-lg font-sans uppercase tracking-wide">{user.name || "Agent Name"}</h3>
                                                    <p className="text-[10px] text-blue-900 font-semibold uppercase tracking-wider mt-0.5">{user.college || "KLE Tech"}</p>
                                                    <div className="mt-3 w-full py-1.5 bg-gray-50 border border-gray-300 flex items-center justify-center">
                                                        <span className="font-mono text-[9px] text-gray-500 tracking-wider">AUTHORIZED ACCESS</span>
                                                    </div>
                                                    <div className="mt-2 text-center">
                                                        <div className="text-[8px] text-gray-400 font-mono">VALID UNTIL: 12/2026</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <h3 className="font-bold text-gray-400 text-base uppercase tracking-tight">Unknown Agent</h3>
                                                    <button className="mt-2 px-3 py-1 bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow hover:bg-red-800 transition-colors">
                                                        Login Required
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Stripe */}
                                        <div className="absolute bottom-0 w-full h-3 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                                    </motion.div>
                                </div>

                                {/* Confidential Envelope - Bigger */}
                                <div className="absolute bottom-[5%] left-[10%] w-80 h-52 z-30">
                                    <motion.div
                                        drag
                                        dragConstraints={{ left: -100, right: 300, top: -200, bottom: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative w-full h-full bg-[#d6cfc2] shadow-2xl flex items-center justify-center"
                                        style={{ rotate: '3deg', boxShadow: '5px 10px 25px rgba(0,0,0,0.4)' }}
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
                            <div className="absolute left-[15%] bottom-[20%] w-60 md:w-120 z-20 pointer-events-none">
                                <motion.img
                                    src={policeRadioImg}
                                    alt="Police Radio"
                                    className="w-full drop-shadow-2xl opacity-90 pointer-events-auto cursor-pointer"
                                    style={{ rotate: '0deg' }}
                                    drag
                                    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                                />
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
                                        className="h-full w-auto object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity"
                                    />
                                </motion.div>
                            </div>

                        </div>

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

    if (isSelected) {
        return (
            <>
                <motion.div
                    layoutId={`card-${data.id}`}
                    initial={{ scale: 1, zIndex: 100 }}
                    animate={{ scale: 1.5, x: -100, y: -50, rotate: 0, zIndex: 1000 }}
                    className="fixed inset-0 m-auto w-64 h-96 z-[1000]"
                >
                    <div className="relative w-full h-full bg-[#ebe8e3] rounded-lg shadow-2xl flex flex-col p-4 cursor-default transform-gpu">
                        <TextureOverlay opacity={0.5} />

                        {/* Expanded Content */}
                        <div className="w-full aspect-square bg-[#0a0a0a] p-1 shadow-inner relative overflow-hidden flex items-center justify-center">
                            <div className={`w-full h-full ${data.color} opacity-80`}></div>
                        </div>

                        <div className="mt-6 text-center">
                            <h2 className="font-serif font-black text-4xl text-gray-800 tracking-tighter uppercase mix-blend-multiply leading-none">
                                {data.name}
                            </h2>
                            <div className="mt-4">
                                <button
                                    onClick={onClick}
                                    className="px-6 py-2 bg-gray-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-red-700 transition-colors"
                                >
                                    Access File
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {/* Backdrop for focus */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="fixed inset-0 bg-black -z-10"
                    onClick={onClose}
                ></motion.div>
            </>
        )
    }

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
            {/* Realistic Shadow for stack depth */}
            <div className="absolute inset-0 rounded shadow-[1px_1px_4px_rgba(0,0,0,0.1)]"></div>

            <TextureOverlay opacity={0.5} />

            {/* Card Content Layout */}
            <div className="relative w-full h-full p-3 flex flex-col items-center">
                {/* Tape/Detail */}
                <div className="w-24 h-6 bg-yellow-100/50 absolute -top-2 rotate-1 opacity-80 backdrop-blur-sm mix-blend-multiply shadow-sm"></div>

                {/* Photo Area */}
                <div className="w-full aspect-square mt-4 bg-white p-2 shadow-inner relative overflow-hidden group">
                    <div className={`w-full h-full ${data.color} relative`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-40"></div>
                    </div>
                </div>

                {/* Text Area */}
                <div className="mt-6 text-center">
                    <h3 className="font-serif font-black text-3xl text-gray-800 tracking-tighter uppercase mix-blend-multiply leading-none transform rotate-1 opacity-90">
                        {data.name}
                    </h3>
                    <p className="font-mono text-[10px] text-gray-400 mt-2 tracking-widest uppercase">
                        Evidence #{100 + data.id}
                    </p>
                </div>

                {/* Stamp/Mark */}
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