import React from 'react';
import { motion } from 'framer-motion';
import devBg from '../assets/UI/dev-bg.jpg';
import Navbar from '../components/Navbar';

import jaydeepImg from '../assets/UI/Members/Jaydeep.png';
import sandeshImg from '../assets/UI/Members/Sandesh.png';
import harshitImg from '../assets/UI/Members/Harshit.png';

const members = [
  {
    name: "Jaydeep",
    lastName: "Nadkarni",
    post: "Frontend Developer",
    image: jaydeepImg,
  },
  {
    name: "Sandesh",
    lastName: "Chavan",
    post: "Backend Developer",
    image: sandeshImg,
  },
  {
    name: "Harshit",
    lastName: "Baliyan",
    post: "Frontend Developer",
    image: harshitImg,
  }
];

const MobileTeamSinglePage = () => {
  return (
    <>
      <Navbar isMobile={true} />
      <section className="relative w-full min-h-screen bg-[#0a0a0a] md:hidden overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 opacity-30 grayscale contrast-125"
        style={{
          backgroundImage: `url(${devBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(0,0,0,0.85)_100%)]" />

      {/* Header */}
      <div className="relative z-10 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-red-500 mb-3">
            Our TEAM
        </p>
        <h1
          className="text-5xl font-black italic uppercase text-white"
          style={{ fontFamily: '"Bebas Neue", sans-serif' }}
        >
          Developers
        </h1>
      </div>

      {/* Members */}
      <div className="relative z-10 flex flex-col gap-24 pb-32">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center px-6"
          >
            {/* Image */}
            <img
              src={member.image}
              alt={`${member.name} ${member.lastName}`}
              className="w-64 object-contain mb-6 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              style={{
                filter: `
                  drop-shadow(4px 0px 0px white)
                  drop-shadow(-4px 0px 0px white)
                  drop-shadow(0px 4px 0px white)
                  drop-shadow(0px -4px 0px white)
                `
              }}
            />

            {/* Name */}
            <div className="bg-white text-black px-6 py-3 -rotate-2 shadow-xl border-b-4 border-red-600">
              <h2
                className="text-3xl font-black italic uppercase leading-none"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                {member.name} {member.lastName}
              </h2>
            </div>

            {/* Role */}
            <div className="bg-red-600 text-white px-5 py-2 rotate-1 mt-3 shadow-lg border border-white">
              <p
                className="text-lg font-black italic uppercase tracking-widest"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                {member.post}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    </>
  );
};

export default MobileTeamSinglePage;
