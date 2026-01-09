import React from 'react';
import Sidebar from '../../components/sidebar';
import { masterStats, adminDistribution, globalRecentActivity } from '../../data/masterData';

const MasterDashboard = () => {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar panelType="master" />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Master Header */}
                    <header className="mb-12 border-b border-red-900/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end bg-gradient-to-r from-red-900/5 to-transparent p-6 border-l-4 border-l-red-800 gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.6em] text-red-700 font-bold mb-3">Central Intelligence Console</p>
                            <h1 className="text-4xl font-serif text-white uppercase tracking-tighter italic font-black">
                                Master <span className="text-red-700 not-italic">Control</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-start md:justify-end gap-3 mb-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">System Status: {masterStats.systemHealth}</p>
                            </div>
                            <p className="text-[9px] text-gray-700 uppercase">Uptime: 4d 12h 32m</p>
                        </div>
                    </header>

                    {/* Master KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Global Registrations", value: masterStats.totalParticipants, icon: "fas fa-users" },
                            { label: "Total Active Events", value: masterStats.totalEvents, icon: "fas fa-calendar-check" },
                            { label: "Authorized Admins", value: masterStats.totalAdmins, icon: "fas fa-user-shield" },
                            { label: "Global Revenue", value: masterStats.totalRevenue, icon: "fas fa-wallet" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-[#0d0d0d] border border-white/5 p-6 hover:border-red-800 transition-all group relative overflow-hidden">
                                <div className="absolute -right-2 -bottom-2 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                    <i className={`${stat.icon} text-6xl rotate-12`}></i>
                                </div>
                                <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-4">{stat.label}</h3>
                                <p className="text-4xl font-serif text-white font-black">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Team Distribution */}
                        <section className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 p-8">
                            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-white mb-8 flex items-center gap-4">
                                <span className="h-px w-8 bg-red-700"></span>
                                Sector Distribution
                            </h2>
                            <div className="space-y-6">
                                {adminDistribution.map((dist, idx) => {
                                    const percent = Math.round((dist.participants / masterStats.totalParticipants) * 100);
                                    return (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-red-800 text-xs font-black">0{idx + 1}</span>
                                                    <span className="text-sm font-serif text-gray-300 uppercase tracking-widest">{dist.team}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-600">
                                                    {dist.admins} Admins | {dist.participants} Participants
                                                </div>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 overflow-hidden">
                                                <div 
                                                    className="h-full bg-red-800" 
                                                    style={{ width: `${percent * 2}%` }} // Adjusted for visualization
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Recent Alerts / Activity */}
                        <section className="bg-[#0d0d0d] border border-white/5 p-8 border-t-4 border-t-red-900">
                            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-white mb-8 flex items-center">
                                <i className="fas fa-satellite-dish mr-3 text-red-700 animate-pulse"></i>
                                Global Signal
                            </h2>
                            <div className="space-y-4">
                                {globalRecentActivity.map((activity) => (
                                    <div key={activity.id} className="p-4 bg-[#111]/50 border-l border-red-900/50 hover:bg-red-900/5 transition-colors cursor-help group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-tighter">{activity.action}</span>
                                            <span className="text-[8px] text-gray-700">{activity.time}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-300 uppercase leading-none">{activity.user}</p>
                                        <p className="text-[9px] text-gray-600 mt-1 italic group-hover:text-red-900/60 transition-colors">Target: {activity.target}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 border border-red-900/20 text-[9px] uppercase tracking-[0.3em] hover:bg-red-900/10 transition-all text-red-900 font-black">
                                Fetch Full Log
                            </button>
                        </section>
                    </div>

                    {/* Security Footer */}
                    <footer className="mt-20 pt-8 border-t border-red-900/10 flex justify-between items-center opacity-30 group hover:opacity-100 transition-opacity">
                        <div className="text-[8px] uppercase tracking-[0.6em] text-gray-700">
                            Authorized Access Terminal: MASTER_NODE_ALPHA_26
                        </div>
                        <div className="flex gap-4 grayscale">
                            <div className="w-12 h-4 bg-gray-900"></div>
                            <div className="w-20 h-4 bg-gray-900"></div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default MasterDashboard;
