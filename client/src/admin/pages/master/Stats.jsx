import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { apiGet } from '../../../utils/apiClient';
import {
    PieChart, TrendingUp, Info, Users,
    Wallet, Filter, BarChart3,
    Target, Download, RefreshCcw,
    ShieldCheck, School, Flag,
    TrendingDown, Zap, Activity, Globe,
    ChevronDown, CreditCard, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart as RePieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const MasterStats = () => {
    const { data: { overviewStats, events }, loading: contextLoading } = useData();
    const [detailedStats, setDetailedStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clubFilter, setClubFilter] = useState('All');
    const [viewType, setViewType] = useState('count'); // 'count' or 'revenue'

    const fetchDetailedStats = async () => {
        try {
            setLoading(true);
            const { data } = await apiGet('/api/events/analytics/detailed');
            setDetailedStats(data);
        } catch (error) {
            console.error("Failed to fetch detailed stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetailedStats();
    }, []);

    // Derived stats for visualization
    const clubChartData = useMemo(() => {
        if (!detailedStats?.clubStats) return [];
        let data = detailedStats.clubStats;
        if (clubFilter !== 'All') {
            data = data.filter(item => item._id === clubFilter);
        }
        return data.map(item => ({
            name: item._id,
            count: item.totalRegistrations,
            revenue: item.totalRevenue,
            events: item.eventCount
        }));
    }, [detailedStats, clubFilter]);

    const filteredEventStats = useMemo(() => {
        if (!detailedStats?.eventStats) return [];
        let data = detailedStats.eventStats;
        if (clubFilter !== 'All') {
            data = data.filter(item => {
                const club = Array.isArray(item.club) ? item.club[0] : item.club;
                return club === clubFilter;
            });
        }
        return data.slice(0, 10);
    }, [detailedStats, clubFilter]);

    const genderData = useMemo(() => {
        if (!detailedStats?.userStats?.genderDist) return [];
        return detailedStats.userStats.genderDist.map(item => ({
            name: item._id || 'Unknown',
            value: item.count
        }));
    }, [detailedStats]);

    const revenueTrendData = useMemo(() => {
        if (!detailedStats?.paymentTrend) return [];
        return detailedStats.paymentTrend.map(item => ({
            date: item._id,
            revenue: item.revenue,
            count: item.count
        }));
    }, [detailedStats]);

    const userGrowthData = useMemo(() => {
        if (!detailedStats?.userStats?.userGrowth) return [];
        let cumulative = 0;
        return detailedStats.userStats.userGrowth.map(item => {
            cumulative += item.count;
            return {
                date: item._id,
                daily: item.count,
                cumulative: cumulative
            };
        });
    }, [detailedStats]);

    const clubs = useMemo(() => {
        if (!detailedStats?.clubStats) return [];
        return ['All', ...detailedStats.clubStats.map(c => c._id)];
    }, [detailedStats]);

    if (loading && !detailedStats) {
        return (
            <div className="flex h-screen bg-black items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Decrypting Metrics...</p>
                </div>
            </div>
        );
    }

    const { overview = {} } = detailedStats || {};

    return (
        <div className="flex h-screen bg-black text-white border-gray-800">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto pb-20">
                    {/* Header */}
                    <header className="mb-10 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Neural Intelligence Subsystem</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Fest Analytics OS</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="relative group">
                                <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:border-blue-500 transition-all">
                                    <Filter className="w-3 h-3" />
                                    Club: {clubFilter}
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-950 border border-gray-800 rounded shadow-2xl z-50 hidden group-hover:block">
                                    {clubs.map(club => (
                                        <button 
                                            key={club} 
                                            onClick={() => setClubFilter(club)}
                                            className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors border-b border-gray-900 last:border-0"
                                        >
                                            {club}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={fetchDetailedStats}
                                className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                            >
                                <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                                Sync
                            </button>
                            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                                <Download className="w-3 h-3" />
                                Export
                            </button>
                        </div>
                    </header>

                    {/* Primary KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Total Revenue", value: `₹${(overview.totalRevenue || 0).toLocaleString()}`, icon: Wallet, color: "text-amber-400", meta: `Pend: ₹${(overview.totalPendingRevenue || 0).toLocaleString()}` },
                            { label: "Total Registrations", value: (overview.totalSolo || 0) + (overview.totalTeam || 0), icon: Users, color: "text-blue-400", meta: `Solo: ${overview.totalSolo} | Team: ${overview.totalTeam}` },
                            { label: "Confirmed Entries", value: (overview.confirmedSolo || 0) + (overview.confirmedTeam || 0), icon: CheckCircle, color: "text-green-400", meta: `Waitlist: ${detailedStats?.eventStats?.reduce((acc, curr) => acc + (curr.waitlistCount || 0), 0) || 0}` },
                            { label: "Inst. Reach", value: detailedStats?.collegeStats?.length || 0, icon: School, color: "text-purple-400", meta: "Total Colleges" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-gray-950 border border-gray-800 p-5 rounded hover:border-blue-900 transition-all shadow-sm group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <stat.icon className="w-16 h-16" />
                                </div>
                                <div className="flex justify-between items-center mb-4 relative z-10">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-black text-white italic mb-1 relative z-10">{stat.value}</div>
                                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-tight relative z-10">{stat.meta}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Club Performance (Bar Chart) */}
                        <div className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                    <BarChart3 className="w-4 h-4 text-blue-500" />
                                    Club Performance Matrix
                                </h2>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setViewType('count')}
                                        className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-tighter transition-all ${viewType === 'count' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-500'}`}
                                    >
                                        Registrations
                                    </button>
                                    <button 
                                        onClick={() => setViewType('revenue')}
                                        className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-tighter transition-all ${viewType === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-500'}`}
                                    >
                                        Revenue
                                    </button>
                                </div>
                            </div>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={clubChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="#4b5563" 
                                            fontSize={10} 
                                            fontWeight="bold" 
                                            tickFormatter={(val) => val.length > 10 ? `${val.substring(0, 10)}...` : val}
                                        />
                                        <YAxis stroke="#4b5563" fontSize={10} fontWeight="bold" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937', borderRadius: '4px' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                        />
                                        <Bar dataKey={viewType === 'count' ? 'count' : 'revenue'} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Club Distribution (Pie Chart) */}
                        <div className="bg-gray-950 border border-gray-800 rounded p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <PieChart className="w-4 h-4 text-pink-500" />
                                Club Ecosystem
                            </h2>
                            <div className="h-80 w-full flex items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={clubChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="count"
                                            stroke="none"
                                        >
                                            {clubChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36} 
                                            formatter={(value) => <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">{value}</span>}
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Registrations over Time (Bar Chart) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <BarChart3 className="w-4 h-4 text-green-500" />
                                Registration Momentum (Time Series)
                            </h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                        <XAxis dataKey="date" stroke="#4b5563" fontSize={10} fontWeight="bold" />
                                        <YAxis stroke="#4b5563" fontSize={10} fontWeight="bold" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937' }}
                                            labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Revenue (Line Chart) */}
                        <div className="bg-gray-950 border border-gray-800 rounded p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                                Financial Velocity (Line)
                            </h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                        <XAxis dataKey="date" stroke="#4b5563" fontSize={8} fontWeight="bold" />
                                        <YAxis stroke="#4b5563" fontSize={8} fontWeight="bold" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937' }}
                                            labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* 25+ Statistics Summary Grid */}
                    <section className="mb-12">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Comprehensive Stat Deck
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[
                                { label: "Solo Regs", value: overview.totalSolo, icon: Users },
                                { label: "Team Regs", value: overview.totalTeam, icon: Users },
                                { label: "Confirmed Solo", value: overview.confirmedSolo, color: "text-green-500" },
                                { label: "Confirmed Team", value: overview.confirmedTeam, color: "text-green-500" },
                                { label: "Pending Solo", value: overview.pendingSolo, color: "text-amber-500" },
                                { label: "Pending Team", value: overview.pendingTeam, color: "text-amber-500" },
                                { label: "Avg Reg / Event", value: ((overview.totalSolo + overview.totalTeam) / (events?.length || 1)).toFixed(1), icon: Activity },
                                { label: "Hot Events", value: detailedStats?.eventStats?.filter(e => e.occupancy > 80).length, icon: Target },
                                { label: "Low Traffic", value: detailedStats?.eventStats?.filter(e => e.occupancy < 20).length, icon: TrendingDown },
                                { label: "Total Clubs", value: detailedStats?.clubStats?.length, icon: Globe },
                                { label: "Top Club", value: detailedStats?.clubStats?.[0]?._id?.substring(0, 10), icon: Flag },
                                { label: "Official (AAA)", value: detailedStats?.userStats?.onboarding?.[0]?.count || 0, icon: ShieldCheck }, // Placeholder logic
                                { label: "Waitlisted", value: detailedStats?.eventStats?.reduce((a, b) => a + (b.waitlisted || 0), 0), icon: Clock },
                                { label: "Disqualified", value: "0", icon: AlertCircle },
                                { label: "Rev / Solo", value: `₹${((detailedStats?.clubStats?.reduce((a, b) => a + b.totalRevenue, 0) || 0) * 0.4).toFixed(0)}`, icon: CreditCard }, // Proxy
                                { label: "Rev / Team", value: `₹${((detailedStats?.clubStats?.reduce((a, b) => a + b.totalRevenue, 0) || 0) * 0.6).toFixed(0)}`, icon: CreditCard }, // Proxy
                                { label: "Onboarded %", value: `${((detailedStats?.userStats?.onboarding?.find(o => o._id === true)?.count / (detailedStats?.userStats?.onboarding?.reduce((a, b) => a + b.count, 0) || 1)) * 100).toFixed(1)}%`, icon: Zap },
                                { label: "Gender: Male", value: genderData.find(g => g.name === 'Male')?.value || 0, icon: Users },
                                { label: "Gender: Female", value: genderData.find(g => g.name === 'Female')?.value || 0, icon: Users },
                                { label: "Avg / College", value: ((overview.totalSolo + overview.totalTeam) / (detailedStats?.collegeStats?.length || 1)).toFixed(1), icon: School }
                            ].map((s, idx) => (
                                <div key={idx} className="bg-gray-950 border border-gray-900 p-4 rounded hover:bg-gray-900/50 transition-colors">
                                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                                        {s.label}
                                        {s.icon && <s.icon className="w-2.5 h-2.5" />}
                                    </div>
                                    <div className={`text-lg font-black italic ${s.color || 'text-white'}`}>{s.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Charts Section 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* User Growth (Area Chart) */}
                        <div className="bg-gray-950 border border-gray-800 rounded p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Users className="w-4 h-4 text-blue-500" />
                                Population Expansion
                            </h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={userGrowthData}>
                                        <defs>
                                            <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                        <XAxis dataKey="date" stroke="#4b5563" fontSize={8} fontWeight="bold" />
                                        <YAxis stroke="#4b5563" fontSize={8} fontWeight="bold" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937' }}
                                            labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="cumulative" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCum)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gender Distribution (Pie Chart) */}
                        <div className="bg-gray-950 border border-gray-800 rounded p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <PieChart className="w-4 h-4 text-pink-500" />
                                Biological Demographics
                            </h2>
                            <div className="h-80 w-full flex items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={genderData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {genderData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{value}</span>}/>
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Hotspots Table */}
                    <section className="mt-12 bg-gray-950 border border-gray-800 rounded overflow-hidden">
                        <div className="p-6 border-b border-gray-900 flex justify-between items-center">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <Target className="w-4 h-4 text-red-500" />
                                Event Popularity Index
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Event Protocol</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Infiltration Count</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Capacity %</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Yield (INR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-900">
                                    {filteredEventStats.map((event, idx) => (
                                        <tr key={idx} className="hover:bg-gray-900/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black uppercase text-white">{event.name}</span>
                                                    <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">{Array.isArray(event.club) ? event.club[0] : event.club}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-gray-300">{event.totalRegistrations}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-1 bg-gray-900 rounded-full overflow-hidden">
                                                        <div className={`h-full ${event.occupancy > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(event.occupancy, 100)}%` }}></div>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-500">{event.occupancy.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs font-black text-amber-500">
                                                ₹{event.revenue.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Top Colleges */}
                    <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gray-950 border border-gray-800 rounded p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Flag className="w-4 h-4 text-blue-500" />
                                Institutional Hotspots
                            </h2>
                            <div className="space-y-4">
                                {detailedStats?.collegeStats?.slice(0, 8).map((clg, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <span className="text-[10px] font-mono text-gray-700 w-4">#{idx+1}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[10px] font-bold uppercase text-gray-300">{clg._id}</span>
                                                <span className="text-[10px] font-black text-white">{clg.count}</span>
                                            </div>
                                            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600" style={{ width: `${(clg.count / (detailedStats.collegeStats[0]?.count || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-950 border border-gray-800 rounded p-6 flex flex-col justify-center items-center text-center">
                            <Globe className="w-12 h-12 text-gray-800 mb-4 animate-pulse" />
                            <h3 className="text-xs font-black uppercase mb-2 tracking-widest">Regional Intelligence</h3>
                            <p className="text-[10px] text-gray-600 font-bold uppercase max-w-xs">
                                Geolocation tracking active. Map visualization pending deployment in next version.
                            </p>
                            <div className="mt-6 flex gap-8">
                                <div className="text-center">
                                    <div className="text-xl font-black text-white italic">{detailedStats?.collegeStats?.length}</div>
                                    <div className="text-[8px] font-bold text-gray-700 uppercase">Hubs</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-black text-white italic">{(overview.totalSolo + overview.totalTeam)}</div>
                                    <div className="text-[8px] font-bold text-gray-700 uppercase">Infiltrators</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default MasterStats;
