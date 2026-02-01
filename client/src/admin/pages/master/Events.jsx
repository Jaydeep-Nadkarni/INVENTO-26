import React, { useState, useMemo, useEffect } from 'react';
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
        isPricePerPerson: event.isPricePerPerson || false,
        totalSlots: event.slots?.totalSlots || event.total_slots || 0,
        isOpen: event.registration?.isOpen ?? true,
        officialOnly: event.registration?.officialOnly ?? false,
        maleSlots: event.specificSlots?.male || 0,
        femaleSlots: event.specificSlots?.female || 0,
        club: event.team || event.club || 'General'
    });

    // Rehydrate form data when event prop updates
    useEffect(() => {
        if (!isEditing) {
            setFormData({
                price: event.price,
                isPricePerPerson: event.isPricePerPerson || false,
                totalSlots: event.slots?.totalSlots || event.total_slots || 0,
                isOpen: event.registration?.isOpen ?? true,
                officialOnly: event.registration?.officialOnly ?? false,
                maleSlots: event.specificSlots?.male || 0,
                femaleSlots: event.specificSlots?.female || 0,
                club: event.team || event.club || 'General'
            });
        }
    }, [event, isEditing]);

    const isGenderSpecific = GENDER_SPECIFIC_EVENT_IDS.includes(String(event.id));
    const occupancy = event.slots?.totalSlots > 0
        ? Math.round(((event.slots.totalSlots - event.slots.availableSlots) / event.slots.totalSlots) * 100)
        : (event.total_slots > 0 ? Math.round(((event.total_slots - event.available_slots) / event.total_slots) * 100) : 0);

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                price: Number(formData.price),
                isPricePerPerson: formData.isPricePerPerson,
                totalSlots: Number(formData.totalSlots), // Backend now accepts this
                isOpen: formData.isOpen,
                officialOnly: formData.officialOnly,
                club: formData.club
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
            femaleSlots: event.specificSlots?.female || 0,
            club: event.team || event.club || 'General'
        });
    };

    return (
        <div className={`
            relative p-6 rounded-xl border transition-all duration-300
            bg-white shadow-sm
            ${isEditing ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-gray-200 hover:border-gray-300'}
        `}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 tracking-tight">{event.name}</h3>
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
                                    ? 'bg-green-50 border-green-200 text-green-600'
                                    : 'bg-red-50 border-red-200 text-red-600'
                                }`}
                            title={formData.isOpen ? "Registration Open" : "Registration Closed"}
                        >
                            {formData.isOpen ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>
                    ) : (
                        !formData.isOpen && (
                            <span className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
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
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-gray-50 border-gray-200 text-gray-500'
                                }`}
                            title={formData.officialOnly ? "Official Entries Only" : "Open to All"}
                        >
                            {formData.officialOnly ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                        </button>
                    ) : (
                        formData.officialOnly && (
                            <span className="bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                                Official Only
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="space-y-4">
                {/* Club Info */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                        Club / Team Name
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.club}
                            onChange={e => setFormData({ ...formData, club: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded text-sm px-2 py-1 text-gray-900 focus:border-indigo-500 outline-none transition-colors"
                            placeholder="Enter club name"
                        />
                    ) : (
                        <div className="text-sm font-medium text-gray-900">{formData.club}</div>
                    )}
                </div>

                {/* Row 1: Fee and Occupancy */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center justify-between gap-1">
                             <span className="flex items-center gap-1"><IndianRupee size={10} /> Fee</span>
                             {isEditing && (
                                <button 
                                    onClick={() => setFormData({...formData, isPricePerPerson: !formData.isPricePerPerson})}
                                    className={`text-[8px] px-1.5 py-0.5 rounded border transition-colors ${formData.isPricePerPerson ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
                                >
                                    PER PERSON
                                </button>
                             )}
                        </label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded text-sm px-2 py-1 text-gray-900 focus:border-indigo-500 outline-none transition-colors"
                            />
                        ) : (
                            <div className="text-sm font-mono text-gray-900">₹{formData.price}{formData.isPricePerPerson ? ' / person' : ''}</div>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                            <Activity size={10} /> Usage
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${occupancy >= 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(occupancy, 100)}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">{occupancy}%</span>
                        </div>
                    </div>
                </div>

                {/* Specific Slots Logic for Gender Specific Events */}
                {isGenderSpecific ? (
                    <div className="space-y-2">
                        <div className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                            <Users size={10} /> Total Capacity: {Number(formData.maleSlots) + Number(formData.femaleSlots)}
                            <span className="text-gray-500 font-normal normal-case">
                                ({formData.maleSlots} Boys + {formData.femaleSlots} Girls)
                            </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 uppercase font-bold text-[10px]">Boys Slots</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="w-16 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-right font-mono text-gray-900"
                                        value={formData.maleSlots}
                                        onChange={e => setFormData({ ...formData, maleSlots: e.target.value })}
                                    />
                                ) : (
                                    <span className="font-mono text-gray-900">
                                        {formData.maleSlots}
                                        <span className="text-gray-500 ml-1">(Boys — Available)</span>
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 uppercase font-bold text-[10px]">Girls Slots</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="w-16 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-right font-mono text-gray-900"
                                        value={formData.femaleSlots}
                                        onChange={e => setFormData({ ...formData, femaleSlots: e.target.value })}
                                    />
                                ) : (
                                    <span className="font-mono text-gray-900">
                                        {formData.femaleSlots} <span className="text-gray-500 ml-1">(Avl)</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-[9px] text-gray-500 text-center">
                            * For gender events, you are editing <u>Available</u> slots directly.
                        </div>
                    </div>
                ) : (
                    /* General Slots */
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
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
                                    className="flex-1 bg-white border border-gray-200 rounded text-sm px-2 py-1 text-gray-900 focus:border-indigo-500 outline-none font-mono"
                                />
                                <span className="text-xs text-gray-500 font-mono">slots</span>
                            </div>
                        ) : (
                            <div className="text-lg font-mono text-gray-900 tracking-tight">
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
                            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200"
                        >
                            {saving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                            SAVE
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 group"
                    >
                        <Edit2 size={12} className="group-hover:text-indigo-600 transition-colors" />
                        Edit Event
                    </button>
                )}
            </div>
        </div>
    );
};

const MasterEvents = () => {
    const { data: { events, teams }, loading, refreshEvents, updateEvent } = useData();
    const [activeTeam, setActiveTeam] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const handleUpdateEvent = async (id, payload) => {
        await updateEvent(id, payload);
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
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
            <Sidebar panelType="master" />

            <main className="flex-1 flex flex-col h-full overflow-hidden lg:ml-64 relative">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100 opacity-40 pointer-events-none" />

                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-gray-200">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">EVENT MATRIX</h1>
                                <p className="text-sm text-gray-500 font-mono">Manage capacity, pricing, and status protocols.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="SEARCH PROTOCOLS..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg block pl-10 p-2.5 w-64 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase tracking-wide font-mono transition-all"
                                    />
                                </div>
                                <button
                                    onClick={refreshEvents}
                                    className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-gray-900 hover:border-gray-400 transition-all"
                                    title="Sync Data"
                                >
                                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>
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
