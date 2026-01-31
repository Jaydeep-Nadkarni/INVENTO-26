import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import paperTexture from '../assets/UI/paper-texture.jpg';
import bgImage from '../assets/UI/Invento-bg.webp';

// Mobile detection utility
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
};

const Sponsors = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(isMobileDevice());

    // Listen for mobile/desktop switches
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const handleChange = (e) => setIsMobile(e.matches);
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    const sponsorCategories = [
        {
            title: "Title Sponsors",
            sponsors: [
                { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Intel-logo.svg/1200px-Intel-logo.svg.png" },
                { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/2560px-Google_Cloud_logo.svg.png" }
            ]
        },
        {
            title: "Fashion Partner",
            sponsors: [
                { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1280px-Zara_Logo.svg.png" },
                { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png" }
            ]
        },
        {
            title: "Media Partner",
            sponsors: [
                { name: "BBC News", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/BBC_News_2022.svg/1200px-BBC_News_2022.svg.png" },
                { name: "Forbes", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Forbes_logo.svg/2000px-Forbes_logo.svg.png" }
            ]
        },
        {
            title: "Mr. & Miss Sponsor",
            sponsors: [
                { name: "L'oreal", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/L%27Or%C3%A9al_logo.svg/1024px-L%27Or%C3%A9al_logo.svg.png" }
            ]
        },
        {
            title: "Banking Partner",
            sponsors: [
                { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/1200px-HDFC_Bank_Logo.svg.png" }
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-[#1a1a1a] relative overflow-hidden font-serif"
        >
            {/* Mobile: Lightweight flat gradient background */}
            {isMobile ? (
                <div className="fixed inset-0 z-0 bg-gradient-to-b from-gray-900 via-black to-gray-950" />
            ) : (
                // Desktop: Full background with multiple layers
                <>
                    <div
                        className="fixed inset-0 z-0 opacity-30"
                        style={{
                            backgroundImage: `url(${bgImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
                </>
            )}

            <Navbar isMobile={isMobile} />

            <div className="relative z-10 pt-16 md:pt-24 px-4 pb-0 max-w-7xl mx-auto flex flex-col h-screen">

                {/* MAIN CONTENT AREA */}
                <motion.div
                    layout
                    className="flex-1 relative bg-[#f4f1ea] shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[85vh] md:h-[80vh] mb-8"
                    style={{
                        backgroundImage: `url(${paperTexture})`,
                        backgroundSize: 'cover'
                    }}
                >
                    <div className="absolute inset-0 bg-amber-50/30 mix-blend-multiply pointer-events-none" />

                    {/* CONFIDENTIAL WATERMARK */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                        <span className="text-[10rem] md:text-[6rem] font-black text-red-700/5 -rotate-30 select-none whitespace-nowrap border-8 border-red-700/10 p-4">
                            CONFIDENTIAL
                        </span>
                    </div>

                    {/* SINGLE SCROLLABLE CONTAINER FOR HEADER + CONTENT */}
                    <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                        <style jsx>{`
                            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
                        `}</style>

                        {/* Header Section - Now inside scrollable area */}
                        <div className="p-8 md:p-12 pb-6 border-b border-gray-900/10 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] mb-6">
                                <ShieldCheck size={14} className="text-red-600" />
                                <span className="font-mono text-[10px] text-stone-900 uppercase tracking-widest font-black">Patronage Protocol v2.60</span>
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none font-serif">
                                <span className="text-red-700">Sponsors</span>
                            </h2>
                        </div>

                        {/* Sponsors List Content */}
                        <div className="px-6 md:px-12 py-8">
                            <div className="space-y-24 pb-20 max-w-5xl mx-auto">
                                {sponsorCategories.map((category, catIdx) => (
                                    <motion.section
                                        key={catIdx}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.8 }}
                                        className="relative"
                                    >
                                        {/* Category Header */}
                                        <div className="flex items-end justify-between mb-12 border-b-4 border-stone-900 pb-4">
                                            <h2 className="text-2xl md:text-3xl font-serif font-black text-stone-900 uppercase tracking-tighter">
                                                {category.title}
                                            </h2>
                                            <span className="font-mono text-[10px] text-stone-500 font-bold hidden md:inline-block">
                                                AUTH_CAT: 00{catIdx + 1}
                                            </span>
                                        </div>

                                        {/* Sponsors Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {category.sponsors.map((sponsor, sIdx) => (
                                                <motion.div
                                                    key={sIdx}
                                                    whileHover={{ y: -5, scale: 1.02 }}
                                                    className="group relative p-8 flex flex-col items-center justify-center min-h-[180px] hover:border-stone-900 hover:shadow-lg transition-all"
                                                >
                                                    <div className="h-24 w-full flex items-center justify-center mb-6">
                                                        <img
                                                            src={sponsor.logo}
                                                            alt={sponsor.name}
                                                            className="max-h-full max-w-[80%] object-contain filter group-hover:grayscale-0 transition-all duration-500"
                                                        />
                                                    </div>

                                                    <p className="font-serif font-black text-sm uppercase text-stone-900 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {sponsor.name}
                                                    </p>

                                                    {/* Decorative Corners */}
                                                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-stone-300 group-hover:border-stone-900 transition-colors" />
                                                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-stone-300 group-hover:border-stone-900 transition-colors" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>
                                ))}

                                {/* Footer Message */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="mt-20 text-center"
                                >
                                    <div className="max-w-xl mx-auto p-8 border-2 border-dashed border-stone-400 bg-stone-900/5">
                                        <p className="font-serif italic text-stone-700 text-lg">
                                            "Innovation is built on collaboration. We thank our sponsors for making INVENTO 2026 possible."
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Sponsors;
