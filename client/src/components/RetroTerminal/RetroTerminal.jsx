import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CMD from './CMD'
import FileManager from './FileManager'
import Mail from './Mail'
import Notes from './Notes'
import Radio from './Radio'
import Browser from './Browser'
import Shutdown from './shutdown'
import shutdownAudio from '../../assets/audios/shutdown.mp3'
import wallpaperImg from '../../assets/UI/OS/wallpaper.png'
import fileManagerIcon from '../../assets/UI/OS/file-manager.png'
import terminalIcon from '../../assets/UI/OS/terminal.png'
import browserIcon from '../../assets/UI/OS/browser.png'
import radioIcon from '../../assets/UI/OS/Radio.png'
import mailIcon from '../../assets/UI/OS/mail.png'

const RetroTerminal = ({ isOpen, onClose }) => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    const [selectedCardId, setSelectedCardId] = useState(null)
    const [openApps, setOpenApps] = useState([]) // Array of objects {id, title, type}
    const [activeApp, setActiveApp] = useState(null)
    const [minimizedApps, setMinimizedApps] = useState([])
    const [selectedDesktopIcon, setSelectedDesktopIcon] = useState(null)
    const [bootStatus, setBootStatus] = useState('starting') // 'starting', 'running', 'shutting'
    const desktopRef = useRef(null)

    // Play startup sound when OS finishes booting
    useEffect(() => {
        if (bootStatus === 'running') {
            const audio = new Audio(shutdownAudio)
            audio.play().catch(e => console.log("Startup sound failed:", e))
        }
    }, [bootStatus])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    const desktopIcons = [
        { id: 'filemanager', name: 'File Explorer', icon: fileManagerIcon, type: 'filemanager', isImg: true },
        { id: 'cmd', name: 'Terminal', icon: terminalIcon, type: 'cmd', isImg: true },
        { id: 'browser', name: 'Internet Explorer', icon: browserIcon, type: 'browser', isImg: true },
        { id: 'mail', name: 'SpyMail', icon: mailIcon, type: 'mail', isImg: true },
        { id: 'radio', name: 'Intercept', icon: radioIcon, type: 'radio', isImg: true },
    ]

    const launchApp = (app) => {
        if (!openApps.find(a => a.id === app.id)) {
            setOpenApps([...openApps, { ...app, icon: app.icon, isImg: app.isImg }])
        }
        setActiveApp(app.id)
        setMinimizedApps(minimizedApps.filter(id => id !== app.id))
    }

    const closeApp = (id) => {
        setOpenApps(openApps.filter(a => a.id !== id))
        setMinimizedApps(minimizedApps.filter(appId => appId !== id))
        if (activeApp === id) {
            setActiveApp(null)
        }
    }

    const toggleMinimize = (id) => {
        if (minimizedApps.includes(id)) {
            setMinimizedApps(minimizedApps.filter(appId => appId !== id))
            setActiveApp(id)
        } else {
            setMinimizedApps([...minimizedApps, id])
            setActiveApp(null)
        }
    }

    const handleDesktopClick = (e) => {
        // Deselect icon if clicked on desktop
        if (e.target === e.currentTarget) {
            setSelectedDesktopIcon(null)
            // If there's an active app, clicking desktop should 'blur' it but not necessarily minimize 
            // the user asked for minimize when clicking outside, so we'll keep that but refine it
            if (activeApp) {
                setMinimizedApps([...minimizedApps, activeApp])
                setActiveApp(null)
            }
        }
    }

    const renderAppContent = (app) => {
        switch (app.type) {
            case 'cmd': return <CMD />
            case 'filemanager': return <FileManager onOpenFile={(fileId) => launchApp({ id: fileId, title: fileId.toUpperCase(), type: 'notes' })} />
            case 'mail': return <Mail />
            case 'notes': return <Notes title={app.title} />
            case 'radio': return <Radio />
            case 'browser': return <Browser />
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
                    backgroundImage: bootStatus === 'running' ? `url(${wallpaperImg})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#000'
                }}
            >
                {bootStatus === 'starting' && (
                    <Shutdown mode="startup" onComplete={() => setBootStatus('running')} />
                )}

                {bootStatus === 'shutting' && (
                    <Shutdown mode="shutdown" onComplete={onClose} />
                )}

                {bootStatus === 'running' && (
                    <>
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDesktopIcon(icon.id);
                                    }}
                                    onDoubleClick={() => {
                                        setSelectedDesktopIcon(null);
                                        launchApp(icon);
                                    }}
                                >
                                    {icon.isImg ? (
                                        <img src={icon.icon} alt={icon.name} className="w-10 h-10 object-contain drop-shadow-md" />
                                    ) : (
                                        <span className="text-4xl drop-shadow-md">{icon.icon}</span>
                                    )}
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
                                        isMinimized={minimizedApps.includes(app.id)}
                                        onClose={() => closeApp(app.id)}
                                        onMinimize={() => toggleMinimize(app.id)}
                                        width={app.type === 'browser' ? '700px' : '500px'}
                                        height={app.type === 'browser' ? '500px' : '400px'}
                                        onFocus={() => {
                                            setSelectedDesktopIcon(null);
                                            setActiveApp(app.id);
                                            setMinimizedApps(minimizedApps.filter(id => id !== app.id));
                                        }}
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
                                    <span className="font-bold text-xs">Start</span>
                                </button>
                                <button
                                    onClick={() => setBootStatus('shutting')}
                                    className="win95-button flex items-center gap-1 px-2 h-[28px] active:win95-border-inset bg-red-100"
                                >
                                    <span className="text-xs font-bold text-red-700">Shut Down</span>
                                </button>

                                <div className="w-[1px] h-6 bg-gray-400 mx-1" />

                                {/* Taskbar Apps */}
                                <div className="flex items-center gap-1">
                                    {openApps.map(app => {
                                        const iconData = desktopIcons.find(i => i.id === app.type) || { icon: null, isImg: false };
                                        return (
                                            <button
                                                key={app.id}
                                                onClick={() => {
                                                    setSelectedDesktopIcon(null);
                                                    toggleMinimize(app.id);
                                                }}
                                                className={`win95-button px-2 h-[28px] max-w-[120px] truncate text-[10px] flex items-center gap-1 ${activeApp === app.id ? 'font-bold win95-border-inset bg-[#e0e0e0]' : ''}`}
                                            >
                                                {iconData.isImg && (
                                                    <img src={iconData.icon} alt="" className="w-4 h-4 object-contain" />
                                                )}
                                                {app.title || app.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="win95-border-inset px-2 h-[28px] flex items-center gap-3 bg-[#c0c0c0]">
                                <span className="text-[10px] spy-accent-yellow">SECURE</span>
                                <span className="text-[10px] font-mono">{currentTime}</span>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}

const Window = ({ app, children, isActive, isMinimized, onClose, onMinimize, onFocus, width = "500px", height = "400px" }) => {
    const [openMenu, setOpenMenu] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isMinimized) return null;

    const menus = {
        File: ["Open", "Save", "Save As...", "Exit"],
        Edit: ["Undo", "Cut", "Copy", "Paste", "Select All"],
        Help: ["View Help", "About System", "Privacy Policy"]
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, zIndex: isActive ? 40 : 10 }}
            exit={{ scale: 0.95, opacity: 0 }}
            drag
            dragMomentum={false}
            onPointerDown={onFocus}
            style={{ width, height }}
            className={`absolute top-20 left-40 bg-[#c0c0c0] win95-border-raised flex flex-col shadow-xl overflow-visible`}
        >
            {/* Title Bar */}
            <div
                className={`px-2 py-1 flex items-center justify-between cursor-move ${isActive ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white' : 'bg-gray-500 text-gray-200'}`}
            >
                <div className="flex items-center gap-2">
                    {app.isImg && (
                        <img src={app.icon} alt="" className="w-4 h-4 object-contain" />
                    )}
                    <span className="text-[11px] font-bold uppercase truncate max-w-[300px]">{app.title || app.name}</span>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                        className="win95-button w-4 h-4 flex items-center justify-center text-[10px] pb-1 hover:bg-gray-300"
                    >
                        _
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="win95-button w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-500 hover:text-white"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Menu bar */}
            <div className="bg-[#c0c0c0] text-[10px] px-1 py-0.5 border-b border-gray-400 flex gap-1 relative z-[100]">
                {Object.keys(menus).map((menuName) => (
                    <div key={menuName} className="relative" ref={menuName === openMenu ? menuRef : null}>
                        <button
                            onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
                            className={`px-2 py-0.5 hover:win95-border-inset outline-none ${openMenu === menuName ? 'win95-border-inset' : ''}`}
                        >
                            <span className="first-letter:underline">{menuName}</span>
                        </button>

                        {openMenu === menuName && (
                            <div className="absolute top-full left-0 w-32 bg-[#c0c0c0] win95-border-raised shadow-lg py-1 z-[110]">
                                {menus[menuName].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            if (item === 'Exit') onClose();
                                            setOpenMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-1 hover:bg-blue-800 hover:text-white outline-none active:bg-blue-900"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-hidden relative win95-border-inset m-1 bg-[#c0c0c0]">
                {children}
            </div>
        </motion.div>
    )
}

export default RetroTerminal
