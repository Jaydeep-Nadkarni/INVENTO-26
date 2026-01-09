import React, { useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Shield, Users, Calendar, Wallet, Activity, Database, TrendingUp, BarChart3 } from 'lucide-react';

const MasterDashboard = () => {
    const { masterStats, events, teams } = useData();

    // Calculate occupancy by club
    const clubOccupancy = useMemo(() => {
        const stats = {};
        events.forEach(event => {
            const club = event.organizing_club || 'General';
            if (!stats[club]) {
                stats[club] = {
                    totalSlots: 0,
                    filledSlots: 0
                };
            }
            stats[club].totalSlots += (event.max_participants || 0);
            stats[club].filledSlots += (event.registered_count || 0);
        });
        
        return Object.entries(stats).map(([name, data]) => ({
            name,
            ...data,
            percentage: data.totalSlots > 0 ? Math.min(100, Math.round((data.filledSlots / data.totalSlots) * 100)) : 0
        })).sort((a, b) => b.percentage - a.percentage);
    }, [events]);

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
                                Global system overview and real-time event analytics
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-900">System Live</span>
                                </div>
                                <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Node ID: INVENTO_M_01</p>
                            </div>
                        </div>
                    </header>

                    {/* Master KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Total Participants", value: masterStats.totalParticipants, icon: Users, color: "text-blue-600" },
                            { label: "Total Events", value: masterStats.totalEvents, icon: Calendar, color: "text-purple-600" },
                            { label: "Admin Network", value: masterStats.totalAdmins, icon: Shield, color: "text-amber-600" },
                            { label: "Total Revenue", value: `₹${masterStats.totalRevenue?.toLocaleString()}`, icon: Wallet, color: "text-green-600" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 p-6 rounded-md shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</h3>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Club Occupancy Distribution */}
                        <section className="lg:col-span-2 bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-4 h-4" />
                                    Club Occupancy Statistics
                                </h2>
                                <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">LIVE SLOTS</span>
                            </div>
                            <div className="space-y-6">
                                {clubOccupancy.map((club, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">{club.name}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">Resources Utilized: {club.filledSlots}/{club.totalSlots}</span>
                                            </div>
                                            <div className="text-xs font-black text-gray-900">
                                                {club.percentage}%
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gray-900 transition-all duration-700 ease-out" 
                                                style={{ width: `${club.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Quick Stats / System Health */}
                        <section className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Team Assets
                            </h2>
                            <div className="space-y-4">
                                {teams.map((team, idx) => (
                                    <div key={idx} className="p-3 border border-gray-100 rounded hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-gray-900 uppercase">{team.team_name}</span>
                                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">DOMAIN: {team.domain}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3 h-3 text-gray-400" />
                                            <span className="text-[10px] text-gray-600">Admins: {team.managed_by.length}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded shadow-sm">
                                System Configuration
                            </button>
                        </section>
                    </div>

                    {/* Security Footer */}
                    <footer className="mt-12 py-6 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            MASTER_NODE_ALPHA_26 © 2026 INVENTO GLOBAL SECURITY
                        </div>
                        <div className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">
                            Global Access Restricted
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default MasterDashboard;
