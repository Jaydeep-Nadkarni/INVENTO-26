import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import spyVideo from '../assets/UI/Spy-bg-video.mp4';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 w-full h-full bg-black overflow-hidden flex items-center justify-center">
            {/* Fullscreen Video Background */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
            >
                <source src={spyVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center px-6">
                <h1 className="text-8xl md:text-9xl font-black italic uppercase text-white mb-2 tracking-tighter" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                    404
                </h1>
                <div className="h-1 w-24 bg-red-600 mx-auto mb-6" />
                <h2 className="text-2xl md:text-4xl font-bold uppercase text-white mb-4 tracking-widest">
                    Dossier Missing
                </h2>
                <p className="text-zinc-400 font-mono text-sm md:text-base max-w-md mx-auto mb-8">
                    The intelligence you are looking for has been purged or never existed. 
                    Your access to this sector is unauthorized.
                </p>
                
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 mx-auto px-8 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-none hover:bg-red-600 hover:text-white transition-all duration-300 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Base
                </button>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                <div className="w-full h-[2px] bg-red-600/30 absolute top-0 left-0 animate-scan" style={{
                    boxShadow: '0 0 15px 2px rgba(220, 38, 38, 0.4)'
                }} />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}} />
        </div>
    );
};

export default NotFound;
