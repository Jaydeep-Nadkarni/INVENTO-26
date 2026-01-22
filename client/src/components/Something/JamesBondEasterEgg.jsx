import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import bondImg from '../../assets/UI/james-bond.png';

const JamesBondEasterEgg = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [index, setIndex] = useState(0);

    const sequence = [
        { text: "INVENTO 2026", position: "top-12 left-12", alignment: "text-left" },
        { text: "THE SPYWERSE", position: "bottom-24 right-12", alignment: "text-right" },
        { text: "MISSION IMPOSSIBLE?", position: "top-12 left-12", alignment: "text-left" },
    ];

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const textSectionEnd = 0.9;
            if (latest <= textSectionEnd) {
                const textProgress = latest / textSectionEnd;
                const idx = Math.floor(textProgress * sequence.length);
                const newIndex = Math.min(Math.max(0, idx), sequence.length - 1);
                setIndex(newIndex);
            } else {
                setIndex(sequence.length - 1);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, sequence.length]);

    const currentItem = sequence[index] || sequence[0];

    return (
        <div ref={containerRef} className="relative z-10 bg-black min-h-[500vh] select-none overflow-visible">
            {/* FIXED CONTAINER */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black">

                {/* BACKGROUND & BOND */}
                <div className="absolute inset-0 z-0">
                    {/* Concentric Rings */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-70">
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.08, duration: 1.2 }}
                                className="absolute rounded-full border-[50px] md:border-[80px]"
                                style={{
                                    width: `${(i + 1) * 350}px`,
                                    height: `${(i + 1) * 350}px`,
                                    borderColor: i % 2 === 0 ? '#991b1b' : '#450a0a',
                                    boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9), 0 0 120px rgba(0,0,0,0.9)'
                                }}
                            />
                        ))}
                    </div>

                    {/* Red Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.4)_0%,transparent_60%)] z-5"></div>

                    {/* James Bond Asset */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[90vh] z-10 flex items-end justify-center">
                        <motion.img
                            src={bondImg}
                            alt="James Bond"
                            className="h-full w-auto object-contain drop-shadow-[0_0_80px_rgba(0,0,0,1)]"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        />
                    </div>

                    {/* Scanlines and Vignette Filters */}
                    <div className="absolute inset-0 z-30 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.03),rgba(0,0,255,0.1))] bg-[length:100%_3px,4px_100%] pointer-events-none" />
                    <div className="absolute inset-0 z-25 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
                </div>

                {/* DYNAMIC TEXTS */}
                <div className="absolute inset-0 z-50 pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className={`absolute ${currentItem.position} ${currentItem.alignment} p-8 w-full md:w-auto`}
                        >
                            <h2 
                                className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,1)] leading-[0.9]" 
                                style={{
                                    fontFamily: '"Inter", "Bebas Neue", sans-serif',
                                    fontVariantNumeric: 'tabular-nums lining-nums',
                                    letterSpacing: '-0.05em'
                                }}
                            >
                                {currentItem.text}
                            </h2>
                            <motion.div 
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                className="h-2 bg-red-600 w-32 mt-6 shadow-[0_0_20px_#dc2626] origin-left" 
                                style={{ display: 'inline-block' }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Decode Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 font-mono text-[10px] uppercase tracking-[1em] pointer-events-none animate-pulse">
                    Intel Decoding in Progress
                </div>
            </div>
        </div>
    );
};

export default JamesBondEasterEgg;