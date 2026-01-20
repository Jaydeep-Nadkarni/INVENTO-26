import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { apiGet, apiPatch } from '../../../utils/apiClient';
import {
    Shield, Search, Save, Settings2,
    ChevronDown, ChevronUp, Users,
    CheckCircle2, XCircle, Clock,
    Filter, Download, School,
    Flag, RefreshCw, Loader2
} from 'lucide-react';

const MasterTeams = () => {
    const { data: { events } } = useData();
    const [teamRegistrations, setTeamRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedTeams, setExpandedTeams] = useState(new Set());

    // Filters
    const [statusFilter, setStatusFilter] = useState('All');
    const [officialFilter, setOfficialFilter] = useState('All');
    const [eventFilter, setEventFilter] = useState('All');

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const { data: allRegs } = await apiGet('/api/events/registrations/all');
            // Filter only team registrations
            setTeamRegistrations(allRegs.filter(r => r.isTeam));
        } catch (error) {
            console.error("Failed to fetch teams:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const toggleExpand = (teamKey) => {
        const next = new Set(expandedTeams);
        if (next.has(teamKey)) next.delete(teamKey);
        else next.add(teamKey);
        setExpandedTeams(next);
    };

    const handleUpdateStatus = async (team, newStatus) => {
        try {
            await apiPatch(`/api/events/${team.eventId}/teams/${team.teamName}/status`, { status: newStatus });
            setTeamRegistrations(prev => prev.map(t =>
                (t.teamName === team.teamName && t.eventId === team.eventId)
                    ? { ...t, status: newStatus }
                    : t
            ));
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
    };

    const handleMemberAttendance = async (team, member, isPresent) => {
        try {
            await apiPatch(`/api/events/${team.eventId}/teams/${team.teamName}/members/${member.inventoId}/attendance`, { isPresent });
            setTeamRegistrations(prev => prev.map(t => {
                if (t.teamName === team.teamName && t.eventId === team.eventId) {
                    return {
                        ...t,
                        members: t.members.map(m => m.inventoId === member.inventoId ? { ...m, isPresent } : m)
                    };
                }
                return t;
            }));
        } catch (error) {
            alert("Failed to update attendance: " + error.message);
        }
    };

    const filteredTeams = useMemo(() => {
        return teamRegistrations.filter(t => {
            const matchesSearch = t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.leaderId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
            const matchesOfficial = officialFilter === 'All' ||
                (officialFilter === 'Official' ? t.isOfficial : !t.isOfficial);
            const matchesEvent = eventFilter === 'All' || t.eventName === eventFilter;

            return matchesSearch && matchesStatus && matchesOfficial && matchesEvent;
        });
    }, [teamRegistrations, searchTerm, statusFilter, officialFilter, eventFilter]);

    const statusColors = {
        PENDING: 'text-amber-500',
        CONFIRMED: 'text-green-500',
        WAITLIST: 'text-blue-500',
        CANCELLED: 'text-red-500',
        DISQUALIFIED: 'text-gray-500',
    };

    return (
        <div className="flex h-screen bg-black text-white border-gray-800">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-8 border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-white">
                                <Users className="w-6 h-6 text-indigo-500" />
                                Team Registrations
                            </h1>
                            <p className="text-sm text-gray-400">Manage event-based team entries and member attendance</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchTeams}
                                className="p-2 bg-gray-900 border border-gray-800 rounded hover:bg-gray-800 transition-all"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded transition-all hover:bg-gray-200">
                                <Download className="w-4 h-4" />
                                Export Ledger
                            </button>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative col-span-1 md:col-span-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by team or lead..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-800 rounded text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="WAITLIST">Waitlist</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <select
                            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={officialFilter}
                            onChange={(e) => setOfficialFilter(e.target.value)}
                        >
                            <option value="All">Registration Type</option>
                            <option value="Official">Official (Contingent)</option>
                            <option value="Open">Open (Paid)</option>
                        </select>
                        <select
                            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value)}
                        >
                            <option value="All">All Events</option>
                            {events.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-gray-950 border border-gray-800 rounded-md overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900 border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Team Name</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Event Context</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Classification</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Syncing Matrix...</p>
                                        </td>
                                    </tr>
                                ) : filteredTeams.length > 0 ? (
                                    filteredTeams.map((team) => {
                                        const teamKey = `${team.eventId}-${team.teamName}`;
                                        const isExpanded = expandedTeams.has(teamKey);

                                        return (
                                            <React.Fragment key={teamKey}>
                                                <tr className={`${isExpanded ? 'bg-indigo-950/10' : 'hover:bg-gray-900/50'} transition-colors`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-white uppercase tracking-tight">{team.teamName}</span>
                                                            <span className="text-[10px] text-gray-600 font-mono italic">Lead: {team.leaderId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-gray-300">{team.eventName}</span>
                                                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">{team.team}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {team.isOfficial ? (
                                                            <div className="flex items-center gap-2 text-amber-500">
                                                                <Flag className="w-3" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Official</span>
                                                                <span className="text-[9px] px-1.5 py-0.5 bg-amber-950/50 border border-amber-900 rounded">{team.contingentKey}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Open Entry</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-bold">
                                                        <select
                                                            className={`bg-transparent border-none focus:ring-0 cursor-pointer ${statusColors[team.status]}`}
                                                            value={team.status}
                                                            onChange={(e) => handleUpdateStatus(team, e.target.value)}
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="CONFIRMED">Confirmed</option>
                                                            <option value="WAITLIST">Waitlist</option>
                                                            <option value="CANCELLED">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => toggleExpand(teamKey)}
                                                            className="p-1.5 hover:bg-gray-800 rounded transition-all"
                                                        >
                                                            {isExpanded ? <ChevronUp className="w-4" /> : <ChevronDown className="w-4" />}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-gray-950/50">
                                                        <td colSpan="5" className="px-12 py-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                <div className="space-y-4">
                                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                                                                        <Layers className="w-3" /> Team Manifesto
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        {team.members.map(member => (
                                                                            <div key={member.inventoId} className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded group">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-all">{member.name}</span>
                                                                                    <span className="text-[10px] text-gray-500 font-mono">{member.inventoId}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-3">
                                                                                    <button
                                                                                        onClick={() => handleMemberAttendance(team, member, !member.isPresent)}
                                                                                        className={`text-[9px] font-black uppercase px-2 py-1 rounded border transition-all ${member.isPresent
                                                                                                ? 'bg-green-950/30 text-green-500 border-green-900'
                                                                                                : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-white hover:text-white'
                                                                                            }`}
                                                                                    >
                                                                                        {member.isPresent ? 'Present' : 'Mark Arrival'}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                                                                        <School className="w-3" /> Institutional Intel
                                                                    </h4>
                                                                    <div className="p-4 bg-gray-900 border border-gray-800 rounded">
                                                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Associated College</p>
                                                                        <p className="text-sm font-black text-white">{team.members[0]?.clgName || 'N/A'}</p>

                                                                        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                                                                            <div>
                                                                                <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Squad Size</p>
                                                                                <p className="text-lg font-black text-indigo-500">{team.members.length}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Arrival Tracker</p>
                                                                                <p className="text-lg font-black text-green-500">{team.members.filter(m => m.isPresent).length} / {team.members.length}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">No matching intel found</p>
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

export default MasterTeams;
