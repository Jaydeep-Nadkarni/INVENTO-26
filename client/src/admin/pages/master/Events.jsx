import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { 
    Calendar, MapPin, Users, 
    ArrowUpRight, Search, Filter, 
    Database, Layers, Clock
} from 'lucide-react';

const MasterEvents = () => {
    const { data: { events, participants, teams }, updateEvent } = useData();
    const [activeTeam, setActiveTeam] = useState('All');

    const filteredEvents = activeTeam === 'All' 
        ? events 
        : events.filter(e => e.team === activeTeam);

    const getEventParticipantsCount = (eventName) => {
        return participants.filter(p => p.event === eventName).length;
    };

    const handleIncrementSlots = (event) => {
        updateEvent(event.id, { total_slots: event.total_slots + 5 });
    };

    const handleReserveSlot = (event) => {
        if (event.reserved_slots < event.total_slots) {
            updateEvent(event.id, { reserved_slots: event.reserved_slots + 1 });
        }
    };

    return (
        <div className="flex h-screen bg-black text-white border-gray-800">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-800 pb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Event Capacity Matrix</h1>
                        <p className="text-sm text-gray-400">Monitor and adjust event slots and reservations</p>
                    </header>

                    {/* Team Tabs */}
                    <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-800 pb-4">
                        {['All', ...teams.filter(t => t.name?.toLowerCase() !== 'registration').map(t => t.name)].map(team => (
                            <button
                                key={team}
                                onClick={() => setActiveTeam(team)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all ${
                                    activeTeam === team 
                                    ? 'bg-white text-black shadow-md' 
                                    : 'bg-black text-gray-500 hover:text-white'
                                }`}
                            >
                                {team}
                            </button>
                        ))}
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => {
                            const partCount = getEventParticipantsCount(event.name);
                            const occupancy = Math.round((partCount / event.total_slots) * 100) || 0;
                            const available = event.total_slots - event.reserved_slots;

                            return (
                                <div key={event.id} className="bg-gray-950 border border-gray-800 p-6 rounded group hover:border-white transition-all flex flex-col h-full shadow-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase tracking-widest">
                                                    {event.team}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                    occupancy > 90 ? 'text-red-500' : 'text-green-500'
                                                }`}>
                                                    • {occupancy}% OCCUPIED
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-snug">
                                                {event.name}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-gray-900 border border-gray-800 rounded">
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Participants</p>
                                                <p className="text-xl font-black text-white">{partCount}</p>
                                            </div>
                                            <div className="p-3 bg-gray-900 border border-gray-800 rounded">
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Available</p>
                                                <p className="text-xl font-black text-white">{available}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-dotted border-gray-800">
                                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                                <span className="text-gray-500 tracking-widest">Total Slots</span>
                                                <span className="text-white">{event.total_slots}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                                <span className="text-gray-500 tracking-widest">Reserved</span>
                                                <span className="text-white">{event.reserved_slots}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-4">
                                            <button 
                                                onClick={() => handleIncrementSlots(event)}
                                                className="py-2.5 bg-gray-900 border border-gray-800 text-[9px] font-black text-white uppercase tracking-widest rounded hover:bg-gray-800 transition-all"
                                            >
                                                + Add Slots
                                            </button>
                                            <button 
                                                onClick={() => handleReserveSlot(event)}
                                                className="py-2.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded hover:bg-gray-200 transition-all"
                                            >
                                                Reserve Slot
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterEvents;
