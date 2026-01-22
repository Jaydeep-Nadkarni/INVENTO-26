import React from 'react';
import TeamReveal from '../components/Something/TeamReveal';
import Navbar from '../components/Navbar';

const Developers = () => {
    return (
        <div className="bg-black min-h-screen">
            <Navbar isMobile={true} />
            <div className="pt-16">
                <TeamReveal />
            </div>
        </div>
    );
};

export default Developers;
