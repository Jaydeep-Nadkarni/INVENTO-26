import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BriefcaseInsider = ({ isOpen, onClose }) => {
    // Placeholder data for clubs/pics
    const clubs = [
        { id: 1, name: 'Cyber Security', color: 'bg-red-500', rotate: -6 },
        { id: 2, name: 'AI/ML', color: 'bg-blue-500', rotate: 4 },
        { id: 3, name: 'Blockchain', color: 'bg-green-500', rotate: -12 },
        { id: 4, name: 'Robotics', color: 'bg-yellow-500', rotate: 8 },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-6xl h-[80vh] bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#2a2a2a] relative flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9), 0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Leather Texture Effect Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
                            }}></div>

                        {/* Left Section: Scattered Pics & Items */}
                        <div className="w-full md:w-3/5 h-full relative p-8 border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-br from-black/20 to-black/40">

                            <h3 className="text-white/30 font-mono text-sm tracking-widest absolute top-6 left-6">
                                EVIDENCE CLASSIFICATION: PENDING
                            </h3>

                            {/* Envelope (Note) */}
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 2, zIndex: 50 }}
                                drag
                                dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                                className="absolute top-20 left-10 w-48 h-32 bg-[#e0d6c2] shadow-xl rotate-[5deg] cursor-pointer flex items-center justify-center overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 border-t-[32px] border-r-[32px] border-t-white/20 border-r-[#d1c4a8] shadow-sm"></div>
                                <span className="font-serif text-[#5a4a35] font-bold text-lg tracking-wide opacity-80">CONFIDENTIAL</span>
                            </motion.div>

                            {/* ID Card */}
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -2, zIndex: 50 }}
                                drag
                                dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                                className="absolute bottom-20 right-20 w-40 h-64 bg-white rounded-lg shadow-xl -rotate-[3deg] cursor-pointer overflow-hidden flex flex-col"
                            >
                                <div className="h-20 bg-blue-900 w-full flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white"></div>
                                </div>
                                <div className="p-3 flex flex-col gap-1">
                                    <div className="h-2 w-20 bg-gray-300 rounded"></div>
                                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                                    <div className="mt-4 h-16 w-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        <span className="text-[8px] text-gray-400">QR CODE</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Scattered Clubs (Pics) */}
                            {clubs.map((club, index) => (
                                <motion.div
                                    key={club.id}
                                    whileHover={{ scale: 1.1, zIndex: 60 }}
                                    whileTap={{ scale: 0.95 }}
                                    drag
                                    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                                    className={`absolute w-32 h-40 bg-white shadow-2xl p-2 cursor-pointer flex flex-col group`}
                                    style={{
                                        top: `${30 + (index * 12)}%`,
                                        left: `${30 + (index * 10)}%`,
                                        rotate: `${club.rotate}deg`,
                                        zIndex: 10 + index
                                    }}
                                    onClick={() => window.location.href = `#club-${club.id}`}
                                >
                                    <div className={`w-full h-24 ${club.color} mb-2 overflow-hidden`}>
                                        {/* Image Placeholder */}
                                    </div>
                                    <div className="text-center font-bold text-gray-800 text-xs mt-1 uppercase tracking-tighter">
                                        {club.name}
                                    </div>
                                    <div className="text-[8px] text-gray-500 text-center font-mono">
                                        Case #{1000 + club.id}
                                    </div>
                                </motion.div>
                            ))}

                        </div>

                        {/* Right Section: Laptop Placeholder */}
                        <div className="w-full md:w-2/5 h-full relative bg-gray-900 border-l border-white/5 flex items-center justify-center p-8">

                            <div className="text-white/20 absolute top-4 right-6 font-mono text-xs">
                                DEVICE: SECURE_LAPTOP
                            </div>

                            {/* Laptop Placeholder Graphic */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="w-full aspect-[4/3] bg-gray-800 rounded-lg p-2 shadow-2xl relative border border-gray-700"
                            >
                                <div className="w-full h-full bg-black rounded relative overflow-hidden flex items-center justify-center border border-gray-700">
                                    <span className="text-gray-500 font-mono text-sm animate-pulse">
                                        &gt; SYSTEM OFFLINE_
                                    </span>
                                    {/* Screen Reflection */}
                                    <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                                </div>
                                {/* Keyboard Base Hint */}
                                <div className="absolute -bottom-6 left-[-5%] w-[110%] h-6 bg-gray-700 rounded-b-xl transform perspective-[100px] rotate-x-12 shadow-xl"></div>
                            </motion.div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-[70] w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg"
                        >
                            ×
                        </button>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BriefcaseInsider
