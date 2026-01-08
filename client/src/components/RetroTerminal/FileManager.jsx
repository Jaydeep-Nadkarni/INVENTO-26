import React from 'react'

const FileManager = ({ onOpenFile }) => {
    const files = [
        { 
            id: 'instructions', 
            name: 'instructions.txt', 
            icon: null, 
            type: 'document' 
        },
        { 
            id: 'mission_leak', 
            name: 'mission_leak.avi', 
            icon: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2ZicG8zNWt2NTV1Zzl2NTVndWV5Zzl2NTVndWV5Zzl2NTVndWV5JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Ju7l5y9osyymQ/giphy.gif', 
            type: 'video' 
        },
    ]

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]">
            <div className="bg-white win95-border-inset flex-1 m-1 p-2 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map(file => (
                        <div
                            key={file.id}
                            onClick={() => onOpenFile(file)}
                            className="flex flex-col items-center p-2 hover:bg-blue-800 hover:text-white cursor-pointer group max-w-[80px]"
                        >
                            {file.icon ? (
                                <div className="w-10 h-10 mb-1 win95-border-raised bg-black overflow-hidden flex items-center justify-center">
                                    <img src={file.icon} alt={file.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 bg-white win95-border-raised mb-1 flex items-center justify-center text-[8px] text-gray-400 font-bold overflow-hidden select-none">
                                    {file.type === 'video' ? 'VID' : 'DOC'}
                                </div>
                            )}
                            <span className="text-[10px] text-center break-all leading-tight">{file.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-2 py-1 text-[10px] flex justify-between border-t border-gray-400">
                <span>{files.length} object(s)</span>
                <span>0 bytes</span>
            </div>
        </div>
    )
}

export default FileManager
