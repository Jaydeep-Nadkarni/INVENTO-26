import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Credits = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const creditGroups = [
        {
            title: "Executive Producers",
            members: ["Invento 2026 Core Committee", "College Management", "Student Welfare Board"]
        },
        {
            title: "Lead Developers",
            members: ["Jaydeep", "Yuvraj", "Prathmesh", "Vedant"]
        },
        {
            title: "UI/UX Designers",
            members: ["Team Vision", "Aesthetic Operatives"]
        },
        {
            title: "Content & Strategy",
            members: ["Publicity Wing", "Digital Intelligence Unit"]
        },
        {
            title: "Special Thanks",
            members: ["Department of Computer Science", "The AI Architect", "Everyone who believed in the mission"]
        }
    ];

    return (
        <div className="relative bg-black min-h-screen font-serif flex flex-col items-center justify-center overflow-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            {/* Overlay Gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

            {/* Back Button */}
            <motion.button
                onClick={() => navigate('/something')}
                whileHover={{ gap: '1.5rem' }}
                className="fixed top-12 left-12 z-50 text-red-600 flex items-center gap-3 font-mono text-sm uppercase tracking-widest group"
            >
                <div className="w-8 h-px bg-red-600 group-hover:w-12 transition-all" />
                Return to Sequence
            </motion.button>

            {/* Scrolling Credits Container */}
            <div className="relative z-0 w-full max-w-4xl py-[100vh]">
                <motion.div
                    initial={{ y: "100vh" }}
                    animate={{ y: "-150%" }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity
                    }}
                    className="flex flex-col items-center gap-24 text-center"
                >
                    <div className="space-y-4">
                        <h1 className="text-white text-7xl font-black uppercase tracking-[0.2em] mb-4">INVENTO</h1>
                        <p className="text-red-600 font-mono tracking-[1em] text-xl">2026</p>
                    </div>

                    {creditGroups.map((group, i) => (
                        <div key={i} className="flex flex-col items-center gap-8 px-4">
                            <h2 className="text-red-700 text-sm md:text-md uppercase tracking-[1em] font-mono font-bold mb-4">
                                {group.title}
                            </h2>
                            <div className="space-y-6">
                                {group.members.map((member, j) => (
                                    <h3 key={j} className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight opacity-90 transition-opacity hover:opacity-100">
                                        {member}
                                    </h3>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-32 space-y-8">
                        <div className="h-px w-64 bg-red-900/40 mx-auto" />
                        <p className="text-gray-600 font-serif italic text-xl">
                            "The mission never truly ends. It only evolves."
                        </p>
                        <div className="h-px w-64 bg-red-900/40 mx-auto" />
                    </div>

                    <div className="mt-24">
                        <img
                            src="/logo-loader.svg"
                            alt="Invento Logo"
                            className="w-32 h-32 opacity-20 grayscale"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Cinematic Vignette */}
            <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
        </div>
    );
};

export default Credits;
