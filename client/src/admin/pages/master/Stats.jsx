import React from 'react';
import Sidebar from '../../components/sidebar';
import { masterStats, adminDistribution } from '../../data/masterData';
import { PieChart, TrendingUp, Cpu, Zap, Activity, Info } from 'lucide-react';

const MasterStats = () => {
    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <PieChart className="w-6 h-6" />
                                Global Analytics Hub
                            </h1>
                            <p className="text-sm text-gray-500">Cross-platform metrics, system health, and overall performance</p>
                        </div>
                    </header>

                    {/* Top Level KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Check-in Efficiency", value: "88%", icon: Zap, color: "text-amber-600" },
                            { label: "Revenue Target", value: "102%", icon: TrendingUp, color: "text-green-600" },
                            { label: "Active Nodes", value: masterStats.activeNodes, icon: Cpu, color: "text-blue-600" },
                            { label: "System Latency", value: "12ms", icon: Activity, color: "text-purple-600" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 p-6 rounded-md shadow-sm group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</h3>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Team Wise Breakdown */}
                        <section className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8 border-l-4 border-gray-900 pl-4">
                                Registration Load by Team
                            </h2>
                            <div className="space-y-8">
                                {adminDistribution.map((team, idx) => {
                                    const maxCapacity = 500;
                                    const percentage = Math.round((team.participants / maxCapacity) * 100);
                                    return (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-bold text-gray-900 uppercase tracking-tighter">{team.team}</span>
                                                <span className="text-[10px] text-gray-400 font-bold">{team.participants} / {maxCapacity}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gray-900"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Node Verification Section */}
                        <section className="bg-gray-50 border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                            <div className="mb-6 text-center">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">Live Node Verification</h2>
                                <p className="text-xs text-gray-500 font-medium">Real-time status of event sub-nodes</p>
                            </div>

                            <div className="w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center relative mb-8">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-gray-900">27</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Nodes</p>
                                </div>
                                <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] rotate-[-90deg]">
                                    <circle 
                                        cx="50%" cy="50%" r="50%" 
                                        className="fill-none stroke-gray-900 stroke-[4px]" 
                                        strokeDasharray="283" 
                                        strokeDashoffset="30"
                                    />
                                </svg>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                <div className="p-4 bg-white border border-gray-100 rounded-md text-center shadow-sm">
                                    <p className="text-lg font-bold text-gray-900 italic">24</p>
                                    <p className="text-[10px] text-green-600 font-bold uppercase">Online</p>
                                </div>
                                <div className="p-4 bg-white border border-gray-100 rounded-md text-center shadow-sm">
                                    <p className="text-lg font-bold text-gray-900 italic">3</p>
                                    <p className="text-[10px] text-amber-600 font-bold uppercase">Syncing</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* System Info */}
                    <div className="mt-12 flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
                        <Info className="w-5 h-5 text-blue-600 shrink-0" />
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">
                            Global metrics are aggregated every 60 seconds from all team domains. Revenue figures are subject to final verification from the accounts team. Latency measurements are taken from the primary Bangalore-1 data center node.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterStats;

export default MasterStats;
