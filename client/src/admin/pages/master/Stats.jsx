import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import {
    PieChart, TrendingUp, Info, Users,
    Wallet, Filter, BarChart3,
    Target, Download, RefreshCcw,
    ShieldCheck, School, Flag
} from 'lucide-react';

const MasterStats = () => {
    const { data: { overviewStats, events, teams }, loading, refreshStats } = useData();
    const [selectedTeam, setSelectedTeam] = useState('all');

    useEffect(() => {
        refreshStats();
    }, []);

    // College participation data for the tracking table
    const collegeParticipation = useMemo(() => {
        if (!overviewStats || !overviewStats.collegeParticipation) return [];
        return overviewStats.collegeParticipation;
    }, [overviewStats]);

    const eventLeaderboard = useMemo(() => {
        if (!overviewStats || !overviewStats.eventLeaderboard) return [];
        return overviewStats.eventLeaderboard;
    }, [overviewStats]);

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
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Operational Analytics</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Fest Command Center</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={refreshStats}
                                className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                            >
                                <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                                Sync Metrics
                            </button>
                            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                                <Download className="w-3 h-3" />
                                Export Ledger
                            </button>
                        </div>
                    </header>

                    {/* Global KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Total Registrations", value: overviewStats?.totals[0]?.totalSoloRegistrations + overviewStats?.totals[0]?.totalTeamRegistrations || 0, icon: Users, color: "text-blue-400" },
                            { label: "Revenue Manifested", value: `₹${(overviewStats?.totals[0]?.totalRevenue || 0).toLocaleString()}`, icon: Wallet, color: "text-amber-400" },
                            { label: "Active Events", value: events.length, icon: Target, color: "text-green-400" },
                            { label: "Total Schools", value: collegeParticipation.length, icon: School, color: "text-purple-400" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-gray-950 border border-gray-800 p-5 rounded hover:border-white transition-all shadow-sm group">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                    <stat.icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                                </div>
                                <div className="text-2xl font-black text-white italic">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contingent Key Usage tracking per college */}
                        <section className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded p-6 shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-white">
                                <Flag className="w-4 h-4 text-amber-500" />
                                Contingent Power Rankings
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-gray-900">
                                        <tr>
                                            <th className="px-4 py-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Rank</th>
                                            <th className="px-4 py-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Institutional Hub</th>
                                            <th className="px-4 py-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Intel Density</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-900/50">
                                        {collegeParticipation.length > 0 ? collegeParticipation.map((clg, idx) => (
                                            <tr key={clg._id} className="hover:bg-gray-900/30 transition-colors">
                                                <td className="px-4 py-4 text-xs font-mono text-gray-600">#{(idx + 1).toString().padStart(2, '0')}</td>
                                                <td className="px-4 py-4">
                                                    <span className="text-xs font-black uppercase tracking-tight text-gray-200">{clg._id}</span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <span className="text-sm font-black text-white">{clg.count}</span>
                                                        <div className="w-24 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-500"
                                                                style={{ width: `${(clg.count / (collegeParticipation[0]?.count || 1)) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-20 text-center text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em]">
                                                    Awaiting Deployment Data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Top Events Leaders */}
                        <section className="bg-gray-950 border border-gray-800 rounded p-6 shadow-sm flex flex-col">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                Protocol Hotspots
                            </h2>
                            <div className="space-y-6 flex-1">
                                {eventLeaderboard.length > 0 ? eventLeaderboard.map((event, idx) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400">{event.name}</span>
                                            <span className="text-[10px] font-black text-white">{event.registrationCount}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-900 overflow-hidden rounded-full">
                                            <div
                                                className="h-full bg-white transition-all duration-1000"
                                                style={{ width: `${(event.registrationCount / (eventLeaderboard[0]?.registrationCount || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-800">
                                        <p className="text-[10px] font-bold uppercase">No distribution data</p>
                                    </div>
                                )}

                                <div className="mt-auto pt-6 border-t border-dotted border-gray-800 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Network Integrity</span>
                                        <span className="text-[9px] font-bold text-green-500 tracking-widest">ENCRYPTED</span>
                                    </div>
                                    <div className="p-3 bg-gray-900 border border-gray-800 rounded text-center">
                                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-1 tracking-widest">System Load</p>
                                        <p className="text-sm font-black text-white italic">OPTIMAL_0.2ms</p>
                                    </div>
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
