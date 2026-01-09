import React from 'react';
import Sidebar from '../../components/sidebar';
import { adminStats, eventAttendanceStats } from '../../data/adminData';

const AdminStats = () => {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Metrics</p>
                            <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                Event <span className="text-red-700 not-italic">Analytics</span>
                            </h1>
                        </div>
                    </header>

                    {/* Overall Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-[#0d0d0d] border border-white/5 p-6 border-l-2 border-l-red-700">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2">Registration Goal</h3>
                            <p className="text-3xl font-serif text-white italic">74%</p>
                        </div>
                        <div className="bg-[#0d0d0d] border border-white/5 p-6 border-l-2 border-l-red-900">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2">Verification Rate</h3>
                            <p className="text-3xl font-serif text-white italic">92%</p>
                        </div>
                        <div className="bg-[#0d0d0d] border border-white/5 p-6 border-l-2 border-l-red-700">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2">Avg Attendance</h3>
                            <p className="text-3xl font-serif text-white italic">68%</p>
                        </div>
                        <div className="bg-[#0d0d0d] border border-white/5 p-6 border-l-2 border-l-red-900">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2">System Load</h3>
                            <p className="text-3xl font-serif text-white italic">Nominal</p>
                        </div>
                    </div>

                    {/* Breakdown per Event */}
                    <div className="grid grid-cols-1 gap-8">
                        <section>
                            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-white mb-8 flex items-center">
                                <span className="w-2 h-2 bg-red-700 mr-3 animate-pulse"></span>
                                Attendance Breakdown
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {eventAttendanceStats.map((stat, index) => {
                                    const percentage = Math.round((stat.present / stat.total) * 100);
                                    return (
                                        <div key={index} className="bg-[#111] border border-white/5 p-8 relative overflow-hidden group">
                                            <div className="relative z-10 flex justify-between items-center mb-6">
                                                <div>
                                                    <h3 className="text-lg font-serif text-white uppercase italic tracking-wider">{stat.event}</h3>
                                                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-1">
                                                        {stat.present} Present / {stat.total} Total
                                                    </p>
                                                </div>
                                                <div className="text-2xl font-black text-red-700 font-serif">{percentage}%</div>
                                            </div>
                                            
                                            {/* Progress Bar Container */}
                                            <div className="h-1.5 w-full bg-white/5 overflow-hidden rounded-full">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-1000 group-hover:brightness-125"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>

                                            {/* Background Decoration */}
                                            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                                <div className="text-6xl font-black">{index + 1}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="bg-red-900/5 border border-red-900/10 p-8">
                             <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 border border-red-700/30 flex items-center justify-center text-red-700 font-bold shrink-0">!</div>
                                 <div>
                                     <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white mb-2">Automatic Sync Warning</h3>
                                     <p className="text-[9px] text-gray-600 leading-relaxed max-w-2xl">
                                         Telemetry data is synchronized every 15 minutes. Manual overrides performed at the sub-nodes (Stage 1, Stage 2) may take time to propagate to the central registry. Ensure all handheld scanners are connected to the INVENTO internal mesh network.
                                     </p>
                                 </div>
                             </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminStats;
