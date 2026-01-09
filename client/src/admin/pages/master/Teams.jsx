import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Shield, Search, Save, Settings2 } from 'lucide-react';

const MasterTeams = () => {
    const { data: { teams, events }, updateTeam } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingChanges, setPendingChanges] = useState({});

    const filteredTeams = teams.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEventChange = (teamId, eventName) => {
        setPendingChanges(prev => ({
            ...prev,
            [teamId]: eventName
        }));
    };

    const handleUpdate = (teamId) => {
        const newEvent = pendingChanges[teamId];
        if (newEvent) {
            updateTeam(teamId, { assigned_event: newEvent });
            // Clear pending change for this team
            const newPending = { ...pendingChanges };
            delete newPending[teamId];
            setPendingChanges(newPending);
        }
    };

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <Shield className="w-6 h-6" />
                                Departmental Teams
                            </h1>
                            <p className="text-sm text-gray-500">Configure organizational domains and primary event assignments</p>
                        </div>
                    </header>

                    {/* Controls */}
                    <div className="mb-6 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search teams by name..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Team ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Assigned Primary Event</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTeams.map((team) => (
                                    <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono font-bold text-gray-400">{team.id}</td>
                                        <td className="px-6 py-4 text-sm font-black text-gray-900 uppercase tracking-tight">{team.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <select 
                                                    className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-gray-900 appearance-none"
                                                    value={pendingChanges[team.id] || team.assigned_event || ''}
                                                    onChange={(e) => handleEventChange(team.id, e.target.value)}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {events
                                                        .filter(e => e.team === team.name)
                                                        .map(e => (
                                                            <option key={e.id} value={e.name}>{e.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                    <Settings2 className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleUpdate(team.id)}
                                                disabled={!pendingChanges[team.id]}
                                                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all ml-auto ${
                                                    pendingChanges[team.id] 
                                                        ? 'bg-gray-900 text-white hover:bg-black shadow-md translate-y-[-1px]' 
                                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'
                                                }`}
                                            >
                                                <Save className="w-3 h-3" />
                                                {pendingChanges[team.id] ? 'Commit Changes' : 'Synced'}
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

export default MasterTeams;
