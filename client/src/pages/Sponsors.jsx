import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.jpg'
import pin from '../assets/UI/pin.png'

const Sponsors = () => {
    const sponsorTiers = [
        {
            tier: "TITLE SPONSORS",
            color: "text-red-700",
            sponsors: [
                { name: "Global Intelligence Corp", description: "Strategic Data & Logistics", category: "Defense" },
                { name: "Nexus Cybernetics", description: "Advanced Surveillance Systems", category: "Technology" }
            ]
        },
        {
            tier: "PLATINUM PATRONS",
            color: "text-gray-800",
            sponsors: [
                { name: "Ghost Protocols", description: "Secure Communication Channels", category: "Software" },
                { name: "Shadow Banking Group", description: "Offshore Financial Infrastructure", category: "Finance" },
                { name: "Vertex Aeronautics", description: "High-Altitude Reconnaissance", category: "Aerospace" }
            ]
        },
        {
            tier: "STRATEGIC PARTNERS",
            color: "text-gray-600",
            sponsors: [
                { name: "Vector Energy", category: "Energy" },
                { name: "Signal Crypt", category: "Encryption" },
                { name: "Titan Logistics", category: "Supply Chain" },
                { name: "Omega Biotech", category: "Bio-Tech" }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-900 overflow-x-hidden pt-24 pb-20"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 relative"
                >
                    <div className="inline-block relative">
                        <h1 className="text-6xl md:text-7xl font-serif font-black text-white tracking-tighter drop-shadow-lg mb-2">
                            OUR <span className="text-red-600">FINANCIERS</span>
                        </h1>
                        <div className="absolute -top-4 -right-12 transform rotate-12 border-4 border-red-600 px-3 py-1 text-red-600 font-bold text-xl uppercase tracking-[0.2em] bg-white shadow-xl opacity-90 mix-blend-multiply">
                            Classified
                        </div>
                    </div>
                    <p className="text-gray-300 font-mono text-lg mt-4 max-w-2xl mx-auto italic">
                        "The organizations funding the operations of the Spyverse. Access to these profiles is strictly monitored."
                    </p>
                </motion.div>

                {/* Sponsors Grid */}
                <div className="space-y-20">
                    {sponsorTiers.map((tier, tierIdx) => (
                        <div key={tierIdx} className="relative">
                            {/* Tier Header */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-1 flex-1 bg-red-800/50"></div>
                                <h2 className={`text-3xl md:text-4xl font-serif font-bold italic tracking-wider ${tier.color} bg-white px-6 py-2 border-l-8 border-red-700 shadow-lg transform -rotate-1`}>
                                    {tier.tier}
                                </h2>
                                <div className="h-1 flex-1 bg-red-800/50"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {tier.sponsors.map((sponsor, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 1 : -1 }}
                                        className="relative p-8 min-h-[180px] flex flex-col justify-center border-4 border-gray-800 shadow-xl"
                                        style={{
                                            backgroundColor: '#fdfbf7',
                                            backgroundImage: `url(${paperTexture})`,
                                            backgroundBlendMode: 'multiply'
                                        }}
                                    >
                                        {/* Pin Image */}
                                        <img src={pin} alt="pin" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 z-20" />
                                        
                                        {/* Sponsor Content */}
                                        <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-widest mb-1 block">
                                            ID: 00{tierIdx}{idx} // {sponsor.category}
                                        </span>
                                        <h3 className="text-2xl font-serif font-black text-gray-900 border-b-2 border-red-200 pb-2 mb-2 leading-tight">
                                            {sponsor.name}
                                        </h3>
                                        {sponsor.description && (
                                            <p className="text-sm font-mono text-gray-600 italic leading-relaxed">
                                                {sponsor.description}
                                            </p>
                                        )}
                                        
                                        {/* Placeholder for Logo */}
                                        <div className="mt-4 border border-dashed border-gray-300 h-16 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-mono text-gray-400">[ LOGO_PLACEHOLDER ]</span>
                                        </div>

                                        {/* Stamp-like corner element */}
                                        <div className="absolute bottom-2 right-2 opacity-10">
                                            <div className="text-[8px] font-mono transform rotate-45 border border-black p-1">
                                                CONFIDENTIAL
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-24 text-center border-t-2 border-white/20 pt-8 opacity-60">
                    <p className="text-white font-mono text-xs">
                        FOR SPONSORSHIP ENQUIRIES, CONTACT COMMAND CENTER: <a href="/contact" className="underline hover:text-red-500">INITIATE_CONTACT.SH</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Sponsors;
