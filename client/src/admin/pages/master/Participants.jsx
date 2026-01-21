import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Search, Filter, Download, ExternalLink, ChevronDown } from 'lucide-react';

const MasterParticipants = () => {
    const { data: { participants, teams, events }, updateParticipant } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('All');
    const [eventFilter, setEventFilter] = useState('All');

    const filteredParticipants = useMemo(() => {
        return participants.filter(p => {
            const matchesSearch = 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.id?.toLowerCase().includes(searchTerm.toLowerCase());
                
            const matchesTeam = teamFilter === 'All' || p.team === teamFilter;
            const matchesEvent = eventFilter === 'All' || p.event === eventFilter;
            
            return matchesSearch && matchesTeam && matchesEvent;
        });
    }, [participants, searchTerm, teamFilter, eventFilter]);

    const toggleVerification = (id, current) => {
        updateParticipant(id, { verified: !current });
    };

    const togglePresence = (id, current) => {
        updateParticipant(id, { present: !current });
    };

    const togglePayment = (id, current) => {
        updateParticipant(id, { payment_status: current === 'paid' ? 'pending' : 'paid' });
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Global Registry</h1>
                            <p className="text-sm text-gray-600">Master database of all event participants</p>
                        </div>
                    </header>

                    {/* Filters Strip */}
                    <div className="mb-8 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search by name or ID..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <select 
                                value={teamFilter}
                                onChange={(e) => {
                                    setTeamFilter(e.target.value);
                                    setEventFilter('All');
                                }}
                                className="bg-white border border-gray-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded cursor-pointer text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="All">ALL TEAMS</option>
                                {teams
                                    .filter(t => t.name?.toLowerCase() !== 'registration')
                                    .map(t => <option key={t.id} value={t.name}>{t.name.toUpperCase()}</option>)}
                            </select>

                            <select 
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                                className="bg-white border border-gray-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded cursor-pointer text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="All">ALL EVENTS</option>
                                {events
                                    .filter(e => teamFilter === 'All' || e.team === teamFilter)
                                    .map(e => <option key={e.id} value={e.name}>{e.name.toUpperCase()}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px]">ID</th>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px]">Name</th>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px]">Team</th>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px]">Event</th>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px] text-center">Status</th>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px] text-center">Verified</th>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px] text-center">Present</th>
                                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-widest text-[9px] text-right">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredParticipants.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-4 py-4 font-mono text-[10px] font-bold text-gray-400">{p.id}</td>
                                            <td className="px-4 py-4 font-bold text-gray-900">{p.name}</td>
                                            <td className="px-4 py-4">
                                                <span className="text-[9px] font-black px-1.5 py-0.5 border border-gray-200 text-gray-500 rounded uppercase">
                                                    {p.team}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[10px] font-medium text-gray-600">{p.event}</td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`text-[9px] font-bold ${p.verified ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {p.verified ? 'ACTIVE' : 'LOCKED'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => toggleVerification(p.id, p.verified)}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-colors ${
                                                        p.verified ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {p.verified ? 'YES' : 'NO'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePresence(p.id, p.present)}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-colors ${
                                                        p.present ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {p.present ? 'IN' : 'OUT'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button 
                                                    onClick={() => togglePayment(p.id, p.payment_status)}
                                                    className={`text-[9px] font-black uppercase transition-colors ${
                                                        p.payment_status === 'paid' ? 'text-green-600 hover:text-green-700' : 'text-amber-600 hover:text-amber-700'
                                                    }`}
                                                >
                                                    {p.payment_status === 'paid' ? '✓ PAID' : '⚠ PENDING'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterParticipants;
