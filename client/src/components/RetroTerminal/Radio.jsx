import React, { useState, useEffect } from 'react'

const Radio = () => {
    const [frequencies, setFrequencies] = useState([])
    const [isScanning, setIsScanning] = useState(false)
    const [currentFreq, setCurrentFreq] = useState(148.5)

    const logs = [
        "INTERCEPT: 148.5 - 'Moving the bundle to the basement.'",
        "INTERCEPT: 152.2 - 'Static noise... [REDACTED]...'",
        "INTERCEPT: 144.1 - 'Alpha team in position.'",
    ]

    const toggleScan = () => {
        setIsScanning(!isScanning)
        if (!isScanning) {
            setTimeout(() => {
                setFrequencies(prev => [...logs.slice(0, prev.length + 1)])
                setIsScanning(false)
            }, 2000)
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] p-4 text-xs font-mono">
            <div className="bg-black text-green-500 p-4 win95-border-inset mb-4 h-20 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-2xl tracking-[0.2em]">{currentFreq} MHz</div>
                <div className="text-[8px] opacity-70">SIGNAL STRENGTH: |||||||||| 92%</div>
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-green-900 opacity-30 animate-scanline"></div>
            </div>

            <div className="flex-1 bg-white win95-border-inset p-2 overflow-y-auto mb-4">
                {frequencies.length === 0 ? (
                    <div className="text-gray-400 italic text-center mt-10">No signals intercepted. Press SCAN.</div>
                ) : (
                    frequencies.map((log, i) => (
                        <div key={i} className="mb-2 text-blue-900 border-b border-gray-100 pb-1">
                            <span className="text-red-600 font-bold mr-2">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            {log}
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={toggleScan}
                disabled={isScanning}
                className={`win95-button py-2 font-bold ${isScanning ? 'opacity-50' : 'hover:bg-gray-300'}`}
            >
                {isScanning ? 'SCANNING...' : 'SCAN FREQUENCIES'}
            </button>
        </div>
    )
}

export default Radio
