import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Search, Filter, Download, ExternalLink, ChevronDown } from 'lucide-react';

const MasterParticipants = () => {
    const { data: { participants, teams, events }, updateParticipant, refreshParticipants } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('All');
    const [eventFilter, setEventFilter] = useState('All');
    const [refreshing, setRefreshing] = useState(false);

    const filteredParticipants = useMemo(() => {
        return participants.filter(p => {
            const matchesSearch = 
                (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                (p.inventoId || '').toLowerCase().includes(searchTerm.toLowerCase());
                
            const matchesTeam = teamFilter === 'All' || p.team === teamFilter;
            const matchesEvent = eventFilter === 'All' || p.eventName === eventFilter;
            
            return matchesSearch && matchesTeam && matchesEvent;
        });
    }, [participants, searchTerm, teamFilter, eventFilter]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshParticipants();
        setRefreshing(false);
    };

    const downloadCSV = () => {
        const headers = ['Invento ID', 'Name', 'Email', 'Phone', 'College', 'Team', 'Event', 'Status', 'Paid', 'Present'];
        const csvContent = [
            headers.join(','),
            ...filteredParticipants.map(p => [
                p.inventoId,
                `"${p.name}"`,
                p.email,
                p.phone,
                `"${p.clgName}"`,
                p.team,
                `"${p.eventName}"`,
                p.status,
                p.paid ? 'PAID' : 'PENDING',
                p.isPresent ? 'YES' : 'NO'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `participants_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleStatus = (eventId, inventoId, currentStatus) => {
        const nextStatus = currentStatus === 'CONFIRMED' ? 'PENDING' : 'CONFIRMED';
        updateParticipant(eventId, inventoId, { status: nextStatus });
    };

    const togglePresence = (eventId, inventoId, currentPresence) => {
        updateParticipant(eventId, inventoId, { isPresent: !currentPresence });
    };

    const togglePayment = (eventId, inventoId, currentPaid) => {
        // Payment update might need a different endpoint or be handled via status
        // For now, let's assume we can toggle it if needed, or just leave it as is if it's read-only
        console.log("Payment toggle for:", inventoId);
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
                                    {filteredParticipants.map((p, idx) => (
                                        <tr key={p.inventoId || idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-4 py-4 font-mono text-[10px] font-bold text-gray-400">{p.inventoId}</td>
                                            <td className="px-4 py-4 font-bold text-gray-900">{p.name}</td>
                                            <td className="px-4 py-4">
                                                <span className="text-[9px] font-black px-1.5 py-0.5 border border-gray-200 text-gray-500 rounded uppercase">
                                                    {p.team}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[10px] font-medium text-gray-600">{p.eventName}</td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`text-[9px] font-bold ${p.status === 'CONFIRMED' ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => toggleStatus(p.eventId, p.inventoId, p.status)}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-colors ${
                                                        p.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {p.status === 'CONFIRMED' ? 'YES' : 'NO'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePresence(p.eventId, p.inventoId, p.isPresent)}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-colors ${
                                                        p.isPresent ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {p.isPresent ? 'IN' : 'OUT'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className={`text-[9px] font-black uppercase ${
                                                        p.paid ? 'text-green-600' : 'text-amber-600'
                                                    }`}>
                                                    {p.paid ? '✓ PAID' : '⚠ PENDING'}
                                                </div>
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
