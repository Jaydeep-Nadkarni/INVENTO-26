import React from 'react';
import Sidebar from '../../components/sidebar';
import { adminsList } from '../../data/masterData';

const MasterAdmins = () => {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-red-900/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Personnel</p>
                            <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                Authorized <span className="text-red-700 not-italic">Administrators</span>
                            </h1>
                        </div>
                        <div className="text-right">
                            <button className="px-4 py-2 bg-red-700 text-white text-[10px] uppercase tracking-[0.3em] font-black shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                                + Deploy New Admin
                            </button>
                        </div>
                    </header>
                    
                    <div className="bg-[#0d0d0d] border border-white/5 overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[800px]">
                            <thead className="bg-[#111] text-gray-600 uppercase tracking-widest border-b border-white/5 font-black">
                                <tr>
                                    <th className="p-5">UID</th>
                                    <th className="p-5">Name</th>
                                    <th className="p-5">Email</th>
                                    <th className="p-5 text-center">Assigned Team</th>
                                    <th className="p-5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {adminsList.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-red-900/[0.02] transition-colors group">
                                        <td className="p-5 text-red-900 group-hover:text-red-700 font-bold">{admin.id}</td>
                                        <td className="p-5 text-white uppercase tracking-wider">{admin.name}</td>
                                        <td className="p-5 text-gray-500 font-bold italic">{admin.email}</td>
                                        <td className="p-5 text-center">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-full font-black text-[9px] uppercase">
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase border ${
                                                admin.status === 'Active' 
                                                ? 'bg-green-900/10 text-green-600 border-green-900/30' 
                                                : 'bg-gray-900 text-gray-600 border-gray-800'
                                            }`}>
                                                {admin.status}
                                            </span>
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
