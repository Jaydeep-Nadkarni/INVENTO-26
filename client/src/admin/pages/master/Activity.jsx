import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { History, Filter, Search, Terminal, ChevronDown } from 'lucide-react';

const MasterActivity = () => {
    const { data: { masterActivityLogs } } = useData();
    const [filterTeam, setFilterTeam] = useState('All');
    
    const teams = ['All', ...new Set(masterActivityLogs.map(log => log.team))];
    
    const filteredLogs = masterActivityLogs.filter(log => 
        filterTeam === 'All' || log.team === filterTeam
    );

    return (
        <div className="flex h-screen bg-black text-white border-gray-800">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <History className="w-6 h-6" />
                                System Audit Trail
                            </h1>
                            <p className="text-sm text-gray-400">Global activity logs and administrative action history</p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <select 
                                    value={filterTeam}
                                    onChange={(e) => setFilterTeam(e.target.value)}
                                    className="appearance-none w-full bg-gray-950 border border-gray-800 px-4 py-2 pr-10 text-xs font-bold uppercase tracking-widest rounded focus:outline-none focus:ring-1 focus:ring-white cursor-pointer text-gray-300"
                                >
                                    {teams.map(team => <option key={team} value={team}>{team === 'All' ? 'ALL SECTORS' : team}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </header>

                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="bg-gray-950 border border-gray-800 p-5 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-900 transition-all">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-800 rounded text-gray-500">
                                        <Terminal className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-white">{log.admin}</span>
                                            <span className="text-[10px] bg-gray-900 text-gray-400 px-2 py-0.5 rounded font-black uppercase tracking-tight">{log.team}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium">
                                            <span className="font-bold text-white">{log.action}</span> for <span className="italic">{log.event}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end text-right md:border-l border-gray-800 md:pl-8">
                                    <span className="text-xs font-bold text-white">{log.time}</span>
                                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">Status: Logged</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-12 bg-black border border-dashed border-gray-800 rounded-md text-center">
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.4em]">End of current session</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterActivity;
