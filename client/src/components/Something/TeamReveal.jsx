import React from 'react';
import { motion } from 'framer-motion';
import devBg from '../../assets/UI/dev-bg.jpg'; 
import jaydeepImg from '../../assets/UI/Members/Jaydeep.png';
import sandeshImg from '../../assets/UI/Members/Sandesh.png';
import harshitImg from '../../assets/UI/Members/Harshit.png';

const MemberSection = ({ name, lastName, post, image, isLeft }) => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    return (
        <div className="relative w-full h-screen bg-transparent overflow-hidden z-30 flex items-center justify-center font-sans">
            {/* 1. Evidence Board Background Section */}
            <div 
                className="absolute inset-0 z-0 opacity-40 grayscale contrast-125 transition-all duration-700"
                style={{
                    backgroundImage: `url(${devBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Halftone Overlay */}
            <div className="absolute inset-0 z-1 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#ff3131 1.5px, transparent 1.5px)',
                    backgroundSize: '15px 15px',
                }}
            />
            
            {/* 2. Massive Background Text (Behind Character) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 overflow-hidden">
                <motion.h1 
                    initial={{ opacity: 0, x: isLeft ? 100 : -100, rotate: isLeft ? 2 : -2 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-[5rem] md:text-[12rem] font-black italic uppercase tracking-tighter leading-none select-none text-center whitespace-nowrap"
                    style={{ 
                        color: 'transparent',
                        WebkitTextStroke: '1px md:2px rgba(255, 49, 49, 0.2)',
                        fontFamily: '"Bebas Neue", sans-serif'
                    }}
                >
                    {name} {lastName}
                </motion.h1>
            </div>

            {/* 3. Main Layout Section */}
            <div className={`relative z-10 w-full h-full flex flex-col-reverse md:flex-row items-center justify-center md:justify-between px-6 md:px-32 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Name and Labels */}
                <motion.div 
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className={`flex flex-col ${isLeft ? 'items-start md:items-start' : 'items-end md:items-end'} items-center z-20 w-full md:w-auto mt-2 md:mt-0`}
                >
                    <div className="bg-white text-black px-4 md:px-10 py-2 md:py-4 -rotate-2 shadow-2xl border-b-4 md:border-b-6 border-red-600">
                        <h2 className="text-3xl md:text-7xl font-black italic uppercase leading-none" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                            {name} {lastName}
                        </h2>
                    </div>
                    <div className={`bg-red-600 text-white px-3 md:px-8 py-1 md:py-3 rotate-1 -mt-2 shadow-lg border-2 border-white ${isLeft ? 'translate-x-3 md:translate-x-5' : '-translate-x-3 md:-translate-x-5'} self-center md:self-auto`}>
                        <p className="text-lg md:text-3xl font-black italic uppercase tracking-widest leading-none" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                            {post}
                        </p>
                    </div>
                </motion.div>

                {/* Character Image */}
                <div className="relative group mt-20 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring", damping: 15 }}
                        className="relative"
                    >
                        <img 
                            src={image} 
                            alt={`${name} ${lastName}`} 
                            className="relative w-[240px] md:w-[500px] h-auto object-contain z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                            style={{
                                filter: `
                                    drop-shadow(3px 0px 0px white) 
                                    drop-shadow(-3px 0px 0px white) 
                                    drop-shadow(0px 3px 0px white) 
                                    drop-shadow(0px -3px 0px white)
                                `
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Decorative Vignette */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
        </div>
    );
};

const TeamReveal = () => {
    const teamMembers = [
        {
            name: "Jaydeep",
            lastName: "Nadkarni",
            post: "Frontend Developer",
            image: jaydeepImg,
            isLeft: true
        },
        {
            name: "Sandesh",
            lastName: "Chavan",
            post: "Backend Developer",
            image: sandeshImg,
            isLeft: false
        },
        {
            name: "Harshit",
            lastName: "Baliyan",
            post: "Frontend Developer",
            image: harshitImg,
            isLeft: true
        }
    ];

    return (
        <div className="bg-black relative">
            {/* Our Team Heading */}
            <div className="relative w-full py-10 md:py-20 flex justify-center items-center z-40 bg-black overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <h2 
                        className="text-6xl md:text-[12rem] font-black italic uppercase leading-none select-none text-white drop-shadow-[0_0_20px_rgba(255,49,49,0.5)]"
                        style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                    >
                        OUR TEAM
                    </h2>
                    <div className="absolute -bottom-2 left-0 w-full h-2 bg-red-600 rotate-1 shadow-lg" />
                    <div className="absolute -top-2 right-0 w-full h-1 bg-white/20 -rotate-1" />
                </motion.div>
            </div>

            {teamMembers.map((member, index) => (
                <MemberSection key={index} {...member} />
            ))}
        </div>
    );
};

export default TeamReveal;