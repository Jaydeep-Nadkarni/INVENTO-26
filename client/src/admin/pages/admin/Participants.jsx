import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { useAdminAuth } from '../../context/AuthContext';
import { apiGet, apiPatch } from '../../../utils/apiClient';
import {
    Search,
    UserCheck,
    UserX,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Trophy,
    User,
    Users,
    School,
    BadgeCheck,
    Loader2
} from 'lucide-react';

const AdminParticipants = () => {
    const { adminUser } = useAdminAuth();
    const { data, adminEvents } = useData();
    const { events } = data;

    const [participantsList, setParticipantsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeEventTab, setActiveEventTab] = useState('All');

    // Filters
    const [statusFilter, setStatusFilter] = useState('All');
    const [officialFilter, setOfficialFilter] = useState('All');
    const [collegeFilter, setCollegeFilter] = useState('');

    const isRegistration = adminUser?.isRegistration || adminUser?.team === 'Registration';

    // Get events relevant to this admin's team/access
    const relevantEvents = adminEvents;

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            let endpoint = '/api/events/registrations/all';
            const { data: results } = await apiGet(endpoint);
            
            // Filter list centrally if not registration admin
            if (!isRegistration) {
                const accessibleEventIds = relevantEvents.map(e => String(e.id));
                const accessibleEventNames = relevantEvents.map(e => e.name);
                setParticipantsList(results.filter(p => 
                    accessibleEventNames.includes(p.eventName) || 
                    accessibleEventIds.includes(String(p.eventId))
                ));
            } else {
                setParticipantsList(results);
            }
        } catch (error) {
            console.error("Failed to fetch participants:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    // Filter participants based on tab, search, and other filters
    const filteredParticipants = useMemo(() => {
        let result = participantsList;

        // 1. Team level filter (unless Registration)
        if (!isRegistration) {
            result = result.filter(p => p.team === adminUser?.team);
        }

        // 2. Event Tab filter
        if (activeEventTab !== 'All') {
            result = result.filter(p => p.eventName === activeEventTab);
        }

        // 3. Status filter
        if (statusFilter !== 'All') {
            result = result.filter(p => p.status === statusFilter);
        }

        // 4. Official filter
        if (officialFilter === 'Official') {
            result = result.filter(p => p.isOfficial);
        } else if (officialFilter === 'Open') {
            result = result.filter(p => !p.isOfficial);
        }

        // 5. College filter
        if (collegeFilter) {
            result = result.filter(p => p.clgName?.toLowerCase().includes(collegeFilter.toLowerCase()));
        }

        // 6. Search Term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name?.toLowerCase().includes(term) ||
                p.inventoId?.toLowerCase().includes(term) ||
                p.teamName?.toLowerCase().includes(term) ||
                p.eventName?.toLowerCase().includes(term)
            );
        }

        return result;
    }, [participantsList, adminUser?.team, activeEventTab, searchTerm, isRegistration, statusFilter, officialFilter, collegeFilter]);

    const handleToggleAttendance = async (participant) => {
        try {
            const newAttendance = !participant.isPresent;
            const endpoint = participant.isTeam
                ? `/api/events/${participant.eventId}/teams/${participant.teamName}/members/${participant.inventoId}/attendance`
                : `/api/events/${participant.eventId}/participants/${participant.inventoId}/attendance`;

            await apiPatch(endpoint, { isPresent: newAttendance });

            // Optimistic update
            setParticipantsList(prev => prev.map(p =>
                (p.inventoId === participant.inventoId && p.eventId === participant.eventId)
                    ? { ...p, isPresent: newAttendance }
                    : p
            ));
        } catch (error) {
            alert("Failed to update attendance: " + error.message);
        }
    };

    const handleUpdateStatus = async (participant, newStatus) => {
        try {
            const endpoint = participant.isTeam
                ? `/api/events/${participant.eventId}/teams/${participant.teamName}/status`
                : `/api/events/${participant.eventId}/participants/${participant.inventoId}/status`;

            await apiPatch(endpoint, { status: newStatus });

            // Update local state (if it's a team, we might need to update all members if our flat list treats them separately)
            // But based on our backend, status is on the team object or participant object.
            setParticipantsList(prev => prev.map(p => {
                if (participant.isTeam) {
                    return (p.teamName === participant.teamName && p.eventId === participant.eventId)
                        ? { ...p, status: newStatus }
                        : p;
                } else {
                    return (p.inventoId === participant.inventoId && p.eventId === participant.eventId)
                        ? { ...p, status: newStatus }
                        : p;
                }
            }));
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
    };

    const statusColors = {
        PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
        CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
        WAITLIST: 'bg-blue-100 text-blue-700 border-blue-200',
        CANCELLED: 'bg-red-100 text-red-700 border-red-200',
        DISQUALIFIED: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                Participants Registry
                                {isRegistration && adminUser?.role !== 'master' && (
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-bold uppercase tracking-tighter">
                                        Read-Only Access
                                    </span>
                                )}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {isRegistration ? "Universal attendee management & entry control" : `Managing attendees for ${adminUser?.team} domain`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={fetchParticipants}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-widest rounded transition-all hover:bg-gray-200"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded transition-all hover:bg-black">
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                    </header>

                    {/* Event Tabs */}
                    <div className="flex overflow-x-auto gap-1 mb-8 pb-2 scrollbar-hide border-b border-gray-100">
                        <button
                            onClick={() => setActiveEventTab('All')}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeEventTab === 'All'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            All Events
                        </button>
                        {relevantEvents.map(event => (
                            <button
                                key={event.id}
                                onClick={() => setActiveEventTab(event.name)}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeEventTab === event.name
                                        ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {event.name}
                            </button>
                        ))}
                    </div>

                    {/* Filters & Actions */}
                    <div className="mb-6 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, team, or ID..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                <select
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="WAITLIST">Waitlist</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="DISQUALIFIED">Disqualified</option>
                                </select>

                                <select
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    value={officialFilter}
                                    onChange={(e) => setOfficialFilter(e.target.value)}
                                >
                                    <option value="All">All Entry Types</option>
                                    <option value="Official">Official (Contingent)</option>
                                    <option value="Open">Open Registration</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="Filter by College..."
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    value={collegeFilter}
                                    onChange={(e) => setCollegeFilter(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Filter className="w-3 h-3" />
                            Showing {filteredParticipants.length} entries matching current filters
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[1000px]">
                                <thead className="bg-gray-50/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Registry ID</th>
                                        <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Participant</th>
                                        <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Affiliation</th>
                                        <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Event/Domain</th>
                                        <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Status</th>
                                        <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Attendance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredParticipants.length > 0 ? (
                                        filteredParticipants.map((participant, idx) => (
                                            <tr key={`${participant.inventoId}-${participant.eventId}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-[11px] text-gray-400">{participant.inventoId}</span>
                                                        {participant.isTeam && (
                                                            <span className="text-[9px] font-bold text-purple-600 uppercase tracking-tighter">Team member</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                            {participant.isTeam ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900">{participant.name}</span>
                                                            <span className="text-[10px] text-gray-500">{participant.email || participant.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <School className="w-3 h-3 text-gray-400" />
                                                            <span className="text-xs font-medium text-gray-600 leading-tight">
                                                                {participant.clgName || 'Independent'}
                                                            </span>
                                                        </div>
                                                        {participant.isOfficial && (
                                                            <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                                                                <BadgeCheck className="w-2.5" />
                                                                OFFICIAL — {participant.contingentKey}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">{participant.eventName}</span>
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{participant.team}</span>
                                                        {participant.isTeam && (
                                                            <span className="text-[9px] text-indigo-500 font-medium italic mt-0.5">Team: {participant.teamName}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        className={`text-[10px] font-bold uppercase border rounded px-2 py-1 focus:outline-none transition-colors ${statusColors[participant.status]} ${(isRegistration && adminUser?.role !== 'master') ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                        value={participant.status}
                                                        onChange={(e) => handleUpdateStatus(participant, e.target.value)}
                                                        disabled={isRegistration && adminUser?.role !== 'master'}
                                                    >
                                                        <option value="PENDING">Pending</option>
                                                        <option value="CONFIRMED">Confirmed</option>
                                                        <option value="WAITLIST">Waitlist</option>
                                                        <option value="CANCELLED">Cancelled</option>
                                                        <option value="DISQUALIFIED">Disqualified</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleToggleAttendance(participant)}
                                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all min-w-[100px] justify-center ${participant.isPresent
                                                                ? 'bg-green-50 text-green-700 border border-green-100 shadow-sm'
                                                                : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {participant.isPresent ? <UserCheck className="w-3" /> : <UserX className="w-3" />}
                                                        {participant.isPresent ? 'Present' : 'Absent'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                        <Search className="w-5 h-5 text-gray-300" />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching records found</p>
                                                    <button
                                                        onClick={() => {
                                                            setSearchTerm('');
                                                            setActiveEventTab('All');
                                                            setStatusFilter('All');
                                                            setOfficialFilter('All');
                                                            setCollegeFilter('');
                                                        }}
                                                        className="text-[10px] text-indigo-600 font-bold uppercase underline"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Rendering {filteredParticipants.length} records
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1 border border-gray-200 rounded text-gray-300 transition-all cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                                <button className="p-1 border border-gray-200 rounded text-gray-300 transition-all cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminParticipants;
