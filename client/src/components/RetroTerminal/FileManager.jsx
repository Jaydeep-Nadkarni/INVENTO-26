import React, { useState } from 'react'

// Backup SVG icons kept as requested
const SVG_BACKUP = {
    folder: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6H12L14 8H30V26H2V6Z" fill="#E8D19F" stroke="black" strokeWidth="1.5"/>
            <path d="M2 10H30" stroke="black" strokeWidth="1.5"/>
        </svg>
    ),
    text: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="20" height="24" fill="white" stroke="black" strokeWidth="1.5"/>
            <path d="M10 10H22M10 14H22M10 18H18" stroke="black" strokeWidth="1.5"/>
        </svg>
    ),
    image: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="24" height="20" fill="#90CDF4" stroke="black" strokeWidth="1.5"/>
            <circle cx="10" cy="11" r="2" fill="white"/>
            <path d="M4 22L10 16L16 22L22 14L28 26" stroke="black" strokeWidth="1.5"/>
        </svg>
    ),
    video: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="24" height="20" fill="#4A5568" stroke="black" strokeWidth="1.5"/>
            <path d="M14 11L20 16L14 21V11Z" fill="white"/>
            <rect x="6" y="8" width="2" height="2" fill="white"/>
            <rect x="24" y="8" width="2" height="2" fill="white"/>
            <rect x="6" y="22" width="2" height="2" fill="white"/>
            <rect x="24" y="22" width="2" height="2" fill="white"/>
        </svg>
    )
}

const icons = {
    folder: "https://win98icons.alexmeub.com/icons/png/directory_closed-4.png",
    text: "https://win98icons.alexmeub.com/icons/png/notepad_file-0.png",
    image: "https://win98icons.alexmeub.com/icons/png/wia_img_color-0.png",
    video: "https://win98icons.alexmeub.com/icons/png/video_-2.png",
    unknown: "https://win98icons.alexmeub.com/icons/png/file_lines-0.png"
}

