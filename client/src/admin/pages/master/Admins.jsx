import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Plus, Shield, Users, Wallet, Globe, Mail, Clock } from 'lucide-react';

const MasterAdmins = () => {
    const { data: { admins, teams }, addAdmin } = useData();
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        team: 'Dance',
        status: 'Active'
    });

    const handleAddAdmin = (e) => {
        e.preventDefault();
        const id = `ADM-${(admins.length + 1).toString().padStart(3, '0')}`;
        addAdmin({ ...newAdmin, id });
        setNewAdmin({ name: '', email: '', team: 'Dance', status: 'Active' });
    };

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Personnel Directory</h1>
                        <p className="text-sm text-gray-500">Manage administrative access and team assignments</p>
                    </header>

                    {/* Add Admin Form */}
                    <section className="mb-12 bg-gray-50 p-6 rounded-md border border-gray-100">
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Register New Administrator</h2>
                        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-1 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">ID (AUTO)</label>
                                <input 
                                    type="text" 
                                    value={`ADM-${(admins.length + 1).toString().padStart(3, '0')}`} 
                                    className="w-full px-3 py-2 bg-gray-100 border-none text-xs font-mono text-gray-400 rounded" 
                                    disabled 
                                />
                            </div>
                            <div className="md:col-span-1 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newAdmin.name} 
                                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                                    placeholder="Enter name"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-gray-900" 
                                />
                            </div>
                            <div className="md:col-span-1 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={newAdmin.email} 
                                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                                    placeholder="admin@invento.com"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-gray-900" 
                                />
                            </div>
                            <div className="md:col-span-1 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Assigned Team</label>
                                <select 
                                    value={newAdmin.team} 
                                    onChange={(e) => setNewAdmin({...newAdmin, team: e.target.value})}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
                                >
                                    {["Dance", "Media", "Music", "Coding", "Registration", "Gaming", "HR", "Art"].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1 flex items-center gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                                    <button 
                                        type="button"
                                        onClick={() => setNewAdmin({...newAdmin, status: newAdmin.status === 'Active' ? 'Disabled' : 'Active'})}
                                        className={`block px-4 py-2 text-[10px] font-bold uppercase rounded transition-colors ${
                                            newAdmin.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                                        }`}
                                    >
                                        {newAdmin.status}
                                    </button>
                                </div>
                                <button type="submit" className="flex-1 px-4 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-black transition-all">
                                    Add Admin
                                </button>
                            </div>
                        </form>
                    </section>
                    
                    {/* Admins Table */}
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px]">ID</th>
                                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px]">Name</th>
                                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px]">Email</th>
                                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px]">Team</th>
                                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px] text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-[11px] font-bold text-gray-400 group-hover:text-gray-900">{admin.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{admin.name}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">{admin.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black px-2 py-0.5 border border-gray-200 text-gray-600 rounded uppercase">
                                                {admin.team}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
                                                admin.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
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
