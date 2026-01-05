import React, { useState, useEffect, useRef } from 'react'

const CMD = () => {
    const [history, setHistory] = useState([
        "KLE Technological University(R) INVENTO 2026",
        "(C)Copyright KLE Technological University 2026.",
        "",
        "C:\\> DECRYPTING SPYVERSE 2026...",
        "ENTER THE COMMAND (ENTER HELP FOR MORE INFO)",
        ""
    ])
    const [input, setInput] = useState('')
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [history])

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase()
            const newHistory = [...history, `C:\\> ${input}`]

            if (cmd === 'help') {
                newHistory.push(
                    "Available commands:",
                    " HELP     - Display this help message",
                    " CLS      - Clear the screen",
                    " DIR      - List directory files",
                    " DECRYPT  - Attempt to decrypt mission files",
                    " EXIT     - Close terminal",
                    " SYSTEM   - Show system information",
                    ""
                )
            } else if (cmd === 'cls') {
                setHistory([])
                setInput('')
                return
            } else if (cmd === 'dir') {
                newHistory.push(
                    " Volume in drive C has no label",
                    " Volume Serial Number is 1234-5678",
                    "",
                    " Directory of C:\\",
                    "",
                    "INSTRUCTIONS TXT            42  01-05-26  4:20p",
                    "LOGS         DIR                01-05-26  4:20p",
                    "SCRIPTS      DIR                01-05-26  4:20p",
                    "      1 File(s)             42 bytes",
                    "      2 Dir(s)   1,234,567,890 bytes free",
                    ""
                )
            } else if (cmd === 'decrypt') {
                newHistory.push(
                    "Searching for decryption keys...",
                    "Checking local hashes...",
                    "ACCESS GRANTED: INVENTO 2026 SPYVERSE ACTIVE.",
                    "Mission parameters updated in File Explorer.",
                    ""
                )
            } else if (cmd === 'system') {
                newHistory.push(
                    "OS: Windows 95 OSR2",
                    "CPU: Pentium 133MHz",
                    "RAM: 16MB EDO RAM",
                    "Network: Active (Secure Line)",
                    ""
                )
            } else if (cmd !== '') {
                newHistory.push(`Bad command or file name`, "")
            }

            setHistory(newHistory)
            setInput('')
        }
    }

    return (
        <div className="win95-border-inset m-1 h-full bg-black">
            <div
                ref={scrollRef}
                className="relative p-4 h-full overflow-y-auto terminal-screen font-mono text-xs md:text-sm text-green-400"
                onClick={() => document.getElementById('cmd-input').focus()}
            >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent bg-[length:100%_4px] animate-scanline z-20"></div>

                <div className="relative z-10 whitespace-pre-wrap break-words mb-4">
                    {history.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                    <div className="flex">
                        <span>C:\&gt;&nbsp;</span>
                        <input
                            id="cmd-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                            className="bg-transparent border-none outline-none text-green-400 flex-1 p-0 m-0 font-mono"
                            autoFocus
                            spellCheck="false"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CMD
