import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import paperTexture from '../assets/UI/paper-texture.jpg';

const Sponsors = () => {
    const navigate = useNavigate();

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
        <div className="min-h-screen w-full relative overflow-x-hidden bg-[#fdfbf7] selection:bg-red-600 selection:text-white">
            <Navbar light={true} />
            
            {/* Texture Layer */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 opacity-50 mix-blend-multiply"
                style={{
                    backgroundImage: `url(${paperTexture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Scrollable Content */}
            <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] mb-8">
                        <ShieldCheck size={14} className="text-red-600" />
                        <span className="font-mono text-[10px] text-stone-900 uppercase tracking-widest font-black">Patronage Protocol v2.60</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-serif font-black text-stone-900 uppercase tracking-tighter leading-[0.8] mb-6">
                        INVENTO <br/><span className="text-red-600">SPONSORS</span>
                    </h1>
                    
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-stone-900/20" />
                        <p className="font-mono text-xs text-stone-600 uppercase tracking-[0.3em]">Our Sponsors</p>
                        <div className="h-[1px] w-12 bg-stone-900/20" />
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <div className="space-y-32">
                    {sponsorCategories.map((category, catIdx) => (
                        <motion.section 
                            key={catIdx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            {/* Category Header */}
                            <div className="flex items-end justify-between mb-12 border-b-4 border-stone-900 pb-4">
                                <h2 className="text-2xl md:text-4xl font-serif font-black text-stone-900 uppercase tracking-tighter">
                                    {category.title}
                                </h2>
                                <span className="font-mono text-[10px] text-stone-500 font-bold">
                                    AUTH_CAT: 00{catIdx + 1}
                                </span>
                            </div>

                            {/* Sponsors Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {category.sponsors.map((sponsor, sIdx) => (
                                    <motion.div
                                        key={sIdx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="group relative p-8 flex flex-col items-center justify-center min-h-[200px]"
                                    >
                                        <div className="h-24 w-full flex items-center justify-center mb-6">
                                            <img 
                                                src={sponsor.logo} 
                                                alt={sponsor.name}
                                                className="max-h-full max-w-[80%] object-contain transition-all duration-500"
                                            />
                                        </div>
                                        
                                        <p className="font-serif font-black text-sm uppercase text-stone-900 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                            {sponsor.name}
                                        </p>

                                        {/* Decorative Corners */}
                                        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-stone-300" />
                                        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-stone-300" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Footer Message */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 text-center space-y-8"
                >
                    <div className="max-w-xl mx-auto p-8 border-2 border-dashed border-stone-400 bg-stone-900/5">
                        <p className="font-serif italic text-stone-700 text-lg mb-4">
                            "Innovation is built on collaboration. We thank our sponsors for making INVENTO 2026 possible."
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Sponsors;
