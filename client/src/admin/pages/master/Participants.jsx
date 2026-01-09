import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { allParticipants } from '../../data/masterData';

const MasterParticipants = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const teams = ['All', ...new Set(allParticipants.map(p => p.team))];
    const statuses = ['All', 'Verified', 'Registered'];

    const filteredParticipants = allParticipants.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTeam = teamFilter === 'All' || p.team === teamFilter;
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchesSearch && matchesTeam && matchesStatus;
    });

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-red-900/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Global Records</p>
                            <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                Master <span className="text-red-700 not-italic">Registry</span>
                            </h1>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="sm:col-span-2">
                            <input 
                                type="text" 
                                placeholder="SEARCH BY NAME OR UID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#111] border border-white/5 p-4 text-xs tracking-widest uppercase focus:outline-none focus:border-red-700/50 text-white"
                            />
                        </div>
                        <select 
                            value={teamFilter}
                            onChange={(e) => setTeamFilter(e.target.value)}
                            className="bg-[#111] border border-white/5 p-4 text-xs tracking-widest uppercase focus:outline-none focus:border-red-700/50 text-white"
                        >
                            {teams.map(team => <option key={team} value={team}>{team} TEAM</option>)}
                        </select>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#111] border border-white/5 p-4 text-xs tracking-widest uppercase focus:outline-none focus:border-red-700/50 text-white"
                        >
                            {statuses.map(status => <option key={status} value={status}>{status} STATUS</option>)}
                        </select>
                    </div>

                    <div className="bg-[#0d0d0d] border border-white/5 overflow-x-auto shadow-2xl">
                        <table className="w-full text-left text-xs min-w-[800px]">
                            <thead className="bg-[#111] text-gray-600 uppercase tracking-widest border-b border-white/5 font-black">
                                <tr>
                                    <th className="p-5">UID</th>
                                    <th className="p-5">Name</th>
                                    <th className="p-5">Assigned Team</th>
                                    <th className="p-5">Event</th>
                                    <th className="p-5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredParticipants.map((p) => (
                                    <tr key={p.id} className="hover:bg-red-900/[0.02] transition-colors group">
                                        <td className="p-5 text-red-900 group-hover:text-red-700 font-bold">{p.id}</td>
                                        <td className="p-5 text-white uppercase tracking-wider">{p.name}</td>
                                        <td className="p-5 uppercase tracking-widest text-[10px] text-gray-500">{p.team}</td>
                                        <td className="p-5 text-gray-400 italic font-serif">{p.event}</td>
                                        <td className="p-5 text-center">
                                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase border ${
                                                p.status === 'Verified' 
                                                ? 'bg-green-900/10 text-green-600 border-green-900/30' 
                                                : 'bg-yellow-900/10 text-yellow-600 border-yellow-900/30'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredParticipants.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-gray-700 uppercase tracking-[0.5em] italic">
                                            No matches found in global database
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterParticipants;
