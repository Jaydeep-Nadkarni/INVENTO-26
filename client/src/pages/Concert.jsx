import React from 'react';
import { motion } from 'framer-motion';
import ArtistsReveal from '../components/Something/ArtistsReveal';
import Navbar from '../components/Navbar';

const Concert = () => {
    return (
        <div className="bg-black min-h-screen">
            <Navbar isMobile={true} />
            <div className="pt-16">
                <ArtistsReveal />
            </div>
        </div>
    );
};

export default Concert;
