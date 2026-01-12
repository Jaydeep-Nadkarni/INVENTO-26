import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CreditsLink = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen flex flex-col items-center justify-center bg-black overflow-hidden py-20 px-4 z-40">
            {/* Background elements */}
            <div className="absolute inset-0 bg-black z-[-1]" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-black z-[-1]" />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center z-10"
            >
                <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 opacity-40">
                    The Mission is Complete
                </h2>
                <div className="h-1 w-24 bg-red-600 mx-auto mb-12 shadow-[0_0_15px_#dc2626]" />

                <p className="text-gray-500 font-mono text-sm uppercase tracking-[0.5em] mb-16">
                    Acknowledging the Operatives
                </p>

                <motion.button
                    onClick={() => navigate('/credits')}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(220,38,38,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-12 py-4 bg-transparent border-2 border-red-600 text-red-600 font-black uppercase text-xl tracking-widest overflow-hidden transition-colors hover:text-white"
                >
                    <span className="relative z-10">Access Credits</span>
                    <motion.div
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        className="absolute inset-0 bg-red-600 transition-transform duration-300"
                    />
                </motion.button>
            </motion.div>

            {/* Bottom Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
        </div>
    );
};

export default CreditsLink;
