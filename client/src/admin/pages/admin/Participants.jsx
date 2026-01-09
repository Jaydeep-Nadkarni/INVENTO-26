import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { useAdminAuth } from '../../context/AuthContext';
import { 
    Search, 
    UserCheck, 
    UserX,
    Filter, 
    Download,
    ChevronLeft,
    ChevronRight,
    Trophy
} from 'lucide-react';

const AdminParticipants = () => {
    const { adminUser } = useAdminAuth();
    const { data, updateParticipant } = useData();
    const { participants, events } = data;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [activeEventTab, setActiveEventTab] = useState('All');

    const isRegistration = adminUser?.team === 'Registration';

    // Get events relevant to this admin's team
    const relevantEvents = useMemo(() => {
        if (isRegistration) return events;
        return events.filter(e => e.team === adminUser?.team);
    }, [events, adminUser?.team, isRegistration]);

    // Filter participants based on team and selected event tab
    const filteredParticipants = useMemo(() => {
        let result = participants;

        // 1. Team level filter (unless Registration)
        if (!isRegistration) {
            result = result.filter(p => p.team === adminUser?.team);
        }

        // 2. Event Tab filter
        if (activeEventTab !== 'All') {
            result = result.filter(p => p.event === activeEventTab);
        }

        // 3. Search Term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.id.toString().toLowerCase().includes(term) ||
                p.event.toLowerCase().includes(term)
            );
        }

        return result;
    }, [participants, adminUser?.team, activeEventTab, searchTerm, isRegistration]);

    const handleToggleAttendance = (id, currentAttendance) => {
        const newStatus = currentAttendance === 'Present' ? 'Absent' : 'Present';
        updateParticipant(id, { attendance: newStatus });
    };

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Participants Registry</h1>
                            <p className="text-sm text-gray-500">
                                {isRegistration ? "Universal attendee management" : `Managing attendees for ${adminUser?.team} domain`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
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
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
                                activeEventTab === 'All' 
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
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
                                    activeEventTab === event.name 
                                    ? 'border-gray-900 text-gray-900' 
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {event.name}
                            </button>
                        ))}
                    </div>

                    {/* Filters & Actions */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name, event, or ID..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Showing {filteredParticipants.length} entries
                        </div>
                    </div>
                    
                    {/* Data Table */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Registry ID</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Attendee Name</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Domain/Team</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Event</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Verification</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Gate Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredParticipants.length > 0 ? (
                                    filteredParticipants.map((participant) => (
                                        <tr key={participant.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-[11px] text-gray-400">{participant.id}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{participant.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {participant.team}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">{participant.event}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${participant.status === 'Verified' ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-tight ${
                                                        participant.status === 'Verified' ? 'text-green-700' : 'text-amber-700'
                                                    }`}>
                                                        {participant.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleToggleAttendance(participant.id, participant.attendance)}
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                                                        participant.attendance === 'Present' 
                                                        ? 'bg-green-50 text-green-700 border border-green-100' 
                                                        : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100 hover:text-gray-900'
                                                    }`}
                                                >
                                                    {participant.attendance === 'Present' ? <UserCheck className="w-3" /> : <UserX className="w-3" />}
                                                    {participant.attendance === 'Present' ? 'Verified' : 'Log Entry'}
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
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        {/* Pagination Placeholder */}
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page 1 of 1</span>
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

