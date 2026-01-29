import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import paperTexture from '../../assets/UI/paper-texture.jpg'

export const TextureOverlay = ({ opacity = 0.4 }) => (
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

export const CustomAlert = ({ show, title, message, type, onClose }) => (
    <AnimatePresence>
        {show && (
            <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-sm bg-[#fdfbf7] p-6 border-4 border-gray-900 shadow-2xl relative overflow-hidden"
                    style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
                >
                    <TextureOverlay opacity={0.3} />
                    <div className="relative z-10 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${type === 'error' ? 'border-red-600 text-red-600' : 'border-gray-900 text-gray-900'}`}>
                                <span className="text-2xl font-black">{type === 'error' ? '!' : 'i'}</span>
                            </div>
                        </div>
                        <h3 className={`text-xl font-black uppercase tracking-tighter ${type === 'error' ? 'text-red-700' : 'text-gray-900'}`}>
                            {title}
                        </h3>
                        <p className="text-sm font-serif italic text-gray-700 leading-relaxed">
                            {message}
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-2 bg-gray-900 text-white font-bold uppercase tracking-widest hover:bg-black transition-all text-xs"
                        >
                            Understood
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
)

export const VerifyingOverlay = ({ show }) => (
    <AnimatePresence>
        {show && (
            <div className="fixed inset-0 z-500 flex items-center justify-center bg-stone-950/90 backdrop-blur-md">
                <TextureOverlay opacity={0.4} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full p-8"
                >
                    {/* Cinematic Spinner */}
                    <div className="relative w-24 h-24">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-r-2 border-red-600 rounded-full"
                        />
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-2 border-b-2 border-l-2 border-stone-500 rounded-full opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <span className="font-mono text-red-600 font-black text-xs tracking-tighter">SEC_LINK</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="text-center space-y-3">
                        <h3 className="text-2xl font-serif font-black text-white uppercase tracking-tighter">
                            Verifying <span className="text-red-600">Protocol</span>
                        </h3>
                        <div className="flex flex-col gap-1 items-center">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ 
                                            backgroundColor: ["#444", "#ef4444", "#444"],
                                            opacity: [0.5, 1, 0.5] 
                                        }}
                                        transition={{ 
                                            duration: 1, 
                                            repeat: Infinity, 
                                            delay: i * 0.2 
                                        }}
                                        className="w-1.5 h-1.5 rounded-full"
                                    />
                                ))}
                            </div>
                            <p className="font-mono text-[9px] text-stone-500 uppercase tracking-[0.3em] mt-2">
                                Encrypting Transaction Details...
                            </p>
                            <p className="font-mono text-[10px] text-stone-400 italic">
                                "Do not disconnect from the hub"
                            </p>
                        </div>
                    </div>

                    {/* Background Grid for techy look */}
                    <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none overflow-hidden">
                        <div className="grid grid-cols-10 gap-4 w-full h-full p-4">
                            {Array.from({ length: 100 }).map((_, i) => (
                                <div key={i} className="text-[6px] font-mono text-white/20 select-none">
                                    {Math.random() > 0.5 ? '0' : '1'}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
)
