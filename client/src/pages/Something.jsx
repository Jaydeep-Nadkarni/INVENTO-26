import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import JamesBondEasterEgg from '../components/Something/JamesBondEasterEgg';
import ArtistsReveal from '../components/Something/ArtistsReveal';
import TeamReveal from '../components/Something/TeamReveal';

const Something = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        window.scrollTo(0, 0);
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
            <ArtistsReveal />
            <TeamReveal />
        </div>
    );
};

export default Something;
