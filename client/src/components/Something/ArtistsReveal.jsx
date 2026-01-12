import React from 'react';
import { motion } from 'framer-motion';

const ArtistsReveal = () => {
    return (
        <div className="relative w-full min-h-[120vh] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden py-20 px-4 z-20 shadow-[0_-50px_100px_rgba(0,0,0,1)]">
            {/* Dark Red Ambient Background */}
            <div className="absolute inset-0 bg-[#991b1b] opacity-10 pointer-events-none" />

            {/* Focused Spotlights */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[50vw] h-[100vh] bg-[radial-gradient(ellipse_at_top,rgba(153,27,27,0.4)_0%,transparent_70%)] blur-3xl" />
                <div className="absolute top-0 right-1/4 w-[50vw] h-[100vh] bg-[radial-gradient(ellipse_at_top,rgba(153,27,27,0.4)_0%,transparent_70%)] blur-3xl" />
            </div>

            {/* Mystery Cards Container */}
            <div className="flex flex-col md:flex-row gap-12 relative z-10">
                {[1, 2].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -20, rotateY: 10 }}
                        className="relative w-72 h-96 group cursor-help"
                    >
                        {/* Focus Light Effect on Card */}
                        <div className="absolute -inset-4 bg-red-600/20 rounded-xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* The Card */}
                        <div className="relative w-full h-full bg-[#1a1a1a] border-2 border-red-900/50 rounded-xs overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                            {/* Inner Card Texture */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                            {/* Question Mark */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotateY: [0, 10, -10, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="text-9xl font-black text-white/5 drop-shadow-[0_0_30px_#991b1b] select-none"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                ?
                            </motion.div>

                            {/* Corner Accents */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-700/50" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-700/50" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-700/50" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-700/50" />

                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Vignette */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>
    );
};

export default ArtistsReveal;