import React from 'react';
import Sidebar from '../../components/sidebar';
import { eventsList } from '../../data/masterData';

const MasterEvents = () => {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-400 font-mono overflow-hidden">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-red-900/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-red-700 font-bold mb-2">Scheduling</p>
                            <h1 className="text-3xl font-serif text-white uppercase tracking-tighter italic">
                                Global <span className="text-red-700 not-italic">Event Directory</span>
                            </h1>
                        </div>
                    </header>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {eventsList.map((event) => (
                            <div key={event.id} className="bg-[#111] border border-white/5 p-6 hover:border-red-800/50 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <i className="fas fa-calendar-alt text-4xl"></i>
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-red-700 text-[9px] font-black uppercase tracking-widest mb-1">{event.id}</p>
                                        <h3 className="text-xl font-serif text-white uppercase italic tracking-tighter">{event.name}</h3>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase ${
                                        event.status === 'Live' ? 'text-green-500 animate-pulse' : 
                                        event.status === 'Upcoming' ? 'text-yellow-600' : 'text-gray-700'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-[#0d0d0d] p-3 border border-white/5">
                                        <span className="text-[9px] uppercase tracking-widest text-gray-600">Sector</span>
                                        <span className="text-xs text-gray-300 font-black uppercase">{event.team}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#0d0d0d] p-3 border border-white/5">
                                        <span className="text-[9px] uppercase tracking-widest text-gray-600">Capacity</span>
                                        <span className="text-xs text-white font-serif">{event.participants} Units</span>
                                    </div>
                                </div>
                                
                                <button className="w-full mt-6 py-2 border border-red-900/20 text-[9px] uppercase tracking-[0.4em] font-black text-gray-600 hover:text-red-700 hover:border-red-700/50 transition-all">
                                    Access Node
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterEvents;
