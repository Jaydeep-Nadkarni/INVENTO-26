import React from 'react'

const VideoPlayer = ({ title = "Media Player", url = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2ZicG8zNWt2NTV1Zzl2NTVndWV5Zzl2NTVndWV5Zzl2NTVndWV5JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Ju7l5y9osyymQ/giphy.gif" }) => {
    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] font-sans select-none text-black">
            {/* Menu Bar */}
            <div className="flex gap-4 px-2 py-1 text-[11px] border-b border-gray-400">
                <span className="cursor-default hover:bg-blue-800 hover:text-white px-1">File</span>
                <span className="cursor-default hover:bg-blue-800 hover:text-white px-1">Edit</span>
                <span className="cursor-default hover:bg-blue-800 hover:text-white px-1">Help</span>
            </div>

            <div className="flex flex-col flex-1 p-2 gap-2">
                {/* Player Main Area */}
                <div className="bg-[#808080] win95-border-inset p-1 flex-1 flex flex-col min-h-0">
                    <div className="bg-black flex-1 relative flex items-center justify-center overflow-hidden">
                        <img 
                            src={url} 
                            alt="Video Content" 
                            className="w-full h-full object-contain pointer-events-none"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    </div>
                </div>

                {/* Controls Section */}
                <div className="bg-[#c0c0c0] flex flex-col gap-2">
                    {/* Seek Bar */}
                    <div className="w-full h-6 bg-[#808080] win95-border-inset relative">
                        <div className="absolute top-0 left-0 h-full bg-[#000080] w-[15%]"></div>
                        {/* Thumb */}
                        <div className="absolute top-[-2px] left-[15%] h-[24px] w-2 bg-[#c0c0c0] win95-border-raised z-10"></div>
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-1">
                            <button className="win95-button w-8 h-6 flex items-center justify-center">
                                <span className="text-[10px] transform scale-x-75">▶</span>
                            </button>
                            <button className="win95-button w-8 h-6 flex items-center justify-center">
                                <span className="text-[10px]">■</span>
                            </button>
                            <div className="w-[1px] h-4 bg-gray-500 mx-1"></div>
                            <button className="win95-button w-8 h-6 flex items-center justify-center">
                                <span className="text-[10px]">⏮</span>
                            </button>
                            <button className="win95-button w-8 h-6 flex items-center justify-center">
                                <span className="text-[10px]">⏭</span>
                            </button>
                        </div>

                        {/* Display Area */}
                        <div className="win95-border-inset bg-black p-1 min-w-[120px]">
                            <div className="flex flex-col items-end gap-0.5 leading-none">
                                <span className="text-[#00ff00] font-mono text-[10px] tracking-widest">00:00:23 /</span>
                                <span className="text-[#00ff00] font-mono text-[10px] tracking-widest text-right">00:03:32</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
