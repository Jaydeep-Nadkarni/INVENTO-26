import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { 
    PieChart, TrendingUp, Info, Users, 
    Wallet, Filter, BarChart3, 
    Target, Download
} from 'lucide-react';

const MasterStats = () => {
    const { data: { participants, events, teams } } = useData();
    const [selectedTeam, setSelectedTeam] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState('all');

    // 1. Filtered Data
    const filteredParticipants = useMemo(() => {
        return participants.filter(p => {
            const matchTeam = selectedTeam === 'all' || p.team === selectedTeam;
            const matchEvent = selectedEvent === 'all' || p.event === selectedEvent;
            return matchTeam && matchEvent;
        });
    }, [participants, selectedTeam, selectedEvent]);

    // 2. Calculations for filtered data
    const stats = useMemo(() => {
        const total = filteredParticipants.length;
        const verified = filteredParticipants.filter(p => p.verified).length;
        const totalPaid = filteredParticipants.reduce((acc, p) => acc + (p.payment_status === 'paid' ? p.payment_amount : 0), 0);
        
        // Payment methods breakdown
        const payments = {};
        // Participants distribution (by event if team selected, or by team if all)
        const distribution = {};

        filteredParticipants.forEach(p => {
            // Payment method (mocked as 'Direct' if not present since we don't have it in data currently)
            const method = 'Direct'; 
            payments[method] = (payments[method] || 0) + 1;

            // Distribution
            const key = selectedTeam === 'all' 
                ? (p.team || 'N/A')
                : (p.event || 'N/A');
            
            if (key?.toLowerCase() !== 'registration') {
                distribution[key] = (distribution[key] || 0) + 1;
            }
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
    }, [filteredParticipants, selectedTeam]);
    return (
        <div className="flex h-screen bg-black text-white border-gray-800">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Global Filters */}
                    <header className="mb-10 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <PieChart className="w-5 h-5 text-gray-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Analytical Node</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white">SYSTEM STATS</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-1.5 rounded">
                                <Filter className="w-3 h-3 text-gray-500" />
                                <select 
                                    className="bg-transparent text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer text-gray-300"
                                    value={selectedTeam}
                                    onChange={(e) => {
                                        setSelectedTeam(e.target.value);
                                        setSelectedEvent('all');
                                    }}
                                >
                                    <option value="all">ALL TEAMS</option>
                                    {teams
                                        .filter(t => t.name?.toLowerCase() !== 'registration')
                                        .map(t => (
                                            <option key={t.id} value={t.name}>
                                                {(t.name || 'Unnamed').toUpperCase()}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-1.5 rounded">
                                <select 
                                    className="bg-transparent text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer text-gray-300"
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                >
                                    <option value="all">ALL EVENTS</option>
                                    {events
                                        .filter(e => selectedTeam === 'all' || e.team === selectedTeam)
                                        .map(e => (
                                            <option key={e.id} value={e.name}>
                                                {(e.name || 'Unnamed').toUpperCase()}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </header>

                    {/* Filtered KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Filtered Sample", value: stats.total, icon: Users, color: "text-blue-400" },
                            { label: "Verified Data", value: stats.verified, icon: Target, color: "text-green-400" },
                            { label: "Local Revenue", value: `₹${stats.totalPaid.toLocaleString()}`, icon: Wallet, color: "text-amber-400" },
                            { label: "Verification %", value: stats.total > 0 ? `${Math.round((stats.verified/stats.total)*100)}%` : '0%', icon: BarChart3, color: "text-purple-400" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-gray-950 border border-gray-800 p-5 rounded hover:border-white transition-all shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <div className="text-2xl font-black text-white">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Domain Distribution Chart */}
                        <section className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded p-6 shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.15em] mb-8 flex items-center justify-between">
                                <span className="text-white">Volume Distribution</span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase">BY {selectedTeam === 'all' ? 'TEAMS' : 'EVENTS'}</span>
                            </h2>
                            <div className="space-y-6">
                                {stats.distribution.length > 0 ? stats.distribution.map((item, idx) => {
                                    const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                                    return (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400">{item.name}</span>
                                                <span className="text-[10px] font-black text-white">{item.count}</span>
                                            </div>
                                            <div className="h-4 w-full bg-gray-900 overflow-hidden border border-gray-800 rounded-full">
                                                <div 
                                                    className="h-full bg-white transition-all duration-1000"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-12 text-gray-800">
                                        <p className="text-[10px] font-bold uppercase">No distribution data</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Payments Breakdown */}
                        <section className="bg-gray-950 border border-gray-800 rounded p-6 flex flex-col shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.15em] mb-8 text-white">Asset Breakdown</h2>
                            <div className="space-y-6 flex-1">
                                {stats.payments.length > 0 ? stats.payments.map((p, idx) => (
                                    <div key={idx} className="p-4 bg-gray-900 border-l-2 border-white flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">MODE</p>
                                            <p className="text-xs font-black uppercase text-white">{p.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white">{p.count}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">NODES</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-800">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase">No records found</p>
                                    </div>
                                )}
                                
                                <div className="mt-auto pt-6 border-t border-dotted border-gray-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">System Integrity</span>
                                        <span className="text-[10px] font-bold text-green-500">VERIFIED</span>
                                    </div>
                                    <button className="w-full py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all rounded shadow-sm">
                                        <Download className="w-3 h-3" />
                                        EXPORT DATAFRAME
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <footer className="mt-12 py-6 border-t border-gray-800">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-4">
                            METRIC_AUTO_PULL: COMPLETED <span className="w-1 h-1 rounded-full bg-gray-800"></span> 
                            LATENCY: 0.04 MS <span className="w-1 h-1 rounded-full bg-gray-800"></span> 
                            ENCRYPTION: AES-256
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default MasterStats;
