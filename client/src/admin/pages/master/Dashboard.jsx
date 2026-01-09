import React from 'react';
import Sidebar from '../../components/sidebar';
import { masterStats, adminDistribution, globalRecentActivity } from '../../data/masterData';
import { Shield, Users, Calendar, Wallet, Activity, Database } from 'lucide-react';

const MasterDashboard = () => {
    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Master Header */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <Shield className="w-6 h-6 text-gray-900" />
                                Master Control Panel
                            </h1>
                            <p className="text-sm text-gray-500">
                                Global system overview and team resource distribution
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-gray-900">System Healthy</span>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">Uptime: 4d 12h 32m</p>
                            </div>
                        </div>
                    </header>

                    {/* Master KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Total Registrations", value: masterStats.totalParticipants, icon: Users, color: "text-blue-600" },
                            { label: "Active Events", value: masterStats.totalEvents, icon: Calendar, color: "text-purple-600" },
                            { label: "Authorized Admins", value: masterStats.totalAdmins, icon: Shield, color: "text-amber-600" },
                            { label: "Global Revenue", value: masterStats.totalRevenue, icon: Wallet, color: "text-green-600" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 p-6 rounded-md group hover:border-gray-300 transition-all shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</h3>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Team Distribution */}
                        <section className="lg:col-span-2 bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-4 h-4" />
                                    Resource Distribution
                                </h2>
                                <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">BY TEAMS</span>
                            </div>
                            <div className="space-y-6">
                                {adminDistribution.map((dist, idx) => {
                                    const percent = Math.round((dist.participants / masterStats.totalParticipants) * 100);
                                    return (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-gray-900">{dist.team}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 font-medium">
                                                    {dist.admins} Admins <span className="mx-1 text-gray-300">|</span> {dist.participants} Participants
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gray-900 transition-all duration-500" 
                                                    style={{ width: `${percent * 2}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Recent Alerts / Activity */}
                        <section className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Global Activity
                            </h2>
                            <div className="space-y-1">
                                {globalRecentActivity.map((activity) => (
                                    <div key={activity.id} className="p-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors cursor-default rounded">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">{activity.action}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{activity.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium">{activity.user}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 italic">Ref: {activity.target}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-900 uppercase tracking-widest transition-all rounded">
                                View Full Activity Log
                            </button>
                        </section>
                    </div>

                    {/* Security Footer */}
                    <footer className="mt-12 py-6 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            MASTER_NODE_ALPHA_26 © 2026 INVENTO GLOBAL SECURITY
                        </div>
                        <div className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">
                            Authorized Access Only
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default MasterDashboard;

export default MasterDashboard;
