import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useAdminAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Clock, 
    AlertTriangle,
    IndianRupee,
    ArrowRight,
    Search
} from 'lucide-react';

const AdminStats = () => {
    const { adminUser } = useAdminAuth();
    const { data } = useData();
    const { participants, events } = data;

    const [selectedEvent, setSelectedEvent] = useState('All');

    const isRegistration = adminUser?.team === 'Registration';

    // Filter events and participants for the team
    const teamEvents = useMemo(() => {
        return events.filter(e => e.team === adminUser?.team);
    }, [events, adminUser?.team]);

    const stats = useMemo(() => {
        if (isRegistration) return null;

        const filteredParticipants = selectedEvent === 'All'
            ? participants.filter(p => p.team === adminUser?.team)
            : participants.filter(p => p.event === selectedEvent);

        const totalPaid = filteredParticipants
            .filter(p => p.payment_status === 'paid')
            .reduce((sum, p) => sum + (p.payment_amount || 0), 0);

        const presentCount = filteredParticipants.filter(p => p.attendance === 'Present').length;
        
        return {
            totalParticipants: filteredParticipants.length,
            totalPaid: totalPaid.toLocaleString(),
            presentCount,
            attendanceRate: filteredParticipants.length > 0 ? Math.round((presentCount / filteredParticipants.length) * 100) : 0,
            filteredParticipants
        };
    }, [participants, adminUser?.team, selectedEvent, isRegistration]);

    if (isRegistration) {
        return (
            <div className="flex h-screen bg-white text-gray-900 border-gray-200">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8 lg:ml-64 flex items-center justify-center">
                    <div className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <BarChart3 className="w-8 h-8 text-gray-900" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Team Mode</h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            As a member of the Registration Team, comprehensive cross-domain analytics are centralized in your main dashboard.
                        </p>
                        <button 
                            onClick={() => window.location.href = '/admin/dashboard'}
                            className="bg-gray-900 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 mx-auto"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-gray-900">
                                <BarChart3 className="w-6 h-6 text-gray-400" />
                                Domain Analytics
                            </h1>
                            <p className="text-sm text-gray-500">Financial and attendance performance for {adminUser?.team}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Filter View:</span>
                            <select 
                                className="text-xs font-bold px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                            >
                                <option value="All">All Domain Events</option>
                                {teamEvents.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                            </select>
                        </div>
                    </header>

                    {/* Financial & Attendance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition-all border-l-4 border-l-gray-900">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <IndianRupee className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue</span>
                            </div>
                            <p className="text-3xl font-black text-gray-900">₹{stats.totalPaid}</p>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Collected via Domain</p>
                        </div>

                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition-all border-l-4 border-l-gray-900">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <Users className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reach</span>
                            </div>
                            <p className="text-3xl font-black text-gray-900">{stats.totalParticipants}</p>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Validated Attendees</p>
                        </div>

                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition-all border-l-4 border-l-gray-900">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <Clock className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attendance</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-gray-900">{stats.attendanceRate}%</p>
                                <p className="text-xs text-gray-400 font-bold">({stats.presentCount} present)</p>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-gray-900" style={{ width: `${stats.attendanceRate}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Event Table (Subset) */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                                Detailed Breakdown
                            </h2>
                            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-3 py-1 rounded hover:bg-white transition-all">Refine List</button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Event Segment</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Registry</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Paid Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Gate Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {selectedEvent === 'All' ? teamEvents.map(event => {
                                    const eventParts = participants.filter(p => p.event === event.name);
                                    const eventPres = eventParts.filter(p => p.attendance === 'Present').length;
                                    const eventPaid = eventParts.filter(p => p.payment_status === 'paid').length;
                                    const perc = eventParts.length > 0 ? Math.round((eventPres / eventParts.length) * 100) : 0;
                                    
                                    return (
                                        <tr key={event.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{event.name}</td>
                                            <td className="px-6 py-4 text-xs font-semibold text-gray-500">{eventParts.length} Heads</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded uppercase tracking-tighter">
                                                    {eventPaid} Paid
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-[10px] font-bold text-gray-900">{perc}%</span>
                                                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gray-900" style={{ width: `${perc}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr className="bg-white">
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Viewing filtered segment for {selectedEvent}</p>
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

export default AdminStats;

