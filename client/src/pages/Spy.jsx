import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import spyVideo from '../assets/UI/Spy-bg-video.mp4';

const Spy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/')}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Home</span>
            </button>

            {/* Fullscreen Video */}
            <video 
                autoPlay 
                loop 
                muted
                playsInline
                className="absolute top-0 left-0 w-screen h-screen object-cover"
            >
                <source src={spyVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Spy;
