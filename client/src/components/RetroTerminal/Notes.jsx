import React from 'react'

const Notes = ({ title = "Notepad", content }) => {
    const defaultContent = (
        <>
            <div className="text-red-600 font-bold text-center mb-4 text-lg">⚠️ TOP SECRET ⚠️</div>
            <div className="mb-4">CLASSIFICATION: EYES ONLY</div>
            <div className="mb-4">SUBJECT: INVENTO 2026 - SPYVERSE OPERATION</div>
            <div className="border-t border-b border-black py-2 my-4">
                <p>This document contains highly classified information regarding the INVENTO 2026 event.</p>
                <p className="mt-2 text-blue-800 font-bold">Mission Parameters:</p>
                <ul className="ml-4 mt-2 list-disc">
                    <li>Date: March 15-17, 2026</li>
                    <li>Location: KLE Technical University</li>
                    <li>Clearance Level: 5 Required</li>
                    <li>Expected Agents: 5000+</li>
                </ul>
            </div>
            <div className="text-red-600 font-bold mt-4 animate-pulse">UNAUTHORIZED ACCESS PROHIBITED</div>
        </>
    )

    return (
        <div className="bg-white win95-border-inset m-1 p-6 h-full overflow-y-auto font-mono text-xs md:text-sm">
            {content || defaultContent}
        </div>
    )
}

export default Notes
