import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CMD = ({ eventData }) => {
    const [displayedText, setDisplayedText] = useState('')
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [isTyping, setIsTyping] = useState(false)

    const defaultEventData = {
        title: "INVENTO 2026 - SPYVERSE",
        date: "March 15-17, 2026",
        location: "KLE Institute of Technology",
        classification: "TOP SECRET",
        details: [
            "SECURITY CLEARANCE: LEVEL 5 REQUIRED",
            "MISSION BRIEFING:",
            "- Technical Events: 15+ Challenges",
            "- Cultural Programs: Exclusive Access",
            "- Guest Speakers: Classified Agents",
            "- Prize Pool: $50,000+",
            "",
            "REGISTRATION STATUS: OPEN",
            "THREAT LEVEL: MAXIMUM ENGAGEMENT",
            "",
            "System ready..."
        ]
    }

    const data = eventData || defaultEventData

    const terminalLines = [
        `C:\\INVENTO> ACCESSING CLASSIFIED FILES...`,
        `C:\\INVENTO> DECRYPTING DATA...`,
        ``,
        `╔══════════════════════════════════════════════╗`,
        `║  ${data.classification.padEnd(42)}║`,
        `╚══════════════════════════════════════════════╝`,
        ``,
        `EVENT: ${data.title}`,
        `DATE: ${data.date}`,
        `LOCATION: ${data.location}`,
        ``,
        ...data.details
    ]

    useEffect(() => {
        if (currentLineIndex < terminalLines.length) {
            setIsTyping(true)
            const currentLine = terminalLines[currentLineIndex]
            let charIndex = 0

            const typingInterval = setInterval(() => {
                if (charIndex <= currentLine.length) {
                    setDisplayedText(prev => {
                        const lines = prev.split('\n')
                        lines[currentLineIndex] = currentLine.substring(0, charIndex)
                        return lines.join('\n')
                    })
                    charIndex++
                } else {
                    clearInterval(typingInterval)
                    setIsTyping(false)
                    setTimeout(() => {
                        setCurrentLineIndex(prev => prev + 1)
                        setDisplayedText(prev => prev + '\n')
                    }, 100)
                }
            }, 20)

            return () => clearInterval(typingInterval)
        }
    }, [currentLineIndex, terminalLines])

    return (
        <div className="win95-border-inset m-1">
            <div className="relative bg-black p-4 min-h-[350px] max-h-[50vh] overflow-y-auto terminal-screen">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent bg-[length:100%_4px] animate-scanline"></div>
                <div className="absolute inset-0 pointer-events-none bg-green-500/5 blur-2xl"></div>
                <pre className="relative z-10 font-mono text-xs md:text-sm text-green-400 leading-relaxed whitespace-pre-wrap break-words terminal-text">
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1">_</span>}
                </pre>
            </div>
        </div>
    )
}

export default CMD
