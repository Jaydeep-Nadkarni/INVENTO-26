import React from 'react';
import { motion } from 'framer-motion';
import paperTexture from '../../assets/UI/paper-texture.jpg';

const CustomEventCard = ({ event, onClick }) => {
    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    const isMasterMiss = /master|miss|mr\./i.test(event.themeName || event.realName);

    const renderSlots = () => {
        if (isMasterMiss) {
            if (!user) return "Master + Miss Available";

            const boys = event.specificSlots?.availableBoysSlots ?? event.specificSlots?.male ?? 0;
            const girls = event.specificSlots?.availableGirlsSlots ?? event.specificSlots?.female ?? 0;


            if (user.gender === "Male") return `${boys} Slots (Master)`;
            if (user.gender === "Female") return `${girls} Slots (Miss)`;
            return "Master + Miss Available";
        }

        return event.slotsAvailable === 'TBD' ? 'OPEN' : event.slotsAvailable;
    };

    return (
        <motion.div
            whileHover={{
                y: -10,
                rotateX: 2,
                rotateY: -2,
                boxShadow: '20px 20px 60px rgba(0,0,0,0.5)',
            }}
            onClick={onClick}
            className="group relative w-full aspect-4/5 overflow-hidden rounded-sm transition-all duration-500 cursor-pointer perspective-1000"
            style={{
                backgroundColor: '#ebe8e3',
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: 'cover',
            }}
        >
            <div className="absolute inset-0 bg-amber-50/80 mix-blend-multiply transition-colors group-hover:bg-red-50/40" />

            {/* Texture Overlay */}
            <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                    backgroundImage: `url(${paperTexture})`,
                    backgroundSize: 'cover',
                    opacity: 0.4,
                    mixBlendMode: 'multiply'
                }}
            />

            {/* Card Top Binding/Tape */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-900/5 backdrop-blur-sm transform rotate-1 flex items-center justify-center z-30">
                <div className="w-full h-px bg-black/10" />
            </div>

            {/* Content Container */}
            <div className="relative z-30 h-full p-8 flex flex-col">

                {/* Top Meta Info & Slots */}
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-[0.3em]">
                            Event #{(event.id || "").toString().slice(0, 4).toUpperCase()}
                        </span>

                        <span className="block text-[8px] font-mono text-red-800 font-bold uppercase tracking-widest">
                            Classified Briefing
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-mono text-gray-400 uppercase tracking-tighter">Capacity</span>
                        <div className="px-2 py-0.5 border border-red-700 text-red-700 text-[10px] font-black uppercase tracking-tighter mt-1">
                            {renderSlots()}
                        </div>
                    </div>
                </div>


                {/* Main Graphic Area with Background Letter */}
                <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <h3
                            className="text-[12rem] md:text-[18rem] font-black text-black/[0.08] select-none"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {(event.themeName || event.realName).charAt(0)}
                        </h3>
                    </div>

                    {/* Hover Stamp */}
                    <div className="absolute z-40 transform rotate-[-15deg] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0">
                        <div className="px-3 py-1 border-2 border-red-700 text-red-700 text-[10px] font-black uppercase tracking-tighter bg-red-50/50 backdrop-blur-sm">
                            INVENTO 2026
                        </div>
                    </div>
                </div>

                {/* Event Name & Fee Section */}
                <div className="space-y-4">
                    <div className="h-px w-full bg-black/20" />

                    <div className="flex flex-col gap-1">
                        <h3
                            className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none group-hover:text-red-700 transition-colors"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {event.themeName || event.realName}
                        </h3>
                        <p className="text-[11px] font-serif italic text-gray-600 leading-tight">
                            {event.realName}
                        </p>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-gray-400 uppercase tracking-[0.2em]">Briefing Fee</span>
                            <span className="text-sm font-bold text-gray-900 tracking-tight">
                                {event.fee}
                            </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold group-hover:bg-red-700 transition-colors">
                            →
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Edge Shadows */}
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            <div className="absolute -right-1 top-24 w-1 h-16 bg-black/20 group-hover:bg-red-600 transition-colors duration-500" />
        </motion.div>
    );
};

export default CustomEventCard;