import React, { useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Shield, Users, Calendar, Wallet, Database, Activity, TrendingUp } from 'lucide-react';

const MasterDashboard = () => {
    const { data } = useData();

    // Defensive extraction
    const events = data?.events || [];
    const overviewStats = data?.overviewStats || {};
    const masterStats = data?.masterStats || {
        totalParticipants: 0,
        totalEvents: 0,
        totalAdmins: 0,
        totalRevenue: "₹0",
        systemHealth: "Initializing",
        activeNodes: 0
    };

    // Use backend-provided club unique stats if available, otherwise might need fallback or wait
    const clubUniqueStats = overviewStats?.clubUnique || [];
    const filteredClubs = useMemo(() => 
        clubUniqueStats.filter(s => s.club?.toLowerCase() !== 'registration'),
    [clubUniqueStats]);

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
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar panelType="master" />

            <main className="flex-1 flex overflow-hidden lg:ml-64">
                {/* Center Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto space-y-10">

                        {/* Header */}
                        <header className="flex justify-between items-end border-b border-gray-200 pb-6">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                                    Master Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    Overview & Real-time Analytics
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    System Live
                                </span>
                            </div>
                        </header>

                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Participants", value: masterStats.totalParticipants, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Active Events", value: masterStats.totalEvents, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
                                { label: "Admins", value: masterStats.totalAdmins, icon: Shield, color: "text-amber-600", bg: "bg-amber-50" },
                                { label: "Revenue", value: masterStats.totalRevenue, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                        <TrendingUp className="w-4 h-4 text-gray-300" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs font-medium text-gray-400 uppercase mt-1 tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Club Occupancy Section */}
                        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-gray-400" />
                                    Slot Occupancy
                                </h2>
                                <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    Live Updates
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {clubOccupancy.map((club, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-800">{club.name}</h3>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {club.filledSlots} <span className="text-gray-300">/</span> {club.totalSlots} Slots
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{club.percentage}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${club.percentage >= 90 ? 'bg-red-500' :
                                                        club.percentage >= 70 ? 'bg-amber-500' :
                                                            'bg-gray-900'
                                                    }`}
                                                style={{ width: `${club.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {clubOccupancy.length === 0 && (
                                    <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
                                        No occupancy data available.
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>

                    {/* Footer */}
                    <footer className="max-w-5xl mx-auto mt-16 pt-8 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
                        <p>© 2026 INVENTO Master Control</p>
                        <p className="font-mono">v2.4.0-stable</p>
                    </footer>
                </div>

                {/* Right Sidebar - Unique Participants */}
                <aside className="w-80 bg-white border-l border-gray-200 hidden xl:flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Database className="w-4 h-4 text-gray-400" />
                            Participants
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Unique individuals per club</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-1">
                            {filteredClubs.length > 0 ? (
                                filteredClubs.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                                                {idx + 1}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{stat.club}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                            {stat.count}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-400">No metrics available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Action / Status */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <h4 className="text-blue-900 font-semibold text-sm mb-1">Total Reach</h4>
                            <p className="text-blue-700 text-xs leading-relaxed">
                                Aggregated count of unique student participation across all club verticals.
                            </p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default MasterDashboard;
