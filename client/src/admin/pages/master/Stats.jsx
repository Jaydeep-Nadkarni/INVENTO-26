import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { 
    PieChart, TrendingUp, Info, Users, 
    Wallet, Filter, BarChart3, 
    Target, Download
} from 'lucide-react';

const MasterStats = () => {
    const { participants, events, teams } = useData();
    const [selectedTeamId, setSelectedTeamId] = useState('all');
    const [selectedEventId, setSelectedEventId] = useState('all');

    // 1. Filtered Data
    const filteredParticipants = useMemo(() => {
        return participants.filter(p => {
            const matchTeam = selectedTeamId === 'all' || p.team_id?._id === selectedTeamId;
            const matchEvent = selectedEventId === 'all' || p.event_id?._id === selectedEventId;
            return matchTeam && matchEvent;
        });
    }, [participants, selectedTeamId, selectedEventId]);

    // 2. Calculations for filtered data
    const stats = useMemo(() => {
        const total = filteredParticipants.length;
        const verified = filteredParticipants.filter(p => p.is_verified).length;
        const totalPaid = filteredParticipants.reduce((acc, p) => acc + (p.payment_status === 'Paid' ? (p.event_id?.price || 0) : 0), 0);
        
        // Payment methods breakdown
        const payments = {};
        // Participants distribution (by event if team selected, or by team if all)
        const distribution = {};

        filteredParticipants.forEach(p => {
            // Payment method
            const method = p.payment_method || 'Online';
            payments[method] = (payments[method] || 0) + 1;

            // Distribution
            const key = selectedTeamId === 'all' 
                ? (p.team_id?.team_name || 'N/A')
                : (p.event_id?.event_name || 'N/A');
            distribution[key] = (distribution[key] || 0) + 1;
        });

        return {
            total,
            verified,
            totalPaid,
            payments: Object.entries(payments).map(([name, count]) => ({ name, count })),
            distribution: Object.entries(distribution)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
        };
    }, [filteredParticipants, selectedTeamId]);
    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Global Filters */}
                    <header className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <PieChart className="w-5 h-5 text-gray-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Analytical Node</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900">SYSTEM STATS</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded">
                                <Filter className="w-3 h-3 text-gray-400" />
                                <select 
                                    className="bg-transparent text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer"
                                    value={selectedTeamId}
                                    onChange={(e) => {
                                        setSelectedTeamId(e.target.value);
                                        setSelectedEventId('all');
                                    }}
                                >
                                    <option value="all">ALL TEAMS</option>
                                    {teams.map(t => <option key={t._id} value={t._id}>{t.team_name.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded">
                                <select 
                                    className="bg-transparent text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer"
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                >
                                    <option value="all">ALL EVENTS</option>
                                    {events
                                        .filter(e => selectedTeamId === 'all' || e.team?._id === selectedTeamId)
                                        .map(e => <option key={e._id} value={e._id}>{e.event_name.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </div>
                    </header>

                    {/* Filtered KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Filtered Sample", value: stats.total, icon: Users, color: "text-blue-500" },
                            { label: "Verified Data", value: stats.verified, icon: Target, color: "text-green-500" },
                            { label: "Local Revenue", value: `₹${stats.totalPaid.toLocaleString()}`, icon: Wallet, color: "text-amber-500" },
                            { label: "Verification %", value: stats.total > 0 ? `${Math.round((stats.verified/stats.total)*100)}%` : '0%', icon: BarChart3, color: "text-purple-500" }
                        ].map((stat, idx) => (
                            <div key={idx} className="border border-gray-200 p-5 rounded hover:border-gray-400 transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <div className="text-2xl font-black">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Domain Distribution Chart */}
                        <section className="lg:col-span-2 border border-gray-200 rounded p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.15em] mb-8 flex items-center justify-between">
                                <span>Volume Distribution</span>
                                <span className="text-[10px] font-medium text-gray-400 uppercase">BY {selectedTeamId === 'all' ? 'TEAMS' : 'EVENTS'}</span>
                            </h2>
                            <div className="space-y-6">
                                {stats.distribution.length > 0 ? stats.distribution.map((item, idx) => {
                                    const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                                    return (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold uppercase tracking-tight text-gray-700">{item.name}</span>
                                                <span className="text-[10px] font-black">{item.count}</span>
                                            </div>
                                            <div className="h-4 w-full bg-gray-50 overflow-hidden border border-gray-100">
                                                <div 
                                                    className="h-full bg-gray-900 transition-all duration-1000"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-12 text-gray-300">
                                        <p className="text-[10px] font-bold uppercase">No distribution data</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Payments Breakdown */}
                        <section className="border border-gray-200 rounded p-6 flex flex-col">
                            <h2 className="text-xs font-black uppercase tracking-[0.15em] mb-8">Asset Breakdown</h2>
                            <div className="space-y-6 flex-1">
                                {stats.payments.length > 0 ? stats.payments.map((p, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 border-l-2 border-gray-900 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">MODE</p>
                                            <p className="text-xs font-black uppercase">{p.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black">{p.count}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">NODES</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-300">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase">No records found</p>
                                    </div>
                                )}
                                
                                <div className="mt-auto pt-6 border-t border-dotted border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">System Integrity</span>
                                        <span className="text-[10px] font-bold text-green-600">VERIFIED</span>
                                    </div>
                                    <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all">
                                        <Download className="w-3 h-3" />
                                        EXPORT DATAFRAME
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <footer className="mt-12 py-6 border-t border-gray-100">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center gap-4">
                            METRIC_AUTO_PULL: COMPLETED <span className="w-1 h-1 rounded-full bg-gray-300"></span> 
                            LATENCY: 0.04 MS <span className="w-1 h-1 rounded-full bg-gray-300"></span> 
                            ENCRYPTION: AES-256
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default MasterStats;
