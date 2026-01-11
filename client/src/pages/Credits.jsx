import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import kleLogo from '../assets/UI/KLE-TECH.webp';

const Credits = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Force the window to the top immediately
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Play credits music
        const audio = new Audio('/src/assets/audios/credits.mp4'); // Using .mp4 as found in your assets
        audio.loop = true;
        audio.volume = 0.5;

        // Browsers often block auto-play without user interaction, 
        // but since they clicked "Access Credits", it should work.
        audio.play().catch(err => console.log("Audio play blocked until interaction:", err));

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const creditGroups = [
        {
            title: "Executive Producers",
            members: [
                "Dr. S. K. Patil", "Prof. R. M. Kulkarni", "Invento 2026 Core",
                "College Management", "Student Welfare Board", "Dean of Academics",
                "The Strategic Oversight Unit", "Central Intelligence Board"
            ]
        },
        {
            title: "Technical Architects",
            members: [
                "Jaydeep Nadkarni", "Yuvraj Singh", "Prathmesh K.", "Vedant G.",
                "Sumeet R.", "Aditya P.", "Rohan M.", "Sahil T.",
                "Aniket S.", "Manoj B.", "Nitin D.", "Suresh K."
            ]
        },
        {
            title: "Frontend Operatives",
            members: [
                "Aryan J.", "Ishita R.", "Megha S.", "Rahul V.",
                "Karan D.", "Sneha M.", "Pooja B.", "Tanmay G.",
                "Omkar P.", "Shruti K.", "Nikhil W.", "Abhishek L."
            ]
        },
        {
            title: "Backend Intelligence",
            members: [
                "Siddharth N.", "Gaurav M.", "Prerna T.", "Amit S.",
                "Vivek R.", "Divya K.", "Sameer P.", "Neha G.",
                "Varun J.", "Kavita S.", "Mayur D.", "Akash B."
            ]
        },
        {
            title: "Design & UX Command",
            members: [
                "Team Vision", "Aesthetic Operatives", "Creative Nexus",
                "Color Theory Unit", "Typography Squad", "Motion Design Cell",
                "Visual Impact Group", "Interface Intelligence"
            ]
        },
        {
            title: "Database Surveillance",
            members: [
                "Kunal S.", "Maya R.", "Deepak P.", "Ritu G.",
                "Sanjay M.", "Vijay K.", "Lata D.", "Mohit S.",
                "Priya B.", "Arjun N."
            ]
        },
        {
            title: "Quality Assurance Agent",
            members: [
                "Tester Alpha", "Agent Beta", "Delta Squad", "Zero Bug Unit",
                "Stress Test Team", "Security Ops", "Infiltration Testers",
                "Stability Division"
            ]
        },
        {
            title: "Publicity & Media Wing",
            members: [
                "Network Broadcast", "Digital Signal Unit", "Satellite Comms",
                "The Hype Agency", "Propaganda Cell", "Identity Design",
                "Outreach Intelligence"
            ]
        },
        {
            title: "Special Operations",
            members: [
                "The AI Architect", "Department of Computer Science",
                "Automated Reasoning Lab", "Neural Network Analysts",
                "The Anonymous Contributor", "Everyone who believed in the mission"
            ]
        },
        {
            title: "Legacy Contributors",
            members: [
                "Class of 2024 Advisors", "Founding Members", "Ex-Core Intelligence",
                "The Visionaries", "Code Guardians", "Infrastructure Elders"
            ]
        }
    ];

    // Total names roughly 100
    const totalDuration = 60; // Slower scroll speed: 60 seconds

    return (
        <div className="relative bg-black min-h-screen font-serif flex flex-col items-center justify-center overflow-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            {/* Overlay Gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

            {/* Back Button */}
            <motion.button
                onClick={() => navigate('/something')}
                whileHover={{ gap: '1.5rem', color: '#fff' }}
                className="fixed top-12 left-12 z-50 text-red-600/60 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest group transition-colors"
            >
                <div className="w-8 h-px bg-red-600/40 group-hover:w-12 group-hover:bg-white transition-all" />
                Return to Sequence
            </motion.button>

            {/* Scrolling Credits Container */}
            <div className="relative z-0 w-full max-w-4xl">
                <motion.div
                    initial={{ y: "100vh" }}
                    animate={{ y: "calc(-100% + 80vh)" }}
                    transition={{
                        duration: totalDuration,
                        ease: "linear"
                    }}
                    className="flex flex-col items-center gap-20 text-center pb-20"
                >
                    <div className="space-y-4 mb-16">
                        <h1 className="text-white text-5xl font-black uppercase tracking-[0.3em] mb-4">INVENTO</h1>
                        <p className="text-red-600 font-mono tracking-[1.5em] text-lg opacity-80">2026</p>
                    </div>

                    {creditGroups.map((group, i) => (
                        <div key={i} className="flex flex-col items-center gap-6 px-4">
                            <h2 className="text-white/80 text-3xl uppercase font-black mb-4">
                                {group.title}
                            </h2>
                            <div className="space-y-4">
                                {group.members.map((member, j) => (
                                    <h3 key={j} className="text-white/80 text-xl md:text-xl font-bold uppercase tracking-widest transition-opacity hover:text-white">
                                        {member}
                                    </h3>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-40 space-y-8">
                        <div className="h-px w-48 bg-red-900/20 mx-auto" />
                        <p className="text-white font-black text-2xl max-w-sm mx-auto">
                            "Mission Accomplished"
                        </p>
                        <div className="h-px w-48 bg-red-900/20 mx-auto" />
                    </div>

                    <div className="mt-32 pb-24 opacity-80">
                        <img
                            src={kleLogo}
                            alt="KLE Tech Logo"
                            className="w-112 h-auto mx-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        />
                        <p className="text-[10px] font-mono tracking-[0.5em] mt-8 text-white/40">END OF TRANSMISSION</p>
                    </div>

                    <motion.button
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(220, 38, 38, 1)", color: "white", boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="pointer-events-auto px-12 py-4 bt-50 border-2 border-red-600 text-red-600 font-black uppercase text-xl tracking-[0.3em] transition-all bg-transparent mb-[50vh]"
                    >
                        Go Home
                    </motion.button>
                </motion.div>
            </div>

            {/* Cinematic Vignette */}
            <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,1)]" />
        </div>
    );
};

export default Credits;
