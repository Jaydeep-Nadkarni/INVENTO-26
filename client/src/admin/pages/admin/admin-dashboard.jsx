import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useAdminAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
    Users, 
    Calendar, 
    CheckCircle, 
    TrendingUp, 
    Activity, 
    Layers, 
    ArrowUpRight,
    Filter,
    Search
} from 'lucide-react';

const AdminDashboard = () => {
    const { adminUser } = useAdminAuth();
    const { data } = useData();
    const { participants, events } = data;
    
    const [selectedTeam, setSelectedTeam] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState('All');

    const isRegistration = adminUser?.team === 'Registration';

    // Calculation Logic
    const stats = useMemo(() => {
        // Filter based on team/event logic
        const teamParticipants = isRegistration 
            ? (selectedTeam === 'All' ? participants : participants.filter(p => p.team === selectedTeam))
            : participants.filter(p => p.team === adminUser?.team);
            
        const finalParticipants = isRegistration && selectedEvent !== 'All'
            ? teamParticipants.filter(p => p.event === selectedEvent)
            : teamParticipants;

        const teamEvents = isRegistration
            ? (selectedTeam === 'All' ? events : events.filter(e => e.team === selectedTeam))
            : events.filter(e => e.team === adminUser?.team);

        const totalSlots = teamEvents.reduce((acc, e) => acc + (e.total_slots || 0), 0);
        const verifiedCount = finalParticipants.filter(p => p.status === 'Verified').length;
        
        return {
            participantsCount: finalParticipants.length,
            eventsCount: teamEvents.length,
            slotsOccupancy: totalSlots > 0 ? Math.round((finalParticipants.length / totalSlots) * 100) : 0,
            verifiedPercentage: finalParticipants.length > 0 ? Math.round((verifiedCount / finalParticipants.length) * 100) : 0,
            globalVerifiedPercentage: participants.length > 0 ? Math.round((participants.filter(p => p.status === 'Verified').length / participants.length) * 100) : 0,
            relevantEvents: teamEvents
        };
    }, [participants, events, adminUser?.team, isRegistration, selectedTeam, selectedEvent]);

    const teams = ["Dance", "Music", "Media", "Coding", "Registration", "Gaming", "HR", "Art"];

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Welcome back, {adminUser?.team}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {isRegistration ? "Managing global event ecosystem" : `Managing ${adminUser?.team} domain activities`}
                            </p>
                        </div>

                        {isRegistration && (
                            <div className="flex gap-2">
                                <select 
                                    className="text-xs font-semibold px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    value={selectedTeam}
                                    onChange={(e) => {
                                        setSelectedTeam(e.target.value);
                                        setSelectedEvent('All');
                                    }}
                                >
                                    <option value="All">All Teams</option>
                                    {teams.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <select 
                                    className="text-xs font-semibold px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                >
                                    <option value="All">All Events</option>
                                    {stats.relevantEvents.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                                </select>
                            </div>
                        )}
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <article className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <Layers className="w-5 h-5 text-gray-900" />
                                </div>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">LIVE</span>
                            </div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Assigned Domain</h3>
                            <p className="text-xl font-bold">{adminUser?.team}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Primary Responsibility</p>
                        </article>

                        <article className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <Users className="w-5 h-5 text-gray-900" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-300" />
                            </div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Participants</h3>
                            <p className="text-3xl font-bold">{stats.participantsCount}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Across all team events</p>
                        </article>

                        <article className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-gray-900" />
                                </div>
                                <div className="text-xs font-bold text-gray-900">{stats.verifiedPercentage}%</div>
                            </div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Verification Rate</h3>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-gray-900" style={{ width: `${stats.verifiedPercentage}%` }}></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">Team verification efficiency</p>
                        </article>

                        <article className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-gray-900" />
                                </div>
                                <div className="text-xs font-bold text-gray-900">{stats.slotsOccupancy}%</div>
                            </div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Slots Fill Rate</h3>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-gray-900" style={{ width: `${stats.slotsOccupancy}%` }}></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">Overall slots utilization</p>
                        </article>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                         <section className="lg:col-span-2 bg-gray-50/50 border border-gray-200 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                    Event Performance
                                </h2>
                                <button className="text-[10px] font-bold text-gray-500 uppercase hover:text-gray-900">View All</button>
                            </div>
                            <div className="space-y-4">
                                {stats.relevantEvents.slice(0, 4).map((event) => {
                                    const eventParts = participants.filter(p => p.event === event.name).length;
                                    const percent = Math.round((eventParts / (event.total_slots || 1)) * 100);
                                    return (
                                        <div key={event.id} className="bg-white p-4 border border-gray-100 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{event.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">{event.status}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">{percent}%</p>
                                                <p className="text-[10px] text-gray-500 font-medium">Occupancy</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                         </section>

                         <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">
                                    Global Status
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-gray-500">System Verification</span>
                                            <span className="text-xs font-bold text-gray-900">{stats.globalVerifiedPercentage}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-900" style={{ width: `${stats.globalVerifiedPercentage}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <Activity className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 mb-1">System Load: NOMINAL</p>
                                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Monitoring all checkpoints across {events.length} active events.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all">
                                Generate Report
                            </button>
                         </section>
                    </div>

                    {/* Footer */}
                    <footer className="mt-12 py-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <div className="flex gap-4">
                            <span>Admin Engine v2.0.1</span>
                            <span className="text-gray-200">|</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="text-gray-900 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Security Protocol Active
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

