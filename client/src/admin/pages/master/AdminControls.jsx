import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
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
    const { 
        data: { globalSettings: settings }, 
        loading, 
        refreshGlobalSettings, 
        updateGlobalSettings 
    } = useData();

    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        refreshGlobalSettings();
    }, []);

    const handleUpdate = async (newSettings) => {
        setUpdating(true);
        const success = await updateGlobalSettings(newSettings);
        if (success) {
            setMessage({ type: 'success', text: 'System configuration protocols updated successfully.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
            setMessage({ type: 'error', text: 'Override failed. Check system permissions.' });
        }
        setUpdating(false);
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            <Sidebar panelType="master" />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 border-b border-gray-200 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Master Authority Override</span>
                        </div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">Global Parameters</h1>
                    </header>

                    {message.text && (
                        <div className={`mb-8 p-4 rounded flex items-center gap-3 border ${
                            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
                        </div>
                    )}

                    <div className="grid gap-8">
                        {/* Registration Toggle */}
                        <section className="bg-white border border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-black uppercase italic mb-2 text-gray-900">Registration Sentinel</h2>
                                    <p className="text-xs text-gray-500 font-medium max-w-md">
                                        When engaged, all event registrations across the entire fest network will be instantly suspended.
                                    </p>
                                </div>
                                <button 
                                    disabled={updating}
                                    onClick={() => handleUpdate({ registrationsOpen: !settings.registrationsOpen })}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
                                        settings.registrationsOpen ? 'bg-green-600' : 'bg-gray-200'
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
                        <section className="bg-white border border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Ticket className="w-6 h-6 text-amber-500" />
                                <h2 className="text-xl font-black uppercase italic text-gray-900">Access Token Protocol</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {[
                                    { id: 'to all', label: 'Universal Open', desc: 'Passes available to all qualified users.' },
                                    { id: 'typewise', label: 'Tiered Access', desc: 'Limited availability based on user pass type.' },
                                    { id: 'close', label: 'Network Lockdown', desc: 'Disable pass viewing for everyone.' }
                                ].map((choice) => (
                                    <button
                                        key={choice.id}
                                        disabled={updating}
                                        onClick={() => handleUpdate({ passControl: choice.id })}
                                        className={`p-4 border rounded-lg text-left transition-all ${
                                            updating ? 'opacity-50 cursor-not-allowed' : ''
                                        } ${
                                            settings.passControl === choice.id 
                                            ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                            : 'bg-white border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <div className={`text-xs font-black uppercase mb-1 ${settings.passControl === choice.id ? 'text-white' : 'text-gray-500'}`}>
                                            {choice.label}
                                        </div>
                                        <div className={`text-[10px] leading-tight ${settings.passControl === choice.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {choice.desc}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                    Current encryption mode relies on backend verification. Changes propagate in real-time to user-facing pages.
                                </p>
                            </div>
                        </section>
                    </div>

                    <footer className="mt-12 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">
                            End of Authority Parameters // System_v4.2
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminControls;
