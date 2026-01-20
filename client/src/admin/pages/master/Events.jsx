import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { apiPatch } from '../../../utils/apiClient';
import {
    Calendar, MapPin, Users,
    ArrowUpRight, Search, Filter,
    Database, Layers, Clock,
    Venus, Mars, RefreshCcw,
    Edit, X, Save, Lock, Unlock, ShieldAlert, AlertCircle
} from 'lucide-react';

const GENDER_SPECIFIC_EVENT_IDS = ["22", "23"];

const MasterEvents = () => {
    const { data: { events, teams }, loading, refreshEvents } = useData();
    const [activeTeam, setActiveTeam] = useState('All');
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const filteredEvents = useMemo(() => {
        if (!events) return [];
        // Sort by ID
        const sorted = [...events].sort((a, b) => Number(a.id) - Number(b.id));
        return activeTeam === 'All'
            ? sorted
            : sorted.filter(e => e.team === activeTeam);
    }, [events, activeTeam]);

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setError(null);
        setFormData({
            price: event.price,
            slotsChange: 0,
            isOpen: event.registration?.isOpen ?? true,
            officialOnly: event.registration?.officialOnly ?? false,
            // Specific Slots
            maleSlots: event.specificSlots?.male || 0,
            femaleSlots: event.specificSlots?.female || 0
        });
    };

    const handleSave = async () => {
        if (!editingEvent) return;
        setError(null);

        // Validation
        const price = Number(formData.price);
        const slotsChange = Number(formData.slotsChange);

        if (isNaN(price) || price < 0) {
            setError("Please enter a valid non-negative price.");
            return;
        }

        if (isNaN(slotsChange)) {
            setError("Please enter a valid number for slots adjustment.");
            return;
        }

        // Check constraints
        const newTotal = editingEvent.total_slots + slotsChange;
        const newAvailable = editingEvent.available_slots + slotsChange;

        if (newTotal < 0) {
            setError("Total slots cannot be negative. Please adjust the value.");
            return;
        }
        if (newAvailable < 0) {
            setError("Cannot reduce capacity below the number of currently occupied slots.");
            return;
        }

        const isGenderSpecific = GENDER_SPECIFIC_EVENT_IDS.includes(String(editingEvent.id));
        if (isGenderSpecific) {
            const mSlots = Number(formData.maleSlots);
            const fSlots = Number(formData.femaleSlots);
            if (isNaN(mSlots) || mSlots < 0 || isNaN(fSlots) || fSlots < 0) {
                setError("Please enter valid non-negative numbers for gender specific slots.");
                return;
            }
            if (mSlots + fSlots > newTotal) {
                setError(`Sum of gender slots (${mSlots + fSlots}) cannot exceed total slots (${newTotal}).`);
                return;
            }
        }

        setSaving(true);
        try {
            const payload = {
                price: price,
                slotsChange: slotsChange,
                isOpen: formData.isOpen,
                officialOnly: formData.officialOnly,
            };

            if (isGenderSpecific) {
                payload.specificSlotsUpdate = {
                    male: Number(formData.maleSlots),
                    female: Number(formData.femaleSlots)
                };
            }

            await apiPatch(`/api/events/${editingEvent._id || editingEvent.id}`, payload);
            await refreshEvents();
            setEditingEvent(null);
        } catch (err) {
            setError(`Failed to update event: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-black text-white border-gray-800">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-800 pb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Event Capacity Matrix</h1>
                            <p className="text-sm text-gray-400">Monitor and adjust event slots and reservations</p>
                        </div>
                        <button
                            onClick={refreshEvents}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded border border-gray-800 hover:text-white hover:border-white transition-all"
                        >
                            <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                            Sync Registry
                        </button>
                    </header>

                    {/* Team Tabs */}
                    <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-800 pb-4">
                        {['All', ...teams.filter(t => t.name?.toLowerCase() !== 'registration').map(t => t.name)].map(team => (
                            <button
                                key={team}
                                onClick={() => setActiveTeam(team)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all ${activeTeam === team
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
                            const occupancy = Math.round(((event.total_slots - event.available_slots) / event.total_slots) * 100) || 0;
                            const isGenderSpecific = GENDER_SPECIFIC_EVENT_IDS.includes(String(event.id));
                            const specificSlots = event.specificSlots || {};

                            return (
                                <div key={event.id} className="bg-gray-950 border border-gray-800 p-6 rounded group hover:border-white transition-all flex flex-col h-full shadow-sm relative overflow-hidden">
                                    {/* Status Indicators */}
                                    <div className="absolute top-0 right-0 p-2 flex gap-1">
                                        {!event.registration?.isOpen && (
                                            <span className="bg-red-500/20 text-red-400 text-[9px] px-2 py-1 rounded font-bold uppercase border border-red-500/50">CLOSED</span>
                                        )}
                                        {event.registration?.officialOnly && (
                                            <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-1 rounded font-bold uppercase border border-blue-500/50">OFFICIAL ONLY</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-start mb-6 mt-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase tracking-widest">
                                                    #{event.id} {event.team}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${occupancy > 90 ? 'text-red-500' : 'text-green-500'
                                                    }`}>
                                                    • {occupancy}% OCCUPIED
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-snug">
                                                {event.name}
                                            </h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                {event.eventType} EVENT • ₹{event.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-gray-900 border border-gray-800 rounded">
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total</p>
                                                <p className="text-xl font-black text-white">{event.total_slots}</p>
                                            </div>
                                            <div className="p-3 bg-gray-900 border border-gray-800 rounded">
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Available</p>
                                                <p className="text-xl font-black text-white">{event.available_slots}</p>
                                            </div>
                                        </div>

                                        {isGenderSpecific && (
                                            <div className="p-3 bg-indigo-950/20 border border-indigo-900/50 rounded space-y-2">
                                                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-2 border-b border-indigo-900/50 pb-1 flex items-center gap-2">
                                                    <Layers className="w-3" /> Gender Specific Slots
                                                </p>
                                                <div className="flex justify-between items-center text-[11px] font-bold">
                                                    <span className="flex items-center gap-1.5 text-blue-400"><Mars className="w-3" /> Boys</span>
                                                    <span>{specificSlots.male || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[11px] font-bold">
                                                    <span className="flex items-center gap-1.5 text-pink-400"><Venus className="w-3" /> Girls</span>
                                                    <span>{specificSlots.female || 0}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4 pt-4 border-t border-dotted border-gray-800">
                                            <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${occupancy > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${occupancy}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 pt-4">
                                            <button
                                                onClick={() => handleEditClick(event)}
                                                className="py-2.5 bg-gray-900 border border-gray-800 text-[9px] font-black text-white uppercase tracking-widest rounded hover:bg-gray-800 hover:border-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <Edit className="w-3 h-3" /> Edit Protocol
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* EDIT MODAL */}
            {editingEvent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-950 border border-gray-800 rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div>
                                <h2 className="text-lg font-bold text-white uppercase tracking-tight">Edit Protocol</h2>
                                <p className="text-xs text-gray-400">{editingEvent.name}</p>
                            </div>
                            <button onClick={() => setEditingEvent(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded p-3">
                                    <p className="text-red-400 text-xs font-bold flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </p>
                                </div>
                            )}
                            {/* Price */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Registration Fee (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono focus:border-white focus:outline-none"
                                />
                            </div>

                            {/* Slot Adjustment */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Adjust Capacity (+/- Slots)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={formData.slotsChange}
                                        onChange={(e) => setFormData({ ...formData, slotsChange: Number(e.target.value) })}
                                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono focus:border-white focus:outline-none"
                                        placeholder="Enter number (e.g. 5 or -5)"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 mt-1">Current Total: {editingEvent.total_slots}. New Total will be {editingEvent.total_slots + Number(formData.slotsChange)}</p>
                            </div>

                            {/* Gender Specific Slots */}
                            {GENDER_SPECIFIC_EVENT_IDS.includes(String(editingEvent.id)) && (
                                <div className="bg-indigo-950/10 p-4 border border-indigo-900/30 rounded">
                                    <label className="text-[10px] uppercase font-bold text-indigo-400 block mb-3 border-b border-indigo-900/30 pb-1">Gender Specific Slots (Set Total)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Boys Slots</label>
                                            <input
                                                type="number"
                                                value={formData.maleSlots}
                                                onChange={(e) => setFormData({ ...formData, maleSlots: e.target.value })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono focus:border-white focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Girls Slots</label>
                                            <input
                                                type="number"
                                                value={formData.femaleSlots}
                                                onChange={(e) => setFormData({ ...formData, femaleSlots: e.target.value })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono focus:border-white focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Toggles */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isOpen: !formData.isOpen })}
                                    aria-pressed={formData.isOpen}
                                    className={`cursor-pointer p-4 rounded border flex flex-col items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-white/20 ${formData.isOpen ? 'bg-green-950/20 border-green-900 text-green-400' : 'bg-red-950/20 border-red-900 text-red-400'
                                        }`}
                                >
                                    {formData.isOpen ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{formData.isOpen ? 'Reg. Open' : 'Reg. Closed'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, officialOnly: !formData.officialOnly })}
                                    aria-pressed={formData.officialOnly}
                                    className={`cursor-pointer p-4 rounded border flex flex-col items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-white/20 ${formData.officialOnly ? 'bg-blue-950/20 border-blue-900 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500'
                                        }`}
                                >
                                    <ShieldAlert className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Official Only</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingEvent(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded hover:bg-gray-200 flex items-center gap-2"
                            >
                                {saving ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterEvents;
