import React from 'react';
import Sidebar from '../../components/sidebar';
import { adminsList } from '../../data/masterData';
import { UserPlus, Shield, Mail, MoreHorizontal } from 'lucide-react';

const MasterAdmins = () => {
    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Personnel Directory</h1>
                            <p className="text-sm text-gray-500">Manage administrative access and team assignments across all departments</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-gray-800 transition-all">
                                <UserPlus className="w-4 h-4" />
                                Add Administrator
                            </button>
                        </div>
                    </header>
                    
                    {/* Data Table */}
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">UID</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Name</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Contact Email</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-center">Assigned Team</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {adminsList.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{admin.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{admin.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium">{admin.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-bold text-[10px] uppercase tracking-tight">
                                                <Shield className="w-3 h-3" />
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                admin.status === 'Active' 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-gray-50 text-gray-400'
                                            }`}>
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 text-gray-300 hover:text-gray-900 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterAdmins;

export default MasterAdmins;
