import React from 'react';
import Sidebar from '../../components/sidebar';
import { masterStats, adminDistribution } from '../../data/masterData';

const MasterStats = () => {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-red-900/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Metrics Hub</p>
                            <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                Global <span className="text-red-700 not-italic">Analytics</span>
                            </h1>
                        </div>
                    </header>

                    {/* Top Level KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Check-in Efficiency", value: "88%", trend: "up" },
                            { label: "Revenue Target", value: "102%", trend: "up" },
                            { label: "Active Nodes", value: masterStats.activeNodes, trend: "stable" },
                            { label: "System Latency", value: "12ms", trend: "down" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-[#0d0d0d] border border-white/5 p-6 relative group">
                                <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-3">{stat.label}</h3>
                                <p className="text-3xl font-serif text-white italic">{stat.value}</p>
                                <div className="absolute top-4 right-4 text-[8px] font-black uppercase text-red-900/30 group-hover:text-red-700 transition-colors">
                                    {stat.trend === 'up' && '▲ POSITIVE'}
                                    {stat.trend === 'down' && '▼ MINIMAL'}
                                    {stat.trend === 'stable' && '● NOMINAL'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Team Wise Breakdown */}
                        <section>
                            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-white mb-8 border-l-2 border-red-700 pl-4">
                                Sector Capacity
                            </h2>
                            <div className="bg-[#0d0d0d] border border-white/5 p-4 md:p-8 space-y-8">
                                {adminDistribution.map((team, idx) => {
                                    const maxCapacity = 500;
                                    const percentage = Math.round((team.participants / maxCapacity) * 100);
                                    return (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">{team.team}</span>
                                                <span className="text-[10px] text-gray-600 font-black">{team.participants} / {maxCapacity} UNITS</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-red-900 to-red-600"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Event Distribution Chart Placeholder */}
                        <section>
                            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-white mb-8 border-l-2 border-red-700 pl-4">
                                Node Verification
                            </h2>
                            <div className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-48 h-48 rounded-full border border-dashed border-red-900/30 flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 border-r-4 border-red-700 rounded-full animate-spin-slow"></div>
                                    <div className="text-center">
                                        <p className="text-4xl font-serif text-white font-black italic">27</p>
                                        <p className="text-[8px] uppercase tracking-[0.3em] text-gray-600 font-bold">Live Streams</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="p-4 bg-white/5 border border-white/5">
                                        <p className="text-lg font-serif text-white italic">24/27</p>
                                        <p className="text-[8px] text-gray-600 uppercase font-black">Synced</p>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/5">
                                        <p className="text-lg font-serif text-red-700 italic">3/27</p>
                                        <p className="text-[8px] text-gray-600 uppercase font-black">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterStats;
