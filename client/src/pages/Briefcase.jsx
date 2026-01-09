import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import Navbar from '../components/Navbar'
import Briefcase from '../components/Briefcase'
import BriefcaseInsider from '../components/BriefcaseInsider'
import openSound from '../assets/audios/briefcase-open2.mp3'
import closeSound from '../assets/audios/briefcase-open.mp3'

const BriefcasePage = () => {
    const navigate = useNavigate()
    const [isBriefcaseOpen, setIsBriefcaseOpen] = useState(false)

    const playSound = (audioFile) => {
        const audio = new Audio(audioFile)
        audio.play().catch(e => console.log("Audio play failed:", e))
    }

    // Auto-open on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            playSound(openSound)
            setIsBriefcaseOpen(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const handleCloseBriefcase = () => {
        playSound(closeSound)
        setIsBriefcaseOpen(false)
        // Navigate back to home after closing animation
        setTimeout(() => navigate('/'), 500)
    }

    const handleNavigateToEvents = () => {
        navigate('/events')
    }

    return (
        <div className="h-screen w-full bg-[#0a0a0a] relative overflow-hidden">
            {/* Fixed Background */}
            <div
                className='fixed inset-0 bg-cover bg-center bg-no-repeat z-0'
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className='absolute inset-0 bg-black/80 backdrop-blur-[4px]'></div>
            </div>

            <BriefcaseInsider
                isOpen={isBriefcaseOpen}
                onClose={handleCloseBriefcase}
                onNavigateToEvents={handleNavigateToEvents}
            />
        </div>
    )
}

export default BriefcasePage
