import React from 'react'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div 
      className='min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative overflow-hidden'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='absolute inset-0 bg-black opacity-20'></div>
      
      <div className="relative z-10 w-full h-full">
        <Hero />
      </div>
    </div>
  )
}

export default Home