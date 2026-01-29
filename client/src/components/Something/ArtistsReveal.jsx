import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import focusLights from '../../assets/UI/focus lights.png';
import curtainLeft from '../../assets/UI/curtain-left.png';
import curtainRight from '../../assets/UI/curtain-right.png';

const ArtistsReveal = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Stay closed for first 10%, then open until 80%
    const leftX = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "-100%"]);
    const rightX = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative w-full h-[250vh]">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] py-20 px-4 z-20 shadow-[0_-50px_100px_rgba(0,0,0,1)]">
            
            {/* Curtains */}
            <motion.div 
                style={{ x: leftX }}
                className="absolute inset-y-0 left-0 w-[60%] z-50 pointer-events-none"
            >
                <img src={curtainLeft} alt="" className="w-full h-full object-cover object-right" />
            </motion.div>
            <motion.div 
                style={{ x: rightX }}
                className="absolute inset-y-0 right-0 w-[60%] z-50 pointer-events-none"
            >
                <img src={curtainRight} alt="" className="w-full h-full object-cover object-left" />
            </motion.div>
            
            {/* Dark Red Ambient Background */}
            <div className="absolute inset-0 bg-[#450a0a] opacity-40 pointer-events-none" />

            {/* Corner Focus Lights */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {/* Left Light */}
                <div className="absolute top-0 left-0 w-1/2 opacity-60 scale-x-[-1] origin-top-left">
                    <img 
                        src={focusLights} 
                        alt="Left Light" 
                        className="w-full h-auto"
                        style={{ filter: "brightness(0.7) sepia(0.2) hue-rotate(-10deg)" }}
                    />
                </div>
                {/* Right Light */}
                <div className="absolute top-0 right-0 w-[100vw] opacity-60">
                    <img 
                        src={focusLights} 
                        alt="Right Light" 
                        className="w-full h-auto"
                        style={{ filter: "brightness(0.7) sepia(0.2)" }}
                    />
                </div>
            </div>

            {/* Hook Text */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="mb-8 md:mb-12 text-center z-10 px-4"
            >
                <h3 className="text-red-600 font-mono text-xs md:text-xl tracking-[0.5em] uppercase mb-4 font-bold">
                    -- THE HEADLINER --
                </h3>
                <h1 className="text-white text-3xl md:text-6xl font-black uppercase leading-none" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                    Still in the Shadows
                </h1>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-6xl">
                
                {/* Artist Card Container */}
                <div className="relative group mb-8 md:mb-16"> 
                    {/* Artist Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        whileHover={{ rotateY: 15, scale: 1.05 }}
                        className="relative w-48 md:w-64 h-[300px] md:h-[400px] cursor-help perspective-1000"
                    >
                        {/* Glowing highlight */}
                        <div className="absolute -inset-4 bg-red-600/30 rounded-xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative w-full h-full bg-[#1a1a1a] border-4 border-red-900/50 rounded-xs overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center">
                            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="text-[8rem] md:text-[10rem] font-black text-white/10 drop-shadow-[0_0_30px_rgba(153,27,27,0.6)] select-none"
                                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                            >
                                ?
                            </motion.div>

                            {/* Card Corners */}
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-red-700/60" />
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-red-700/60" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-700/50" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-700/50" />
                        </div>
                    </motion.div>
                </div>

                {/* The Stage Section */}
                <div className="relative w-full max-w-2xl h-20 mt-[-30px]">
                    {/* Top Surface of Stage */}
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-red-900/40 to-black rounded-[50%] blur-sm" />
                    
                    {/* Stage Body */}
                    <div 
                        className="w-full h-full bg-[#0a0a0a] border-t-2 border-red-900/30 shadow-[0_-20px_40px_rgba(153,27,27,0.2)]"
                        style={{
                            clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
                            backgroundImage: 'linear-gradient(to bottom, #111 0%, #000 100%)'
                        }}
                    >
                        {/* Stage Edge Highlight */}
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
                    </div>

                    {/* Stage Ground Glow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-12 bg-red-600/10 blur-2xl rounded-full" />
                </div>
            </div>

            {/* Bottom Vignette */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-30" />
            </div>
        </div>
    );
};

export default ArtistsReveal;