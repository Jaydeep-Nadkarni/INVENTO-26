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
