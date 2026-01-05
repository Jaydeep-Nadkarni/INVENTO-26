import React from 'react'

const FileManager = ({ onOpenFile }) => {
    const files = [
        { id: 'instructions', name: 'instructions.txt', icon: null, type: 'document' },
    ]

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]">
            <div className="bg-white win95-border-inset flex-1 m-1 p-2 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map(file => (
                        <div
                            key={file.id}
                            onClick={() => onOpenFile(file.id)}
                            className="flex flex-col items-center p-2 hover:bg-blue-800 hover:text-white cursor-pointer group"
                        >
                            <div className="w-10 h-12 bg-white win95-border-raised mb-1 flex items-center justify-center text-[8px] text-gray-400 font-bold overflow-hidden select-none">
                                DOC
                            </div>
                            <span className="text-[10px] text-center break-all">{file.name}</span>
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