const FileManager = ({ onOpenFile }) => {
    const [currentPath, setCurrentPath] = useState(['root'])
    
    // File content definitions
    const fileSystem = {
        root: [
            { 
                id: 'instructions', 
                name: 'instructions.txt', 
                type: 'document',
                size: 1024,
                content: (
                    <>
                        <div className="text-center font-bold mb-4 uppercase tracking-wide">
                        INSTRUCTIONS
                        </div>

                        <p>Welcome to INVENTO 2026.</p>

                        <p>
                        Please read the following instructions carefully to ensure a smooth and enjoyable experience during the fest.
                        </p>

                        <ul className="list-disc list-inside space-y-2 mt-3">
                        <li>
                            All participants must carry a valid pass and present it whenever requested by an Event Official.
                        </li>

                        <li>
                            Passes will be issued <b>24–48 hours prior to the event</b> and will be made available through the official INVENTO platform.
                        </li>

                        <li>
                            Passes will be provided <b>only if</b> you are registered for at least one event and have actively participated or attended the event.
                        </li>

                        <li>
                            Each pass is strictly personal and non-transferable.
                        </li>

                        <li>
                            Participants are expected to follow event guidelines, schedules, and instructions issued by the organizing team.
                        </li>

                        <li>
                            Any misuse of passes or violation of rules may result in revocation of access.
                        </li>
                        </ul>
                    </>
                )
            },
            { 
                id: 'mission_leak', 
                name: 'mission_leak.avi', 
                type: 'video',
                size: 15728640,
                url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2ZicG8zNWt2NTV1Zzl2NTVndWV5Zzl2NTVndWV5Zzl2NTVndWV5JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Ju7l5y9osyymQ/giphy.gif'
            },
            {
                id: 'invento_files',
                name: 'Invento Files',
                type: 'folder',
                target: 'invento_files',
                size: 0
            }
        ],
        invento_files: [
             {
                id: 'redacted1',
                name: 'subject_01.txt',
                type: 'document',
                size: 2048,
                content: (
                    <div className="font-mono text-sm leading-relaxed p-2 h-full overflow-y-auto max-h-[400px]">
                        <p className="mb-2 font-bold border-b border-black pb-1 uppercase">CLASSIFIED DOSSIER: SUBJECT_01</p>
                        <p className="mb-2 italic text-gray-600">Generated: {new Date().toLocaleDateString()} // Time: {new Date().toLocaleTimeString()}</p>
                        
                        <p className="mb-2">SUBJECT ID: <span className="bg-black text-black select-none">ID_REDACTED_BY_CMD</span></p>
                        <p className="mb-2">CLASS: <span className="bg-black text-black select-none">EUCLID_ANOMALY</span></p>
                        <p className="mb-2">THREAT: <span className="bg-black text-black select-none">LEVEL_3_CAUTION</span></p>
                        
                        <br />
                        <div className="space-y-1">
                            {Array.from({ length: 220 }).map((_, i) => {
                                const phrases = [
                                    "Movement detected in quadrant",
                                    "Signal spike detected at",
                                    "Unauthorized access attempt from",
                                    "Shadow node established in",
                                    "Subject profile mismatch at",
                                    "Temporal echo recorded in",
                                    "Incompressible data packet at",
                                    "Visual confirmation failed in",
                                    "Metadata scrubbed from",
                                    "Encryption layer 7 breached at",
                                    "Heartbeat signal observed from",
                                    "Anomalous heat signature at",
                                    "Whisper protocol active in",
                                    "Deep stack overflow detected at",
                                    "Subject zero located near",
                                    "Void oscillation measured at",
                                    "Sub-space transmission from",
                                    "Logic loop trapped in sector",
                                    "Ghost process running in",
                                    "Neural link established at"
                                ];
                                const sectors = ["7G", "Alpha-9", "Theta_0", "Deep_Red", "Blue_Sky", "Vault_X", "Core_01", "Edge_Cases", "Null_Zone", "Sector_00"];
                                const phrase = phrases[i % phrases.length];
                                const sector = sectors[Math.floor(Math.random() * sectors.length)];
                                
                                return (
                                    <p key={i} className="text-[10px]">
                                        <span className="text-gray-500 mr-2">[{1000 + i}]</span>
                                        {phrase} <span className="bg-black text-black select-none font-bold"> {sector} </span> 
                                        {i % 5 === 0 && <span className="text-red-900 ml-2 font-bold tracking-tighter">!! WARNING !!</span>}
                                        {i % 8 === 0 && <span className="bg-black text-black select-none px-2 ml-1"> REDACTED_LOG_ENTRY </span>}
                                    </p>
                                );
                            })}
                        </div>
                        
                        <br />
                        <p className="mb-2 border-t border-black pt-2 font-bold">--- END OF LOGS ---</p>
                        <p className="mb-2">AUTHORIZATION REQUIRED TO APPEND FURTHER DATA.</p>
                    </div>
                )
            },
            {
                id: 'redacted2',
                name: 'codes.txt',
                type: 'document',
                size: 512,
                content: (
                    <div className="font-mono">
                        <p className="mb-2 underline">ACCESS CODES:</p>
                        <p>Main Door: <span className="bg-black text-black select-none">8472</span></p>
                        <p>Vault: <span className="bg-black text-black select-none">9999</span> (EXPIRED)</p>
                        <p>Server Room: <span className="bg-black text-black select-none">PASSWORD123</span></p>
                        <p>Override: <span className="bg-black text-black select-none">DELTA-OMICRON</span></p>
                    </div>
                )
            },
            {
                id: 'meme1',
                name: 'evidence_A.jpg',
                type: 'image',
                size: 45000,
                url: 'https://i.imgflip.com/26am.jpg'
            },
             {
                id: 'meme2',
                name: 'intercept.jpg',
                type: 'image',
                size: 32000,
                url: 'https://i.imgflip.com/1ur9b0.jpg'
            }
        ]
    }

    const currentFolderId = currentPath[currentPath.length - 1]
    const currentFiles = fileSystem[currentFolderId] || []

    const handleFileClick = (file) => {
        if (file.type === 'folder') {
            setCurrentPath([...currentPath, file.target])
        } else {
            onOpenFile(file)
        }
    }

    const goBack = () => {
        if (currentPath.length > 1) {
            setCurrentPath(currentPath.slice(0, -1))
        }
    }

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 bytes'
        const k = 1024
        const sizes = ['bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const totalSize = currentFiles.reduce((acc, file) => acc + file.size, 0)

    const getIcon = (file) => {
        let typeKey = 'text';
        
        if (file.type === 'folder') {
            typeKey = 'folder';
        } else if (file.type === 'video' || file.name.endsWith('.avi') || file.name.endsWith('.mp4')) {
            typeKey = 'video';
        } else if (file.type === 'image' || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png') || file.name.endsWith('.gif')) {
            typeKey = 'image';
        } else if (file.type === 'document' || file.name.endsWith('.txt')) {
            typeKey = 'text';
        }

        const iconUrl = icons[typeKey] || icons.unknown;
        
        // Use a relative container to allow SVG fallback if image fails
        return (
            <div className="w-8 h-8 flex items-center justify-center relative">
                <img 
                    src={iconUrl} 
                    alt="" 
                    className="w-8 h-8 object-contain z-10" 
                    style={{ imageRendering: 'pixelated' }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = 'block';
                    }}
                />
                <div style={{ display: 'none' }} className="w-8 h-8">
                    {SVG_BACKUP[typeKey] || SVG_BACKUP.text}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]">
            <div className="bg-white win95-border-inset flex-1 m-1 p-2 overflow-y-auto">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 content-start">
                    {currentPath.length > 1 && (
                         <div
                            onClick={goBack}
                            className="flex flex-col items-center p-1 hover:bg-blue-800 hover:text-white cursor-pointer group w-16"
                        >
                            {getIcon({ type: 'folder' })}
                            <span className="text-[10px] text-center break-all leading-tight">..</span>
                        </div>
                    )}
                    {currentFiles.map(file => (
                        <div
                            key={file.id}
                            onClick={() => handleFileClick(file)}
                            className="flex flex-col items-center p-1 hover:bg-blue-800 hover:text-white cursor-pointer group w-16"
                        >
                            {getIcon(file)}
                            <span className="text-[10px] text-center break-all leading-tight">{file.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-2 py-1 text-[10px] flex justify-between border-t border-gray-400 select-none">
                <span>{currentFiles.length} object(s)</span>
                <span>{formatSize(totalSize)}</span>
            </div>
        </div>
    )
}

export default FileManager
