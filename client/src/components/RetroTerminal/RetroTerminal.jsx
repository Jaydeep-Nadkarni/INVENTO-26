import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CMD from './CMD'
import FileManager from './FileManager'
import Mail from './Mail'
import Notes from './Notes'
import Radio from './Radio'
import wallpaperImg from '../../assets/UI/wallpaper.png'

const RetroTerminal = ({ isOpen, onClose }) => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    const [openApps, setOpenApps] = useState([]) // Array of objects {id, title, type}
    const [activeApp, setActiveApp] = useState(null)
    const [selectedDesktopIcon, setSelectedDesktopIcon] = useState(null)
    const desktopRef = useRef(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    const desktopIcons = [
        { id: 'filemanager', name: 'File Explorer', icon: '📁', type: 'filemanager' },
        { id: 'cmd', name: 'Terminal.exe', icon: '💻', type: 'cmd' },
        { id: 'mail', name: 'SpyMail', icon: '📧', type: 'mail' },
        { id: 'radio', name: 'Intercept', icon: '📻', type: 'radio' },
    ]

    const launchApp = (app) => {
        if (!openApps.find(a => a.id === app.id)) {
            setOpenApps([...openApps, app])
        }
        setActiveApp(app.id)
    }

    const closeApp = (id) => {
        setOpenApps(openApps.filter(a => a.id !== id))
        if (activeApp === id) {
            setActiveApp(openApps.length > 1 ? openApps[openApps.length - 2].id : null)
        }
    }

    const handleDesktopClick = (e) => {
        if (e.target === e.currentTarget) {
            setSelectedDesktopIcon(null)
        }
    }

    const renderAppContent = (app) => {
        switch (app.type) {
            case 'cmd': return <CMD />
            case 'filemanager': return <FileManager onOpenFile={(fileId) => launchApp({ id: fileId, title: fileId.toUpperCase(), type: 'notes' })} />
            case 'mail': return <Mail />
            case 'notes': return <Notes title={app.title} />
            case 'radio': return <Radio />
            default: return null
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-[800px] h-[600px] bg-[#008080] win95-border-raised overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundImage: `url(${wallpaperImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Desktop Body */}
                <div
                    ref={desktopRef}
                    className="flex-1 relative p-4 grid grid-cols-1 auto-rows-max gap-4 w-min content-start h-full"
                    onClick={handleDesktopClick}
                >
                    {desktopIcons.map(icon => (
                        <div
                            key={icon.id}
                            className={`flex flex-col items-center w-20 p-2 cursor-pointer ${selectedDesktopIcon === icon.id ? 'bg-blue-800/30 border border-dotted border-white' : ''}`}
                            onClick={() => setSelectedDesktopIcon(icon.id)}
                            onDoubleClick={() => launchApp(icon)}
                        >
                            <span className="text-4xl drop-shadow-md">{icon.icon}</span>
                            <span className="text-white text-[10px] text-center mt-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] font-sans">
                                {icon.name}
                            </span>
                        </div>
                    ))}

                    {/* Render Open Windows */}
                    <AnimatePresence>
                        {openApps.map((app) => (
                            <Window
                                key={app.id}
                                app={app}
                                isActive={activeApp === app.id}
                                onClose={() => closeApp(app.id)}
                                onFocus={() => setActiveApp(app.id)}
                            >
                                {renderAppContent(app)}
                            </Window>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Win95 Taskbar */}
                <div className="h-10 bg-[#c0c0c0] win95-border-raised flex items-center justify-between px-1 z-50">
                    <div className="flex items-center gap-1 h-full">
                        <button className="win95-button flex items-center gap-1 px-2 h-[28px] active:win95-border-inset">
                            <span className="text-lg">🕵️</span>
                            <span className="font-bold text-xs">Start</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="win95-button flex items-center gap-1 px-2 h-[28px] active:win95-border-inset bg-red-100"
                        >
                            <span className="text-xs font-bold text-red-700">Shut Down</span>
                        </button>

                        <div className="w-[1px] h-6 bg-gray-400 mx-1" />

                        {/* Taskbar Apps */}
                        <div className="flex items-center gap-1">
                            {openApps.map(app => (
                                <button
                                    key={app.id}
                                    onClick={() => setActiveApp(app.id)}
                                    className={`win95-button px-2 h-[28px] max-w-[120px] truncate text-[10px] flex items-center gap-1 ${activeApp === app.id ? 'font-bold win95-border-inset bg-[#e0e0e0]' : ''}`}
                                >
                                    {app.id === 'cmd' ? '💻' : app.id === 'mail' ? '📧' : app.id === 'filemanager' ? '📁' : app.id === 'radio' ? '📻' : '📄'}
                                    {app.title || app.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="win95-border-inset px-2 h-[28px] flex items-center gap-3 bg-[#c0c0c0]">
                        <span className="text-[10px] spy-accent-yellow">🔒</span>
                        <span className="text-[10px] font-mono">{currentTime}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const Window = ({ app, children, isActive, onClose, onFocus }) => {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, zIndex: isActive ? 40 : 10 }}
            exit={{ scale: 0.95, opacity: 0 }}
            drag
            dragMomentum={false}
            onPointerDown={onFocus}
            className={`absolute top-20 left-40 w-[500px] h-[400px] bg-[#c0c0c0] win95-border-raised flex flex-col shadow-xl overflow-hidden`}
        >
            {/* Title Bar */}
            <div
                className={`px-2 py-1 flex items-center justify-between cursor-move ${isActive ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white' : 'bg-gray-500 text-gray-200'}`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs">{app.id === 'cmd' ? '💻' : app.id === 'mail' ? '📧' : app.id === 'radio' ? '📻' : '📄'}</span>
                    <span className="text-[11px] font-bold uppercase truncate max-w-[300px]">{app.title || app.name}</span>
                </div>
                <div className="flex gap-1">
                    <button className="win95-button w-4 h-4 flex items-center justify-center text-[10px] pb-1">_</button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="win95-button w-4 h-4 flex items-center justify-center text-[10px]">×</button>
                </div>
            </div>

            {/* Menu bar placeholder */}
            <div className="bg-[#c0c0c0] text-[10px] px-1 py-0.5 border-b border-gray-400 flex gap-2">
                <span className="px-1 hover:bg-blue-800 hover:text-white cursor-default">File</span>
                <span className="px-1 hover:bg-blue-800 hover:text-white cursor-default">Edit</span>
                <span className="px-1 hover:bg-blue-800 hover:text-white cursor-default">Help</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {children}
            </div>
        </motion.div>
    )
}

export default RetroTerminal
