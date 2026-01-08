import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('INITIALIZING SECURE CONNECTION...');
    const [glitchText, setGlitchText] = useState('');

    const statuses = [
        'AUTHORIZING ACCESS...',
        'RETRIEVING CLASS-4 DOSSIER...',
        'DECLASSIFYING INTEL...',
        'VERIFYING BIOMETRICS...',
        'ESTABLISHING SECURE PROTOCOLS...',
        'FINALIZING CLEARANCE...',
        'ENCRYPTING DATA STREAM...',
        'ACCESS GRANTED.'
    ];

    useEffect(() => {
        const glitchInterval = setInterval(() => {
            const chars = '!@#$%^&*()_+{}[]<>?/|';
            let randomStr = '';
            for(let i = 0; i < 8; i++) {
                randomStr += chars[Math.floor(Math.random() * chars.length)];
            }
            setGlitchText(randomStr);
        }, 100);
        return () => clearInterval(glitchInterval);
    }, []);

    useEffect(() => {
        const duration = 2500; // 2.5 seconds total
        const interval = 30; // update every 30ms
        const increment = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => onComplete(), 500);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    useEffect(() => {
        const statusIndex = Math.floor((progress / 100) * statuses.length);
        if (statusIndex < statuses.length) {
            setStatus(statuses[statusIndex]);
        }
    }, [progress]);

    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-100 bg-[#f5f5f5] flex flex-col items-center justify-center font-mono overflow-hidden"
        >
            {/* Minimalist Grid effect for light theme */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
            
            <div className="w-full max-w-md px-6 space-y-8 relative">
                {/* Spy Header */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="text-red-700 text-sm tracking-[0.3em] font-bold uppercase">
                        Classification: Top Secret
                    </div>
                    <div className="h-px w-12 bg-red-700/30"></div>
                </motion.div>

                {/* Progress Bar Container */}
                <div className="relative">
                    <div className="h-1.5 w-full bg-gray-200 rounded-none overflow-hidden border border-gray-300">
                        <motion.div 
                            className="h-full bg-red-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    
                    {/* Stamp-like accents */}
                    <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-red-700/20"></div>
                    <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-red-700/20"></div>
                </div>

                {/* Status and Percentage */}
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-end">
                        <div className="text-gray-600 text-[10px] items-center flex">
                            <span className="mr-2 text-red-700/40 font-bold tracking-widest">{glitchText}</span>
                            <span className="uppercase tracking-tighter">{status}</span>
                        </div>
                        <div className="text-gray-900 font-black text-2xl tabular-nums">
                            {Math.round(progress)}%
                        </div>
                    </div>
                    
                    {/* Data string bits */}
                    <div className="text-gray-400 text-[9px] font-light break-all opacity-50">
                        ID: {Array.from({ length: 2 }).map(() => Math.random().toString(16).substring(2, 10)).join('-').toUpperCase()} | SEC_LVL: 5 | AUTH_TOKEN: {glitchText}
                    </div>
                </div>
            </div>

            {/* Ambient vignette */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.05) 100%)'
                }}
            ></div>
        </motion.div>
    );
};

export default Loader;
