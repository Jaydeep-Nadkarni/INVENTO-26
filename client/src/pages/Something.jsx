import React from 'react';
import JamesBondEasterEgg from '../components/Something/JamesBondEasterEgg';
import ArtistsReveal from '../components/Something/ArtistsReveal';
import TeamReveal from '../components/Something/TeamReveal';
import CreditsLink from '../components/Something/CreditsLink';

const Something = () => {
    return (
        <div className="bg-black">
            <JamesBondEasterEgg />
            <ArtistsReveal />
            <TeamReveal />
            <CreditsLink />
        </div>
    );
};

export default Something;
