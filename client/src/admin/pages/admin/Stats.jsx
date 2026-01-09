import React from 'react';
import Sidebar from '../../components/sidebar';
import { adminStats, eventAttendanceStats } from '../../data/adminData';
import { BarChart3, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';

const AdminStats = () => {
    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                            <BarChart3 className="w-6 h-6" />
                            Engagement Analytics
                        </h1>
                        <p className="text-sm text-gray-500">Real-time attendance tracking and event performance metrics</p>
                    </header>

                    {/* Overall Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Registration Goal", value: "74%", icon: TrendingUp },
                            { label: "Verification Rate", value: "92%", icon: Users },
                            { label: "Avg Attendance", value: "68%", icon: Clock },
                            { label: "System Load", value: "Optimal", icon: BarChart3 }
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 p-6 rounded-md shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                    <item.icon className="w-4 h-4 text-gray-300" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Breakdown per Event */}
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                                Attendance Breakdown
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {eventAttendanceStats.map((stat, index) => {
                                    const percentage = Math.round((stat.present / stat.total) * 100);
                                    return (
                                        <div key={index} className="bg-white border border-gray-200 p-6 rounded-md group hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900">{stat.event}</h3>
                                                    <p className="text-xs text-gray-500 mt-1 font-medium">
                                                        {stat.present} Present / {stat.total} Total
                                                    </p>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">{percentage}%</div>
                                            </div>
                                            
                                            {/* Progress Bar Container */}
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gray-900 transition-all duration-1000"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Informational Alert */}
                        <section className="bg-gray-50 border border-gray-200 p-6 rounded-md">
                             <div className="flex items-start gap-4">
                                 <div className="p-2 bg-white border border-gray-200 rounded-full shadow-sm">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                 </div>
                                 <div>
                                     <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Data Synchronization Info</h3>
                                     <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                         Attendance metrics are updated every 15 minutes. Manual check-ins at specific event gates may experience slight propagation delays. For mission-critical real-time tracking, please refer to the live log stream in the Dashboard.
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

export default AdminStats;
