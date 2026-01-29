import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import JamesBondEasterEgg from '../components/Something/JamesBondEasterEgg';
import ArtistsReveal from '../components/Something/ArtistsReveal';

const Something = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-black relative">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/')}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Home</span>
            </button>
            <JamesBondEasterEgg />
            
            {!isMobile ? (
                <>
                    <ArtistsReveal />
                </>
            ) : (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
                    <h2 className="text-4xl font-black italic uppercase text-white mb-6" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                        Access Granted
                    </h2>
                    <p className="text-zinc-400 font-mono text-sm max-w-xs">
                        Desktop view contains the full dossiers. On mobile, use the navigation menu to access Concert and Developer files.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Something;
