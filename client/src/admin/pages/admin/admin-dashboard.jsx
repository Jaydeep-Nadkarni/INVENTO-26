import React from 'react';
import Sidebar from '../../components/sidebar';
import { adminStats, recentActivities } from '../../data/adminData';
import { useAdminAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { adminUser } = useAdminAuth();

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Welcome, {adminUser?.email?.split('@')[0]}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {adminUser?.team} Team Management Dashboard
                            </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                             <span className="text-sm font-medium text-gray-600">Active Session</span>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <article className="p-6 bg-white border border-gray-200 rounded-md">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Team Domain</h3>
                            <p className="text-2xl font-bold">{adminStats.team}</p>
                            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-900 w-[65%]"></div>
                            </div>
                        </article>

                        <article className="p-6 bg-white border border-gray-200 rounded-md">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Registered Participants</h3>
                            <p className="text-4xl font-bold">{adminStats.totalParticipants}</p>
                        </article>

                        <article className="p-6 bg-white border border-gray-200 rounded-md">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assigned Events</h3>
                            <p className="text-4xl font-bold">{adminStats.totalEvents}</p>
                        </article>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <section className="lg:col-span-2">
                            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">
                                Recent Activity
                            </h2>
                            <div className="border border-gray-100 rounded-md divide-y divide-gray-100 overflow-hidden">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{activity.user}</p>
                                                <p className="text-xs text-gray-500">{activity.action}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">ID: {activity.id * 1024}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="p-6 border border-gray-200 rounded-md bg-gray-50/50 flex flex-col items-center justify-center text-center">
                             <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-4">
                                 <Activity className="w-6 h-6 text-gray-400" />
                             </div>
                             <h3 className="text-sm font-bold text-gray-900 mb-2 underline overline decoration-gray-200">Terminal Control</h3>
                             <p className="text-xs text-gray-500 mb-6 leading-relaxed">System synchronized with central server. All participant checkpoints are currently operational.</p>
                             <button className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded hover:bg-gray-800 transition-colors">
                                 Fetch Updates
                             </button>
                        </section>
                    </div>

                    {/* Footer */}
                    <footer className="mt-12 py-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        <div>Operational Logs v1.0.4</div>
                        <div>Secure Access Layer</div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
