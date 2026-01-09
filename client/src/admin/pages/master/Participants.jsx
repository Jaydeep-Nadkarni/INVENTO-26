import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Search, Filter, Download, ExternalLink, ChevronDown } from 'lucide-react';

const MasterParticipants = () => {
    const { participants } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const teams = ['All', ...new Set(participants.map(p => p.team))];
    const statuses = ['All', 'Verified', 'Registered'];

    const filteredParticipants = participants.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.id.toString().includes(searchTerm);
        const matchesTeam = teamFilter === 'All' || p.team === teamFilter;
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchesSearch && matchesTeam && matchesStatus;
    });

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Global Registry</h1>
                            <p className="text-sm text-gray-500">Cross-team participant database and registration tracking</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm font-semibold rounded hover:bg-gray-50 text-gray-700 transition-colors">
                                <Download className="w-4 h-4" />
                                Download Full Report
                            </button>
                        </div>
                    </header>

                    {/* Filters Strip */}
                    <div className="mb-8 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name or ID..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="relative">
                                <select 
                                    value={teamFilter}
                                    onChange={(e) => setTeamFilter(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 px-4 py-2.5 pr-10 text-xs font-bold uppercase tracking-widest rounded focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
                                >
                                    {teams.map(team => <option key={team} value={team}>{team === 'All' ? 'ALL TEAMS' : team}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 px-4 py-2.5 pr-10 text-xs font-bold uppercase tracking-widest rounded focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
                                >
                                    {statuses.map(status => <option key={status} value={status}>{status === 'All' ? 'ALL STATUS' : status}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">UID</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Name</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Assigned Team</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Event</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredParticipants.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-300 group-hover:text-gray-900 transition-colors">#{p.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase tracking-tight">
                                                {p.team}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 italic">{p.event}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                p.status === 'Verified' 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredParticipants.length === 0 && (
                            <div className="p-16 text-center">
                                <Search className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                <p className="text-sm text-gray-400 font-medium">No results found in global database</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterParticipants;

export default MasterParticipants;
