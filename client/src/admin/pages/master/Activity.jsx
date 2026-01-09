import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { masterActivityLogs } from '../../data/masterData';

const MasterActivity = () => {
    const [filterTeam, setFilterTeam] = useState('All');
    
    const teams = ['All', ...new Set(masterActivityLogs.map(log => log.team))];
    
    const filteredLogs = masterActivityLogs.filter(log => 
        filterTeam === 'All' || log.team === filterTeam
    );

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-red-900/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Audit Trail</p>
                            <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                Action <span className="text-red-700 not-italic">Logs</span>
                            </h1>
                        </div>
                        <div>
                            <select 
                                value={filterTeam}
                                onChange={(e) => setFilterTeam(e.target.value)}
                                className="bg-[#111] border border-white/5 p-3 text-[10px] tracking-widest uppercase focus:outline-none focus:border-red-700/50 text-white w-full md:w-auto"
                            >
                                {teams.map(team => <option key={team} value={team}>{team} SECTOR</option>)}
                            </select>
                        </div>
                    </header>

                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="bg-[#0d0d0d] border-l-4 border-red-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-[#111] transition-colors shadow-lg">
                                <div className="flex items-center gap-6 text-left">
                                    <div className="w-12 h-12 hidden sm:flex items-center justify-center bg-white/5 border border-white/5 text-gray-700 text-xs font-black group-hover:text-red-700 group-hover:border-red-900/30 transition-all shrink-0">
                                        0{log.id}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <span className="text-white text-sm uppercase tracking-widest font-bold">{log.admin}</span>
                                            <span className="text-[9px] text-gray-700 px-2 py-0.5 border border-white/5 uppercase font-black">{log.team}</span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Action: <span className="text-red-700 font-bold">{log.action}</span> | Event: <span className="italic font-serif">{log.event}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-start md:items-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                    <span className="text-xs text-white font-serif italic mb-1">{log.time}</span>
                                    <span className="text-[8px] text-gray-700 uppercase tracking-[0.2em]">Validated by Core</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 border border-dashed border-white/5 text-center">
                        <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em]">End of accessible telemetry for current session</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterActivity;
