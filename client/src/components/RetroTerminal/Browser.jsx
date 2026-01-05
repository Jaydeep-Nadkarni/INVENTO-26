import React, { useState } from 'react'
import back from '../../assets/UI/OS/back.png'
import forward from '../../assets/UI/OS/forward.png'
import stop from '../../assets/UI/OS/Cancel.png'
import home from '../../assets/UI/OS/home.png'
import search from '../../assets/UI/OS/search.png'
import ieLogo from '../../assets/UI/OS/ie_logo.png'

const Browser = () => {
    const [viewMode, setViewMode] = useState('home') // 'home' or 'iframe'
    const [url, setUrl] = useState('agency://internal.portal')
    const [inputUrl, setInputUrl] = useState('agency://internal.portal')
    const [history, setHistory] = useState(['agency://internal.portal'])
    const [historyIndex, setHistoryIndex] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const navigateTo = (targetUrl, isSearch = false) => {
        let finalUrl = targetUrl

        if (isSearch) {
            finalUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}&igu=1`
        }

        // Handle internal links
        if (finalUrl === 'agency://internal.portal' || finalUrl.toLowerCase() === 'home') {
            setViewMode('home')
            finalUrl = 'agency://internal.portal'
        } else {
            if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                finalUrl = 'https://' + finalUrl
            }
            setViewMode('iframe')
        }

        setUrl(finalUrl)
        setInputUrl(finalUrl)

        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(finalUrl)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigateTo(inputUrl)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            navigateTo(searchTerm, true)
        }
    }

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            const prevUrl = history[newIndex]
            setUrl(prevUrl)
            setInputUrl(prevUrl)
            setViewMode(prevUrl === 'agency://internal.portal' ? 'home' : 'iframe')
        }
    }

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            const nextUrl = history[newIndex]
            setUrl(nextUrl)
            setInputUrl(nextUrl)
            setViewMode(nextUrl === 'agency://internal.portal' ? 'home' : 'iframe')
        }
    }

    const ToolbarButton = ({ icon, label, onClick, disabled = false }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="win95-button flex flex-col items-center px-2 py-1 disabled:opacity-50 min-w-[50px] active:win95-border-inset group hover:bg-[#d0d0d0/50]"
        >
            <div className="w-8 h-8 flex items-center justify-center pointer-events-none mb-0.5">
                <img
                    src={icon}
                    alt={label}
                    className={`w-6 h-6 object-contain image-pixelated ${disabled ? 'grayscale brightness-125' : ''}`}
                />
            </div>
            <span className="text-[10px] font-sans leading-none">{label}</span>
        </button>
    )

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans">
            {/* IE6 Style Toolbar */}
            <div className="flex flex-col border-b border-gray-400 p-0.5 gap-0.5 shadow-[inset_1px_1px_0_white]">
                <div className="flex items-center gap-0.5 px-0.5">
                    <ToolbarButton icon={back} label="Back" onClick={goBack} disabled={historyIndex === 0} />
                    <ToolbarButton icon={forward} label="Forward" onClick={goForward} disabled={historyIndex === history.length - 1} />
                    <ToolbarButton icon={stop} label="Cancel" onClick={() => { }} />
                    <ToolbarButton icon={home} label="Home" onClick={() => navigateTo('agency://internal.portal')} />
                    <div className="w-[1px] h-10 bg-gray-500 mx-1 shadow-[1px_0_0_white]" />
                    <ToolbarButton icon={search} label="Search" onClick={() => { }} />

                    <div className="flex-1 h-full flex justify-end items-center mr-1">
                        {/* IE Logo */}
                        <div className="w-[40px] h-[40px] bg-white win95-border-inset flex items-center justify-center p-0.5">
                            <img src={ieLogo} alt="IE" className="w-full h-full object-contain image-pixelated animate-pulse" style={{ animationDuration: '3s' }} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1 border-t border-gray-300">
                    <span className="text-[10px] ml-1 font-bold">Address</span>
                    <div className="flex-1 bg-white win95-border-inset flex items-center px-2 h-6 text-[11px] shadow-inner">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent outline-none h-full"
                        />
                    </div>
                    <button onClick={() => navigateTo(inputUrl)} className="win95-button px-3 h-5.5 text-[10px] font-bold flex items-center">Go</button>
                    <button className="win95-button px-2 h-5.5 text-[10px] flex items-center font-bold">Links »</button>
                </div>
            </div>

            {/* Browser Content */}
            <div className="flex-1 bg-white overflow-auto relative">
                {viewMode === 'home' ? (
                    <div className="p-8 font-serif max-w-2xl mx-auto">
                        <div className="border-b-4 border-blue-900 pb-4 mb-8">
                            <h1 className="text-4xl font-black italic text-blue-900 tracking-tighter">THE AGENCY PORTAL</h1>
                            <p className="text-sm font-mono text-gray-500 uppercase">Secure Gateway // v4.0.26</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold border-b border-gray-300 pb-1">DATABASE ARCHIVES</h2>
                                <ul className="space-y-2 text-sm text-blue-800 underline">
                                    <li><button onClick={() => navigateTo('https://swisscows.com')} className="hover:text-red-600 appearance-none bg-transparent border-none p-0 underline cursor-pointer">Swisscows (Privacy Search)</button></li>
                                    <li><button onClick={() => navigateTo('https://en.wikipedia.org/wiki/Special:Random')} className="hover:text-red-600 appearance-none bg-transparent border-none p-0 underline cursor-pointer">Archive Library (Random Wiki)</button></li>
                                    <li><a href="#" className="hover:text-red-600">Personnel Decryption</a></li>
                                </ul>
                            </div>
                            <div className="bg-gray-100 p-4 border border-gray-300 shadow-sm">
                                <h2 className="text-xs font-bold text-red-600 mb-2 uppercase tracking-widest">Signal Status</h2>
                                <p className="text-[11px] leading-relaxed text-gray-700 font-sans">
                                    <span className="text-green-600 font-bold tracking-widest">● ENCRYPTED</span><br />
                                    Most public signal nodes (Google/YouTube) attempt to block interception. Use the **Intel Search** below for a secure bypass.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 font-sans">INTEL SEARCH (SECURE INTERCEPT)</h2>
                            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Enter search query..."
                                    className="flex-1 border border-gray-400 p-2 text-sm shadow-inner outline-none"
                                />
                                <button type="submit" className="bg-gray-200 border border-gray-400 px-4 py-2 text-sm font-bold active:bg-gray-300 shadow-sm">INITIATE SEARCH</button>
                            </form>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-[10px] text-gray-400 font-sans">
                            © 1996 - 2026 THE AGENCY. ALL RIGHTS RESERVED. SECURED BY INVENTO-SHIELD.
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <iframe
                            src={url}
                            className="w-full h-full border-none"
                            title="Retro Browser Content"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        />
                        <div className="absolute top-0 left-0 right-0 bg-yellow-100/80 p-1 text-[9px] text-yellow-800 text-center border-b border-yellow-200 pointer-events-none">
                            SECURE VIEWING MODE ACTIVE // SIGNAL INTERCEPTED VIA NODE-IGU
                        </div>
                    </div>
                )}
            </div>

            <div className="h-5 bg-[#c0c0c0] border-t border-gray-400 flex justify-between items-center px-2 text-[9px]">
                <div className="flex items-center gap-2">
                    <span>Done</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-[1px] h-3 bg-gray-400" />
                    <span className="font-bold uppercase tracking-widest font-mono">Signal: 100% Intercepted</span>
                </div>
            </div>
        </div>
    )
}

export default Browser
