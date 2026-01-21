import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { apiPatch } from '../../../utils/apiClient';
import {
    RefreshCcw, Edit2, Save, X,
    Unlock, Lock, ShieldAlert, ShieldCheck,
    Users, IndianRupee, Activity
} from 'lucide-react';

const GENDER_SPECIFIC_EVENT_IDS = ["22", "23"];

const EventCard = ({ event, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial State derived from event
    const [formData, setFormData] = useState({
        price: event.price,
        totalSlots: event.slots?.totalSlots || event.total_slots || 0,
        isOpen: event.registration?.isOpen ?? true,
        officialOnly: event.registration?.officialOnly ?? false,
        maleSlots: event.specificSlots?.male || 0,
        femaleSlots: event.specificSlots?.female || 0
    });

    const isGenderSpecific = GENDER_SPECIFIC_EVENT_IDS.includes(String(event.id));
    const occupancy = event.slots?.totalSlots > 0
        ? Math.round(((event.slots.totalSlots - event.slots.availableSlots) / event.slots.totalSlots) * 100)
        : (event.total_slots > 0 ? Math.round(((event.total_slots - event.available_slots) / event.total_slots) * 100) : 0);

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                price: Number(formData.price),
                totalSlots: Number(formData.totalSlots), // Backend now accepts this
                isOpen: formData.isOpen,
                officialOnly: formData.officialOnly,
            };

            if (isGenderSpecific) {
                payload.specificSlotsUpdate = {
                    male: Number(formData.maleSlots),
                    female: Number(formData.femaleSlots)
                };
            }

            await onUpdate(event._id || event.id, payload);
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form
        setFormData({
            price: event.price,
            totalSlots: event.slots?.totalSlots || event.total_slots || 0,
            isOpen: event.registration?.isOpen ?? true,
            officialOnly: event.registration?.officialOnly ?? false,
            maleSlots: event.specificSlots?.male || 0,
            femaleSlots: event.specificSlots?.female || 0
        });
    };

    return (
        <div className={`
            relative p-6 rounded-xl border transition-all duration-300
            bg-gray-950/50 backdrop-blur-sm
            ${isEditing ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-gray-800 hover:border-gray-700'}
        `}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-lg text-white tracking-tight">{event.name}</h3>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">
                        #{event.id} • {event.team}
                    </p>
                </div>
                {/* Status Badges */}
                <div className="flex gap-2">
                    {/* Status Toggle or Badge */}
                    {isEditing ? (
                        <button
                            onClick={() => setFormData(p => ({ ...p, isOpen: !p.isOpen }))}
                            className={`p-1.5 rounded-lg border transition-all
                                ${formData.isOpen
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}
                            title={formData.isOpen ? "Registration Open" : "Registration Closed"}
                        >
                            {formData.isOpen ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>
                    ) : (
                        !formData.isOpen && (
                            <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                                Closed
                            </span>
                        )
                    )}

                    {/* Official Only Toggle or Badge */}
                    {isEditing ? (
                        <button
                            onClick={() => setFormData(p => ({ ...p, officialOnly: !p.officialOnly }))}
                            className={`p-1.5 rounded-lg border transition-all
                                ${formData.officialOnly
                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                    : 'bg-gray-800 border-gray-700 text-gray-500'
                                }`}
                            title={formData.officialOnly ? "Official Entries Only" : "Open to All"}
                        >
                            {formData.officialOnly ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                        </button>
                    ) : (
                        formData.officialOnly && (
                            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                                Official Only
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="space-y-4">
                {/* Row 1: Fee and Occupancy */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                            <IndianRupee size={10} /> Fee
                        </label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded text-sm px-2 py-1 text-white focus:border-indigo-500 outline-none transition-colors"
                            />
                        ) : (
                            <div className="text-sm font-mono text-white">₹{formData.price}</div>
                        )}
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                            <Activity size={10} /> Usage
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${occupancy >= 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(occupancy, 100)}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">{occupancy}%</span>
                        </div>
                    </div>
                </div>

                {/* Specific Slots Logic for Gender Specific Events */}
                {isGenderSpecific ? (
                    <div className="space-y-2">
                        <div className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                            <Users size={10} /> Total Capacity: {Number(formData.maleSlots) + Number(formData.femaleSlots)}
                            <span className="text-gray-600 font-normal normal-case">
                                ({formData.maleSlots} Boys + {formData.femaleSlots} Girls)
                            </span>
                        </div>
                        <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-800/50 text-xs">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 uppercase font-bold text-[10px]">Boys Slots</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="w-16 bg-black border border-gray-700 rounded px-1.5 py-0.5 text-right font-mono"
                                        value={formData.maleSlots}
                                        onChange={e => setFormData({ ...formData, maleSlots: e.target.value })}
                                    />
                                ) : (
                                    <span className="font-mono text-white">
                                        {formData.maleSlots - (event.specificSlots?.male - (event.registrations?.participants?.filter(p => !p.isOfficial /* Simplified, assuming backend handled */) || []).length || 0)} / {formData.maleSlots}
                                        {/* Ideally we use available/total logic from backend but specificSlots obj structure might vary. 
                                            Using simplified display if detailed tracking not in prop. 
                                            Actually, event.specificSlots usually holds AVAILABLE slots in some models, or map.
                                            Let's just show Total for editing, and Available for viewing if possible.
                                            
                                            Wait, `specificSlots` in `eventModel` is Map<String, Number>.
                                            Controller logic: `event.specificSlots.get(slotKey)` is available slots.
                                            So `formData.maleSlots` should likely represent the TOTAL if we are editing capacity?
                                            Actually the controller updates the value directly.
                                            "updateEventDetails" sets `event.specificSlots.set(key, numValue)`.
                                            So we are setting the CURRENT AVAILABLE slots directly or TOTAL?
                                            Users usually want to increase capacity.
                                            If I set 50, does it mean 50 available now?
                                            Yes, looking at controller: `event.specificSlots.set(key, numValue)`.
                                            This overwrites the value.
                                            So in "Edit" mode, we are setting "Available Slots" or "Total"?
                                            The `eventModel` only has `specificSlots` map. It doesn't seem to track "Total Gender Slots" separately like `slots.totalSlots`.
                                            So this input is effectively "Set Remaining/Available Slots".
                                            I should label it clearly: "Available Slots (Boys)".
                                        */}
                                        <span className="text-gray-600 ml-1">(Avl)</span>
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 uppercase font-bold text-[10px]">Girls Slots</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="w-16 bg-black border border-gray-700 rounded px-1.5 py-0.5 text-right font-mono"
                                        value={formData.femaleSlots}
                                        onChange={e => setFormData({ ...formData, femaleSlots: e.target.value })}
                                    />
                                ) : (
                                    <span className="font-mono text-white">
                                        {formData.femaleSlots} <span className="text-gray-600 ml-1">(Avl)</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-[9px] text-gray-600 text-center">
                            * For gender events, you are editing <u>Available</u> slots directly.
                        </div>
                    </div>
                ) : (
                    /* General Slots */
                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase text-gray-500 font-bold flex items-center gap-1">
                                <Users size={10} /> Total Capacity
                            </label>
                            {!isEditing && (
                                <span className="text-[10px] text-gray-500">
                                    {event.slots?.availableSlots ?? event.available_slots} Available
                                </span>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={formData.totalSlots}
                                    onChange={e => setFormData({ ...formData, totalSlots: e.target.value })}
                                    className="flex-1 bg-black border border-gray-700 rounded text-sm px-2 py-1 text-white focus:border-indigo-500 outline-none font-mono"
                                />
                                <span className="text-xs text-gray-500 font-mono">slots</span>
                            </div>
                        ) : (
                            <div className="text-lg font-mono text-white tracking-tight">
                                {event.slots?.totalSlots ?? event.total_slots}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="p-2 rounded-lg bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20"
                        >
                            {saving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                            SAVE
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-2 rounded-lg border border-gray-800 text-gray-500 text-xs font-bold uppercase tracking-widest hover:border-gray-600 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                    >
                        <Edit2 size={12} className="group-hover:text-indigo-400 transition-colors" />
                        Edit Event
                    </button>
                )}
            </div>
        </div>
    );
};

const MasterEvents = () => {
    const { data: { events, teams }, loading, refreshEvents } = useData();
    const [activeTeam, setActiveTeam] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const handleUpdateEvent = async (id, payload) => {
        await apiPatch(`/api/events/${id}`, payload);
        await refreshEvents(); // Refresh to ensure sync
    };

    const filteredEvents = useMemo(() => {
        if (!events) return [];
        let result = [...events];

        // Filter by Team
        if (activeTeam !== 'All') {
            result = result.filter(e => e.team === activeTeam);
        }

        // Filter by Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(e =>
                e.name.toLowerCase().includes(lower) ||
                String(e.id).includes(lower)
            );
        }

        return result.sort((a, b) => Number(a.id) - Number(b.id));

    }, [events, activeTeam, searchTerm]);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            <Sidebar panelType="master" />

            <main className="flex-1 flex flex-col h-full overflow-hidden lg:ml-64 relative">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-40 pointer-events-none" />

                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-gray-900">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-white mb-2">EVENT MATRIX</h1>
                                <p className="text-sm text-gray-500 font-mono">Manage capacity, pricing, and status protocols.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-4 w-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="SEARCH PROTOCOLS..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-lg block pl-10 p-2.5 w-64 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase tracking-wide font-mono transition-all"
                                    />
                                </div>
                                <button
                                    onClick={refreshEvents}
                                    className="p-2.5 bg-gray-950 border border-gray-800 text-gray-400 rounded-lg hover:text-white hover:border-gray-600 transition-all"
                                    title="Sync Data"
                                >
                                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            {['All', ...(teams || []).filter(t => t.name?.toLowerCase() !== 'registration').map(t => t.name)].map(team => (
                                <button
                                    key={team}
                                    onClick={() => setActiveTeam(team)}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${activeTeam === team
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-gray-500 border-gray-900 hover:border-gray-700 hover:text-gray-300'
                                        }`}
                                >
                                    {team}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                            {filteredEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onUpdate={handleUpdateEvent}
                                />
                            ))}
                            {filteredEvents.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-600 font-mono uppercase tracking-widest">
                                    No Protocols Found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterEvents;
