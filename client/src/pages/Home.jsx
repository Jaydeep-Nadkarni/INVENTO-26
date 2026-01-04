import React from 'react'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div 
      className='min-h-screen bg-cover bg-center bg-no-repeat flex flex-col relative overflow-hidden'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='absolute inset-0 bg-black opacity-20'></div>
      
      <Navbar />
      
      <div className="relative z-10 w-full flex-grow flex items-center justify-center">
        <Hero />
      </div>
    </div>
  )
}

export default Home