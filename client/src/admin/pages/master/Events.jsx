import React from 'react';
import Sidebar from '../../components/sidebar';
import { eventsList } from '../../data/masterData';
import { Calendar, MapPin, Users, ArrowUpRight, Search } from 'lucide-react';

const MasterEvents = () => {
    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Global Event Directory</h1>
                            <p className="text-sm text-gray-500">Overview of all departmental events, team assignments, and capacity stats</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search events..."
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                            />
                        </div>
                    </header>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {eventsList.map((event) => (
                            <div key={event.id} className="bg-white border border-gray-200 p-6 rounded-md group hover:shadow-md transition-all flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                                                {event.id}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase ${
                                                event.status === 'Live' ? 'text-green-600' : 
                                                event.status === 'Upcoming' ? 'text-amber-600' : 'text-gray-400'
                                            }`}>
                                                • {event.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                                            {event.name}
                                        </h3>
                                    </div>
                                    <button className="text-gray-300 group-hover:text-gray-900 transition-colors">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="mt-auto space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-50 rounded">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Team</p>
                                                <p className="text-xs font-bold text-gray-700 uppercase">{event.team}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-50 rounded">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Capacity</p>
                                                <p className="text-xs font-bold text-gray-700">{event.participants} Fixed</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full mt-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] transition-all rounded">
                                        Manager Event Node
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterEvents;

export default MasterEvents;
