import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import shutdownAudio from '../../assets/audios/shutdown.mp3'

const Shutdown = ({ mode = 'shutdown', onComplete }) => {
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState(mode === 'startup' ? 'Starting SpyVerse OS...' : 'Shutting down system...')

    useEffect(() => {
        let audio = null
        if (mode === 'shutdown') {
            audio = new Audio(shutdownAudio)
            audio.play().catch(e => console.log("Shutdown sound failed:", e))
        }

        const duration = 3000 // 3 seconds for the effect
        const interval = 50
        const steps = duration / interval
        const increment = 100 / steps

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment
                if (next >= 100) {
                    clearInterval(timer)
                    setTimeout(() => {
                        onComplete()
                    }, 500)
                    return 100
                }
                return next
            })
        }, interval)

        if (mode === 'startup') {
            setTimeout(() => setStatus('Loading Secure Shell...'), 1000)
            setTimeout(() => setStatus('Finalizing Authentication...'), 2000)
        } else {
            setTimeout(() => setStatus('Saving Session Data...'), 800)
            setTimeout(() => setStatus('Encrypting Personal Files...'), 1600)
            setTimeout(() => setStatus('Terminating Connections...'), 2400)
        }

        return () => {
            clearInterval(timer)
            if (audio) {
                audio.pause()
            }
        }
    }, [mode, onComplete])

    return (
        <div className={`absolute inset-0 z-[1000] flex flex-col items-center justify-center p-8 font-sans transition-colors duration-1000 ${mode === 'startup' ? 'bg-[#000080]' : 'bg-black'}`}>
            {/* Retro Windows-like Gradient Header */}
            <div className={`flex flex-col items-center mb-12 transform transition-all duration-700 ${mode === 'shutdown' ? 'scale-90 opacity-80' : 'scale-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 flex flex-wrap gap-1`}>
                        <div className={`w-5 h-5 ${mode === 'startup' ? 'bg-red-600' : 'bg-gray-700'}`}></div>
                        <div className={`w-5 h-5 ${mode === 'startup' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                        <div className={`w-5 h-5 ${mode === 'startup' ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                        <div className={`w-5 h-5 ${mode === 'startup' ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                    </div>
                    <div className="text-white">
                        <h1 className="text-4xl font-black italic tracking-tighter leading-none">SpyVerse</h1>
                        <p className={`text-sm font-bold tracking-widest ${mode === 'startup' ? 'text-blue-400' : 'text-gray-500'}`}>OPERATING SYSTEM</p>
                    </div>
                </div>
                <div className="h-[2px] w-64 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>

            {/* Message Area */}
            <div className="text-center mb-8 min-h-[80px]">
                {mode === 'shutdown' && progress > 80 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        <p className="text-orange-500 text-lg font-bold tracking-tighter">IT IS NOW SAFE TO DISCONNECT</p>
                        <div className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]">Session Terminated</div>
                    </motion.div>
                ) : (
                    <>
                        <p className="text-[#c0c0c0] text-sm uppercase tracking-widest font-bold mb-2">
                            {mode === 'startup' ? 'Initializing Secure Environment...' : 'System is shutting down...'}
                        </p>
                        <p className={`text-xs font-mono ${mode === 'startup' ? 'text-blue-500' : 'text-orange-500'}`}>{status}</p>
                    </>
                )}
            </div>

            {/* Win95 Progress Bar */}
            <div className="w-64 h-6 border-2 border-gray-500 p-0.5 bg-[#c0c0c0] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]">
                <div className={`h-full flex gap-[2px] transition-all duration-300 ${mode === 'startup' ? 'bg-blue-900' : 'bg-gray-800'}`}>
                    {Array.from({ length: Math.floor(progress / 5) }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-full border-r ${mode === 'startup' ? 'bg-blue-400 border-blue-900' : 'bg-orange-600 border-orange-900'}`}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="mt-20 text-[10px] text-gray-700 font-mono tracking-tighter opacity-50">
                (C) COPYRIGHT INVENTO 2026. ALL RIGHTS RESERVED.
            </div>

            {/* CRT Overlay (Stability Improved) */}
            <div className="absolute inset-0 pointer-events-none bg-white opacity-[0.01]"></div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>
    )
}

export default Shutdown
