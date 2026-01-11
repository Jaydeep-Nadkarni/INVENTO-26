import React from 'react';
import { motion } from 'framer-motion';
import spy1 from '../../assets/UI/spy1.png';
import spy2 from '../../assets/UI/spy2.png';
import img1 from '../../assets/UI/img1.png';

const TeamMember = ({ name, role, quote, specialty, image, index }) => {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black px-4 md:px-0 z-30 shadow-[0_-50px_100px_rgba(0,0,0,1)]">
            {/* Solid Black Layer to ensure absolute coverage */}
            <div className="absolute inset-0 bg-black z-[-1]" />

            {/* Background Halftone Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 z-10 p-8 md:p-12">
                {/* Image Section with Glow and Card-like Backdrop */}
                <motion.div
                    initial={{ opacity: 0, x: -100, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative order-2 md:order-1 group"
                >
                    <div className="absolute -inset-10 bg-red-600/5 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative">
                        <div className="absolute -inset-2 border-2 border-yellow-400/30 rounded-lg blur-sm" />
                        <img
                            src={image}
                            alt={name}
                            className="relative w-64 md:w-[380px] h-auto object-contain drop-shadow-[0_0_50px_rgba(0,0,0,1)] rounded-lg"
                        />
                        {/* Vertical Specialty Text */}
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 -rotate-90">
                            <span className="text-red-600 text-5xl md:text-7xl font-black uppercase tracking-[0.3em] whitespace-nowrap opacity-90 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                                {specialty}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Text Section with localized dark background for focus */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col items-start md:items-end text-left md:text-right max-w-xl order-1 md:order-2 bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/5"
                >
                    <div className="space-y-1">
                        <h4 className="text-yellow-500 font-mono text-xs md:text-sm tracking-[0.5em] uppercase mb-2">
                            -- FILE: 00{index + 1} // NAME --
                        </h4>
                        <h2 className="text-white text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-2xl">
                            {name}
                        </h2>
                    </div>

                    <div className="h-[2px] w-full bg-linear-to-r from-transparent via-yellow-500/50 to-transparent md:bg-linear-to-l my-6" />

                    <h3 className="text-white text-3xl md:text-4xl font-black uppercase italic tracking-widest mb-6 opacity-80 decoration-red-600 decoration-4">
                        {role}
                    </h3>

                    <p className="text-white/60 font-mono text-sm md:text-lg italic leading-relaxed max-w-md border-r-4 border-red-600 pr-6">
                        "{quote}"
                    </p>
                </motion.div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-yellow-400/20" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-yellow-400/20" />
        </div>
    );
};

const TeamReveal = () => {
    const team = [
        {
            name: "BANTY",
            role: "BUNKER",
            quote: "Sometimes, it's better to bunk a class and enjoy with friends, because now, when I look back, marks never make me laugh, but memories do.",
            specialty: "SPECIALIST",
            image: spy1
        },
        {
            name: "AGENT X",
            role: "ARCHITECT",
            quote: "Designing systems that survive the chaos. The grid is my canvas, and logic is my brush.",
            specialty: "ENGINEER",
            image: spy2
        },
        {
            name: "CIPHER",
            role: "GHOST",
            quote: "If you can see me, I've already failed. The best code is the one that's never suspected.",
            specialty: "SECURITY",
            image: img1
        }
    ];

    return (
        <div className="bg-black">
            {team.map((member, index) => (
                <TeamMember key={index} {...member} index={index} />
            ))}
        </div>
    );
};

export default TeamReveal;
