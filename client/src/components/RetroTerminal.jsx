import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RetroTerminal = ({ isOpen, onClose, eventData }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [openWindow, setOpenWindow] = useState(null) // null, 'terminal', 'briefcase', 'classified', 'topsecret'
  const [lastClickTime, setLastClickTime] = useState(0)
  const [lastClickedIcon, setLastClickedIcon] = useState(null)

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Default event data if none provided
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
      "Press [ESC] to close desktop..."
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

  // Handle icon double-click
  const handleIconClick = (iconId) => {
    const now = Date.now()
    if (lastClickedIcon === iconId && now - lastClickTime < 500) {
      // Double-click detected
      handleOpenApp(iconId)
      setLastClickTime(0)
      setLastClickedIcon(null)
    } else {
      // Single click - just select
      setSelectedIcon(iconId)
      setLastClickTime(now)
      setLastClickedIcon(iconId)
    }
  }

  const handleOpenApp = (iconId) => {
    setDisplayedText('')
    setCurrentLineIndex(0)
    setIsTyping(false)
    
    switch(iconId) {
      case 3: // BRIEFCASE.exe
      case 4: // MISSION_BRIEF.txt
        setOpenWindow('terminal')
        break
      case 1: // TOP SECRET.doc
        setOpenWindow('topsecret')
        break
      case 2: // CLASSIFIED_FILES
        setOpenWindow('classified')
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!isOpen || openWindow !== 'terminal') {
      return
    }

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
      }, 30)

      return () => clearInterval(typingInterval)
    }
  }, [isOpen, currentLineIndex, openWindow])

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Desktop Icons Data
  const desktopIcons = [
    { id: 1, name: 'TOP SECRET.doc', icon: '📄', color: 'text-red-600', app: 'topsecret' },
    { id: 2, name: 'CLASSIFIED_FILES', icon: '📁', color: 'text-yellow-500', app: 'classified' },
    { id: 3, name: 'BRIEFCASE.exe', icon: '💼', color: 'text-gray-300', app: 'terminal' },
    { id: 4, name: 'MISSION_BRIEF.txt', icon: '📝', color: 'text-white', app: 'terminal' }
  ]

  const closeWindow = () => {
    setOpenWindow(null)
    setDisplayedText('')
    setCurrentLineIndex(0)
    setIsTyping(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] win95-desktop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedIcon(null)
            }
          }}
        >
          {/* Desktop Area */}
          <div className="relative w-full h-full pb-10">
            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 flex flex-col gap-4">
              {desktopIcons.map((icon) => (
                <motion.div
                  key={icon.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleIconClick(icon.id)}
                  className={`flex flex-col items-center cursor-pointer p-2 w-24 ${
                    selectedIcon === icon.id ? 'bg-blue-600/50 border border-dotted border-white' : ''
                  }`}
                >
                  <div className={`text-5xl ${icon.color} drop-shadow-lg`}>{icon.icon}</div>
                  <div className="text-white text-xs text-center mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {icon.name}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Windows - Conditionally Rendered */}
            <AnimatePresence>
              {openWindow === 'terminal' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 30 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
              {/* Window Container */}
              <div className="bg-[#c0c0c0] win95-border-raised shadow-2xl">
                {/* Title Bar */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-black flex items-center justify-center text-green-400 text-xs font-bold">
                      C
                    </div>
                    <span className="text-white text-sm font-bold">
                      [CLASSIFIED] C:\INVENTO\SPYVERSE
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Minimize Button */}
                    <button className="win95-button w-5 h-5 flex items-center justify-center text-xs opacity-50 cursor-not-allowed">
                      _
                    </button>
                    {/* Maximize Button */}
                    <button className="win95-button w-5 h-5 flex items-center justify-center text-xs opacity-50 cursor-not-allowed">
                      □
                    </button>
                    {/* Close Button */}
                    <button
                      onClick={closeWindow}
                      className="win95-button w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Menu Bar */}
                <div className="bg-[#c0c0c0] px-2 py-1 border-b border-gray-400 flex gap-3 text-xs">
                  <span className="hover:bg-blue-700 hover:text-white px-1 cursor-pointer">File</span>
                  <span className="hover:bg-blue-700 hover:text-white px-1 cursor-pointer">Edit</span>
                  <span className="hover:bg-blue-700 hover:text-white px-1 cursor-pointer">View</span>
                  <span className="hover:bg-blue-700 hover:text-white px-1 cursor-pointer">Help</span>
                </div>

                {/* CMD Content Area */}
                <div className="win95-border-inset m-1">
                  <div className="relative bg-black p-4 min-h-[400px] max-h-[60vh] overflow-y-auto terminal-screen">
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent bg-[length:100%_4px] animate-scanline"></div>
                    
                    {/* CRT Glow */}
                    <div className="absolute inset-0 pointer-events-none bg-green-500/5 blur-2xl"></div>

                    {/* Terminal Content */}
                    <pre className="relative z-10 font-mono text-sm text-green-400 leading-relaxed whitespace-pre-wrap break-words terminal-text">
                      {displayedText}
                      {isTyping && <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1">_</span>}
                    </pre>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-[#c0c0c0] px-2 py-1 border-t border-gray-400 flex items-center justify-between text-xs">
                  <div className="win95-border-inset px-2 py-0.5 flex-1 mr-2">
                    <span className="spy-accent-red">● CLASSIFIED</span>
                  </div>
                  <div className="win95-border-inset px-2 py-0.5">
                    SECURE
                  </div>
                </div>
              </div>

              {/* Resize Handle (visual only) */}
              <div className="absolute bottom-0 right-0 w-4 h-4 opacity-50">
                <svg viewBox="0 0 16 16" className="w-full h-full text-gray-600">
                  <path fill="currentColor" d="M16 16L16 13L13 16ZM16 10L10 16L13 16L16 13ZM16 7L7 16L10 16L16 10Z"/>
                </svg>
              </div>
                </motion.div>
              )}

              {/* TOP SECRET.doc Window */}
              {openWindow === 'topsecret' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 30 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-[#c0c0c0] win95-border-raised shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-2 py-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📄</span>
                        <span className="text-white text-sm font-bold">TOP SECRET.doc - Notepad</span>
                      </div>
                      <button onClick={closeWindow} className="win95-button w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white">×</button>
                    </div>
                    <div className="win95-border-inset m-1">
                      <div className="bg-white p-6 min-h-[300px] font-mono text-sm">
                        <div className="text-red-600 font-bold text-center mb-4 text-lg">⚠️ TOP SECRET ⚠️</div>
                        <div className="mb-4">CLASSIFICATION: EYES ONLY</div>
                        <div className="mb-4">SUBJECT: INVENTO 2026 - SPYVERSE OPERATION</div>
                        <div className="border-t border-b border-black py-2 my-4">
                          <p>This document contains highly classified information regarding the INVENTO 2026 event.</p>
                          <p className="mt-2">Mission Parameters:</p>
                          <ul className="ml-4 mt-2">
                            <li>• Date: March 15-17, 2026</li>
                            <li>• Location: KLE Institute of Technology</li>
                            <li>• Clearance Level: 5 Required</li>
                            <li>• Expected Agents: 1000+</li>
                          </ul>
                        </div>
                        <div className="text-red-600 font-bold mt-4">UNAUTHORIZED ACCESS PROHIBITED</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CLASSIFIED_FILES Window */}
              {openWindow === 'classified' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 30 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-[#c0c0c0] win95-border-raised shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-2 py-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📁</span>
                        <span className="text-white text-sm font-bold">CLASSIFIED_FILES</span>
                      </div>
                      <button onClick={closeWindow} className="win95-button w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white">×</button>
                    </div>
                    <div className="bg-[#c0c0c0] px-2 py-1 border-b border-gray-400 flex gap-3 text-xs">
                      <span className="hover:bg-blue-700 hover:text-white px-1">File</span>
                      <span className="hover:bg-blue-700 hover:text-white px-1">Edit</span>
                      <span className="hover:bg-blue-700 hover:text-white px-1">View</span>
                    </div>
                    <div className="win95-border-inset m-1">
                      <div className="bg-white p-4 min-h-[300px]">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 p-2 hover:bg-blue-600 hover:text-white cursor-pointer">
                            <span className="text-2xl">📝</span>
                            <span className="text-sm">agent_roster.txt</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 hover:bg-blue-600 hover:text-white cursor-pointer">
                            <span className="text-2xl">🔒</span>
                            <span className="text-sm">security_protocols.pdf</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 hover:bg-blue-600 hover:text-white cursor-pointer">
                            <span className="text-2xl">📊</span>
                            <span className="text-sm">event_schedule.xlsx</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 hover:bg-blue-600 hover:text-white cursor-pointer">
                            <span className="text-2xl">🎯</span>
                            <span className="text-sm">mission_objectives.doc</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 hover:bg-blue-600 hover:text-white cursor-pointer">
                            <span className="text-2xl">🗺️</span>
                            <span className="text-sm">venue_blueprint.dwg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#c0c0c0] px-2 py-1 border-t border-gray-400 text-xs">
                      5 file(s) selected
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Taskbar */}
          <div className="fixed bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] win95-border-raised flex items-center justify-between px-1 z-[201]">
            {/* Start Button */}
            <button className="win95-button px-2 py-1 flex items-center gap-2 hover:win95-button:active">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path fill="#dc2626" d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
              </div>
              <span className="font-bold text-sm spy-accent-red">Start</span>
            </button>

            {/* Active Window Indicator */}
            <div className="flex-1 mx-2 flex items-center gap-1">
              {openWindow === 'terminal' && (
                <div className="win95-border-inset px-3 py-1 flex items-center gap-2 bg-white">
                  <div className="w-4 h-4 bg-black flex items-center justify-center text-green-400 text-xs font-bold">
                    C
                  </div>
                  <span className="text-xs font-semibold">C:\INVENTO\SPYVERSE</span>
                </div>
              )}
              {openWindow === 'topsecret' && (
                <div className="win95-border-inset px-3 py-1 flex items-center gap-2 bg-white">
                  <span className="text-lg">📄</span>
                  <span className="text-xs font-semibold">TOP SECRET.doc</span>
                </div>
              )}
              {openWindow === 'classified' && (
                <div className="win95-border-inset px-3 py-1 flex items-center gap-2 bg-white">
                  <span className="text-lg">📁</span>
                  <span className="text-xs font-semibold">CLASSIFIED_FILES</span>
                </div>
              )}
            </div>

            {/* System Tray */}
            <div className="win95-border-inset px-3 py-1 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs">🔊</span>
                <span className="text-xs spy-accent-yellow">🔒</span>
              </div>
              <span className="text-xs font-mono">{currentTime}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RetroTerminal
