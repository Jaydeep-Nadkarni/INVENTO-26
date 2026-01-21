import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { apiGet, apiPut } from '../../../utils/apiClient';
import { 
    ToggleLeft, 
    ToggleRight, 
    ShieldCheck, 
    Ticket, 
    Lock, 
    RefreshCcw,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';

const AdminControls = () => {
    const [settings, setSettings] = useState({
        passControl: 'to all',
        registrationsOpen: true
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await apiGet('/api/admins/settings/global');
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            setMessage({ type: 'error', text: 'Failed to synchronize with central command.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (newSettings) => {
        try {
            setUpdating(true);
            const { data } = await apiPut('/api/admins/settings/global', newSettings);
            setSettings(data);
            setMessage({ type: 'success', text: 'System configuration protocols updated successfully.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Update failed:", error);
            setMessage({ type: 'error', text: 'Override failed. Check system permissions.' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-black items-center justify-center">
                <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 border-b border-gray-800 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Master Authority Override</span>
                        </div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Global Parameters</h1>
                    </header>

                    {message.text && (
                        <div className={`mb-8 p-4 rounded flex items-center gap-3 border ${
                            message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
                        </div>
                    )}

                    <div className="grid gap-8">
                        {/* Registration Toggle */}
                        <section className="bg-gray-950 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-black uppercase italic mb-2">Registration Sentinel</h2>
                                    <p className="text-xs text-gray-500 font-medium max-w-md">
                                        When engaged, all event registrations across the entire fest network will be instantly suspended.
                                    </p>
                                </div>
                                <button 
                                    disabled={updating}
                                    onClick={() => handleUpdate({ registrationsOpen: !settings.registrationsOpen })}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
                                        settings.registrationsOpen ? 'bg-green-600' : 'bg-gray-800'
                                    }`}
                                >
                                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                        settings.registrationsOpen ? 'translate-x-9' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full animate-pulse ${settings.registrationsOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Status: {settings.registrationsOpen ? 'Active_Operations' : 'Registrations_Suspended'}
                                </span>
                            </div>
                        </section>

                        {/* Pass Distribution Control */}
                        <section className="bg-gray-950 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <Ticket className="w-6 h-6 text-amber-500" />
                                <h2 className="text-xl font-black uppercase italic">Access Token Protocol</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {[
                                    { id: 'to all', label: 'Universal Open', desc: 'Passes available to all qualified users.' },
                                    { id: 'typewise', label: 'Tiered Access', desc: 'Limited availability based on user pass type.' },
                                    { id: 'close', label: 'Network Lockdown', desc: 'Disable pass viewing for everyone.' }
                                ].map((choice) => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleUpdate({ passControl: choice.id })}
                                        className={`p-4 border rounded-lg text-left transition-all ${
                                            settings.passControl === choice.id 
                                            ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                            : 'bg-black border-gray-800 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className={`text-xs font-black uppercase mb-1 ${settings.passControl === choice.id ? 'text-white' : 'text-gray-400'}`}>
                                            {choice.label}
                                        </div>
                                        <div className={`text-[10px] leading-tight ${settings.passControl === choice.id ? 'text-blue-100' : 'text-gray-600'}`}>
                                            {choice.desc}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-900 flex items-center gap-4">
                                <Lock className="w-4 h-4 text-gray-600" />
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                                    Current encryption mode relies on backend verification. Changes propagate in real-time to user-facing pages.
                                </p>
                            </div>
                        </section>
                    </div>

                    <footer className="mt-12 text-center">
                        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">
                            End of Authority Parameters // System_v4.2
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminControls;
