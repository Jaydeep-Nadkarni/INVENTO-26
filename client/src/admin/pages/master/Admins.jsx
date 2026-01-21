import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/apiClient';
import { Plus, Shield, Users, Lock, Unlock, Zap, ChevronDown, Check, X, Search } from 'lucide-react';

const MasterAdmins = () => {
    const { 
        data: { teams, admins, events }, 
        refreshAdmins, 
        refreshStats, 
        refreshEvents,
        createAdmin,
        updateAdmin,
        deleteAdmin
    } = useData();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        team: 'General',
        access: [],
        isRegistration: false,
        status: 'Active'
    });

    // Multi-select UI state
    const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);
    const [eventSearch, setEventSearch] = useState("");

    // Fetch Initial Data if not present
    useEffect(() => {
        if (!admins || admins.length === 0) refreshAdmins();
        if (!events || events.length === 0) refreshEvents();
    }, []);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await createAdmin(formData);
        if (success) {
            setFormData({
                name: '',
                email: '',
                password: '',
                team: 'General',
                access: [],
                isRegistration: false,
                status: 'Active'
            });
        }
        setLoading(false);
    };

    const toggleAdminStatus = async (admin) => {
        const newStatus = admin.status === 'Active' ? 'Disabled' : 'Active';
        await updateAdmin(admin._id, { status: newStatus });
    };

    const handleDeleteAdmin = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;
        await deleteAdmin(id);
    };

    const toggleEventAccess = (eventId) => {
        setFormData(prev => {
            const access = prev.access.includes(eventId)
                ? prev.access.filter(id => id !== eventId)
                : [...prev.access, eventId];
            return { ...prev, access };
        });
    };

    // Memoized filtered events for the dropdown
    const filteredEvents = useMemo(() => {
        return events.filter(e => (e?.name || '').toLowerCase().includes(eventSearch.toLowerCase()));
    }, [events, eventSearch]);

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-8 border-b border-gray-200 pb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Personnel Directory</h1>
                            <p className="text-gray-600">Manage administrative access, roles, and granular permissions.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono text-gray-500 block">TOTAL ADMINS</span>
                            <span className="text-2xl font-bold text-gray-900">{admins.length}</span>
                        </div>
                    </header>

                    {/* Create Admin Panel */}
                    <section className="mb-12 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Register New Administrator</h2>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block">Full Name</label>
                                        <input
                                            type="text" required value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            placeholder="Agent Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block">Email Address</label>
                                        <input
                                            type="email" required value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            placeholder="agent@invento.com"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"} required value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-7 text-gray-500 hover:text-gray-700">
                                            {showPassword ? <Unlock size={14} /> : <Lock size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Role & Permissions */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block">Assigned Team</label>
                                        <select
                                            value={formData.team}
                                            onChange={e => setFormData({ ...formData, team: e.target.value })}
                                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-900"
                                        >
                                            {teams.map(t => (
                                                <option key={t.id} value={t.name}>{t.name}</option>
                                            ))}
                                            <option value="Registration">Registration</option>
                                        </select>
                                    </div>

                                    {/* Registration Admin Toggle */}
                                    <div className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-gray-900 block">Registration Authority</span>
                                            <span className="text-[10px] text-gray-600">Read-only access to all participants</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isRegistration: !formData.isRegistration })}
                                            className={`w-10 h-5 rounded-full relative transition-colors ${formData.isRegistration ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.isRegistration ? 'left-6' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Granular Access Control */}
                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block">
                                        Specific Event Access ({formData.access.length})
                                    </label>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsAccessDropdownOpen(!isAccessDropdownOpen)}
                                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm flex justify-between items-center hover:border-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                        >
                                            <span className="text-gray-700 truncate">
                                                {formData.access.length === 0 ? "No events selected" : `${formData.access.length} events selected`}
                                            </span>
                                            <ChevronDown size={14} className="text-gray-500" />
                                        </button>

                                        {isAccessDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-50 p-2">
                                                <div className="sticky top-0 bg-white pb-2 mb-2 border-b border-gray-200">
                                                    <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                                                        <Search size={12} className="text-gray-500 mr-2" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search events..."
                                                            value={eventSearch}
                                                            onChange={e => setEventSearch(e.target.value)}
                                                            className="w-full bg-transparent border-none py-1 text-xs text-gray-900 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    {filteredEvents.map(event => (
                                                        <div
                                                            key={event._id}
                                                            onClick={() => toggleEventAccess(event._id)}
                                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer group"
                                                        >
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.access.includes(event._id)
                                                                    ? 'bg-indigo-600 border-indigo-600'
                                                                    : 'border-gray-400 group-hover:border-gray-600'
                                                                }`}>
                                                                {formData.access.includes(event._id) && <Check size={10} className="text-white" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-gray-900 truncate">{event.name}</p>
                                                                <p className="text-[10px] text-gray-600 truncate">{event.team}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {filteredEvents.length === 0 && (
                                                        <p className="text-xs text-gray-500 text-center py-2">No events found.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-1">
                                        Select events this admin is allowed to manage (update specifics, view registered users).
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end">
                                <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm">
                                    <Plus size={16} /> Create Administrator
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Admins List */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">ID / Name</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Access</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Team</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px]">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-[10px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-xs uppercase">Loading personnel data...</td>
                                    </tr>
                                ) : admins.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-xs uppercase">No administrators found.</td>
                                    </tr>
                                ) : (
                                    admins.map((admin) => (
                                        <tr key={admin._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                                        {admin.name}
                                                        {admin.isRegistration && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">REG</span>}
                                                    </div>
                                                    <div className="text-xs font-mono text-gray-600">{admin.id || String(admin._id ?? '').substring(0, 8)} • {admin.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-700">
                                                    {admin.access && admin.access.length > 0 ? (
                                                        <span className="flex items-center gap-1">
                                                            <Zap size={12} className="text-yellow-500" />
                                                            {admin.access.length} Events
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Restricted</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black px-2 py-0.5 border border-gray-300 text-gray-700 rounded uppercase bg-gray-50">
                                                    {admin.team || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleAdminStatus(admin)}
                                                    className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter transition-all shadow-sm ${admin.status === 'Active'
                                                            ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                                                        }`}>
                                                    {admin.status}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteAdmin(admin._id)}
                                                    className="text-gray-500 hover:text-red-600 transition-colors p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MasterAdmins;