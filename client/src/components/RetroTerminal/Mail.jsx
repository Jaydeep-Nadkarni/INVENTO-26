import React, { useState } from 'react'

const Mail = () => {
    const [selectedMail, setSelectedMail] = useState(null)

    const messages = [
        { id: 1, from: 'Director', subject: 'Mission Update', date: '05 Jan', body: 'The infiltration of Sectors 4 and 7 is proceeding as planned. Report anyBelagavi connection anomalies immediately.' },
        { id: 2, from: 'Agent X', subject: 'Re: Equipment', date: '04 Jan', body: 'The new briefcase encryption is solid. I tested it on the Hubballi sector yesterday.' },
        { id: 3, from: 'Intelligence', subject: 'ALERT: Intercept', date: '03 Jan', body: 'We have detected an unknown frequency at 148.5 Mhz. Caution is advised when using open channels.' },
    ]

    return (
        <div className="flex h-full bg-[#c0c0c0]">
            {/* Inbox List */}
            <div className="w-1/3 border-r border-gray-400 bg-white win95-border-inset m-1 overflow-y-auto">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        onClick={() => setSelectedMail(msg)}
                        className={`p-2 border-b border-gray-200 cursor-pointer hover:bg-blue-100 ${selectedMail?.id === msg.id ? 'bg-blue-800 text-white' : ''}`}
                    >
                        <div className="text-[10px] font-bold truncate">{msg.from}</div>
                        <div className="text-[9px] truncate">{msg.subject}</div>
                    </div>
                ))}
            </div>

            {/* Message View */}
            <div className="flex-1 bg-white win95-border-inset m-1 p-3 overflow-y-auto">
                {selectedMail ? (
                    <div className="text-[11px] font-sans">
                        <div className="border-b border-gray-200 pb-2 mb-2">
                            <div className="font-bold">From: <span className="font-normal">{selectedMail.from}</span></div>
                            <div className="font-bold">Subject: <span className="font-normal">{selectedMail.subject}</span></div>
                            <div className="font-bold">Date: <span className="font-normal">{selectedMail.date}</span></div>
                        </div>
                        <div className="leading-relaxed">
                            {selectedMail.body}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-[10px] flex-col gap-2">
                        <div className="text-3xl font-bold opacity-20">MAIL</div>
                        Select a message to read
                    </div>
                )}
            </div>
        </div>
    )
}

export default Mail
