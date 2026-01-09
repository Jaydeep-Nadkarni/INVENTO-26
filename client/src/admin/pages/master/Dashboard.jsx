import React, { useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Shield, Users, Calendar, Wallet, Activity, Database } from 'lucide-react';

const MasterDashboard = () => {
    const { data } = useData();
    
    // Defensive extraction
    const events = data?.events || [];
    const masterStats = data?.masterStats || {
        totalParticipants: 0,
        totalEvents: 0,
        totalAdmins: 0,
        totalRevenue: "₹0",
        systemHealth: "Initializing",
        activeNodes: 0
    };
    const adminDistribution = data?.adminDistribution || [];

    // Calculate occupancy by club
    const clubOccupancy = useMemo(() => {
        const stats = {};
        events.forEach(event => {
            const club = event.team || 'General';
            // Explicitly exclude Registration from occupancy stats (case-insensitive)
            if (club.toLowerCase() === 'registration') return;

            if (!stats[club]) {
                stats[club] = {
                    totalSlots: 0,
                    filledSlots: 0
                };
            }
            stats[club].totalSlots += (event.total_slots || 0);
            stats[club].filledSlots += (event.reserved_slots || 0);
        });
        
        return Object.entries(stats).map(([name, data]) => ({
            name,
            ...data,
            percentage: data.totalSlots > 0 ? Math.min(100, Math.round((data.filledSlots / data.totalSlots) * 100)) : 0
        })).sort((a, b) => b.percentage - a.percentage);
    }, [events]);

    return (
        <div className="flex h-screen bg-black text-white border-gray-800">
            <Sidebar panelType="master" />
            
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Master Header */}
                    <header className="mb-8 border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <Shield className="w-6 h-6 text-white" />
                                Master Control Panel
                            </h1>
                            <p className="text-sm text-gray-400">
                                Global system overview and real-time event analytics
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-sm font-medium text-white">System Live</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Node ID: INVENTO_M_01</p>
                            </div>
                        </div>
                    </header>

                    {/* Master KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Total Participants", value: masterStats.totalParticipants, icon: Users, color: "text-blue-400" },
                            { label: "Total Events", value: masterStats.totalEvents, icon: Calendar, color: "text-purple-400" },
                            { label: "Admin Network", value: masterStats.totalAdmins, icon: Shield, color: "text-amber-400" },
                            { label: "Total Revenue", value: masterStats.totalRevenue, icon: Wallet, color: "text-green-400" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-gray-950 border border-gray-800 p-6 rounded-md shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</h3>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Club Occupancy Distribution */}
                        <section className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded-md p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-4 h-4" />
                                    Club Occupancy Statistics
                                </h2>
                                <span className="text-[10px] font-bold px-2 py-1 bg-gray-900 text-gray-400 rounded">LIVE SLOTS</span>
                            </div>
                            <div className="space-y-6">
                                {clubOccupancy.map((club, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white uppercase tracking-tight">{club.name}</span>
                                                <span className="text-[10px] text-gray-500 font-medium">Resources Utilized: {club.filledSlots}/{club.totalSlots}</span>
                                            </div>
                                            <div className="text-xs font-black text-white">
                                                {club.percentage}%
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 transition-all duration-700 ease-out" 
                                                style={{ width: `${club.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                {clubOccupancy.length === 0 && (
                                    <p className="text-xs text-gray-500 text-center py-4 italic text-wrap">No active event data available</p>
                                )}
                            </div>
                        </section>

                        {/* Quick Stats / System Health */}
                        <section className="bg-gray-950 border border-gray-800 rounded-md p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Team Assets
                            </h2>
                            <div className="space-y-4">
                                {adminDistribution
                                    ?.filter(dist => dist.team?.toLowerCase() !== 'registration')
                                    .map((dist, idx) => (
                                    <div key={idx} className="p-3 border border-gray-900 rounded hover:bg-gray-900 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-white uppercase">{dist.team}</span>
                                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis uppercase">Domain Node</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3 h-3 text-gray-500" />
                                                <span className="text-[10px] text-gray-400">Admins: {dist.admins}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Database className="w-3 h-3 text-gray-500" />
                                                <span className="text-[10px] text-gray-400">Reg: {dist.participants}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {adminDistribution?.length === 0 && (
                                    <p className="text-xs text-gray-400 text-center py-4 italic text-wrap">No team distribution data found</p>
                                )}
                            </div>
                            <button className="w-full mt-6 py-2 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded shadow-sm">
                                System Configuration
                            </button>
                        </section>
                    </div>

                    {/* Security Footer */}
                    <footer className="mt-12 py-6 border-t border-gray-800 flex justify-between items-center">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            MASTER_NODE_ALPHA_26 © 2026 INVENTO GLOBAL SECURITY
                        </div>
                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                            Global Access Restricted
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default MasterDashboard;
