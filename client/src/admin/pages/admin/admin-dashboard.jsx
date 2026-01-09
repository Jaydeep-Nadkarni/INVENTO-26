import React from 'react';
import Sidebar from '../../components/sidebar';
import { adminStats, recentActivities } from '../../data/adminData';
import { useAdminAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { adminUser } = useAdminAuth();

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-12 border-b border-white/5 pb-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Operational Terminal</p>
                                <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                    Welcome, <span className="text-red-700 not-italic">{adminUser?.email?.split('@')[0]}</span>
                                </h1>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-600 uppercase">System Status: <span className="text-green-900 animate-pulse">Online</span></p>
                                <p className="text-[10px] text-gray-600 uppercase mt-1">Role: Admin ({adminStats.team})</p>
                            </div>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-[#111] border border-white/5 p-6 relative group hover:border-red-700/50 transition-colors">
                            <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center opacity-10">
                                <i className="fas fa-users text-2xl"></i>
                            </div>
                            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-4">Assigned Team</h3>
                            <p className="text-2xl font-serif text-white tracking-widest uppercase italic">{adminStats.team}</p>
                            <div className="mt-4 h-1 w-full bg-white/5 overflow-hidden">
                                <div className="h-full bg-red-700 w-[65%]"></div>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 p-6 relative group hover:border-red-700/50 transition-colors">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-4">Active Participants</h3>
                            <p className="text-4xl font-serif text-white">{adminStats.totalParticipants}</p>
                            <p className="text-[8px] mt-2 text-green-900 uppercase font-black">+14 from last hour</p>
                        </div>

                        <div className="bg-[#111] border border-white/5 p-6 relative group hover:border-red-700/50 transition-colors">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-4">Manageable Events</h3>
                            <p className="text-4xl font-serif text-white">{adminStats.totalEvents}</p>
                            <p className="text-[8px] mt-2 text-gray-700 uppercase">Across 2 main stages</p>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <section>
                            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-white mb-6 flex items-center">
                                <span className="w-2 h-2 bg-red-700 mr-3"></span>
                                Recent Telemetry
                            </h2>
                            <div className="space-y-1">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="group flex items-center justify-between p-4 bg-[#0d0d0d] border-l-2 border-transparent hover:border-red-700 hover:bg-[#111] transition-all cursor-crosshair">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[8px] text-gray-700">{activity.time}</span>
                                            <div>
                                                <p className="text-[10px] text-gray-300 uppercase tracking-widest">{activity.user}</p>
                                                <p className="text-[9px] text-gray-600">{activity.action}</p>
                                            </div>
                                        </div>
                                        <div className="text-[8px] text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">PID: {activity.id * 1024}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-[#0d0d0d] border border-white/5 p-8 flex flex-col items-center justify-center text-center">
                             <div className="w-16 h-16 rounded-full border border-dashed border-red-700/30 flex items-center justify-center mb-6 animate-spin-slow">
                                 <div className="w-12 h-12 rounded-full border border-red-700 flex items-center justify-center animate-pulse">
                                     <div className="w-2 h-2 bg-red-700"></div>
                                 </div>
                             </div>
                             <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">Live Signal Terminal</h3>
                             <p className="text-[9px] text-gray-600 max-w-xs">Scan active for nearby participant devices. Team {adminStats.team} has priorities in sub-node Stage 1.</p>
                             <button className="mt-8 px-6 py-2 border border-red-700/30 text-[10px] text-red-700 uppercase tracking-[0.3em] hover:bg-red-700/10 transition-colors">
                                 Sync New Data
                             </button>
                        </section>
                    </div>

                    {/* Footer / System Info */}
                    <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] text-gray-800 tracking-widest uppercase">
                        <div>Invento '26 Admin Terminal v1.0.4 - Internal Use Only</div>
                        <div>Encrypted Connection via SSL/TLS</div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
