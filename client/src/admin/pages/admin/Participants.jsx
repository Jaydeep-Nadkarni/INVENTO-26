import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { participantsData } from '../../data/adminData';

const AdminParticipants = () => {
    const [participants, setParticipants] = useState(participantsData);

    const markPresent = (id) => {
        setParticipants(prev => prev.map(p => 
            p.id === id ? { ...p, attendance: 'Present' } : p
        ));
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Registry</p>
                            <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                Team <span className="text-red-700 not-italic">Participants</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-600 uppercase">Total Loaded: {participants.length}</p>
                        </div>
                    </header>
                    
                    <div className="bg-[#0d0d0d] border border-white/5 shadow-2xl overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[600px]">
                            <thead className="bg-[#111] text-gray-600 uppercase tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="p-5 font-bold">ID</th>
                                    <th className="p-5 font-bold">Name</th>
                                    <th className="p-5 font-bold">Event</th>
                                    <th className="p-5 font-bold">Status</th>
                                    <th className="p-5 font-bold">Attendance</th>
                                    <th className="p-5 font-bold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {participants.map((participant) => (
                                    <tr key={participant.id} className="hover:bg-white/5 transition-colors cursor-crosshair group">
                                        <td className="p-5 text-gray-500 font-bold">{participant.id}</td>
                                        <td className="p-5 text-white uppercase tracking-wider">{participant.name}</td>
                                        <td className="p-5 text-gray-400 italic">{participant.event}</td>
                                        <td className="p-5">
                                            <span className={`px-2 py-0.5 border text-[8px] font-black uppercase ${
                                                participant.status === 'Verified' 
                                                ? 'bg-green-900/10 text-green-700 border-green-900/30' 
                                                : 'bg-yellow-900/10 text-yellow-700 border-yellow-900/30'
                                            }`}>
                                                {participant.status}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[9px] uppercase font-bold ${
                                                participant.attendance === 'Present' ? 'text-green-500' : 'text-red-900/50'
                                            }`}>
                                                {participant.attendance}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            {participant.attendance !== 'Present' ? (
                                                <button 
                                                    onClick={() => markPresent(participant.id)}
                                                    className="px-3 py-1 border border-red-700/30 text-[9px] text-red-700 uppercase tracking-tighter hover:bg-red-700 hover:text-white transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                                                >
                                                    Mark Present
                                                </button>
                                            ) : (
                                                <span className="text-green-900/30 text-[9px] uppercase tracking-widest">Logged</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminParticipants;
