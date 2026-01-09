import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import { ShieldCheck, LogIn, Lock, Fingerprint } from 'lucide-react';

const MasterLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const result = login(email, password);
        if (result.success) {
            if (result.role === 'master') {
                navigate('/master/dashboard');
            } else {
                setError('PERMISSION DENIED: Master credentials required for this terminal.');
                setIsLoading(false);
            }
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white border-t-4 border-white">
            <div className="w-full max-w-lg relative z-10">
                <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
                    <div className="p-10 border-b border-gray-900 bg-gray-900/50 text-center">
                        <div className="w-20 h-20 bg-gray-950 border border-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group">
                            <ShieldCheck className="w-10 h-10 text-white transition-transform group-hover:scale-110" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Central Intelligence</h1>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] mt-2 mb-1">Master Control Terminal</p>
                        <div className="h-0.5 w-12 bg-white mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="p-10">
                        {error && (
                            <div className="mb-8 p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r-md flex items-center gap-4 text-red-400 text-xs font-bold uppercase tracking-wider">
                                <span className="p-1 bg-red-900 rounded border border-red-800 text-white">!</span>
                                Authority Denial: {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Fingerprint className="w-3.5 h-3.5" />
                                    Master Identity (UID)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-md px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder:text-gray-800"
                                    placeholder="master@invento.com"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Lock className="w-3.5 h-3.5" />
                                    Global Encryption Key
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-md px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder:text-gray-800 font-mono"
                                    placeholder="••••••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[11px] rounded transition-all hover:bg-gray-200 shadow-xl active:scale-[0.99] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                        Decrypting Identity...
                                    </span>
                                ) : (
                                    'Initialize Master Session'
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="px-10 py-6 bg-gray-900 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                         <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                             Network Status: Encrypted
                         </div>
                         <div className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                             v1.0.4-LTS-Core
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-8 left-8 text-gray-800 text-7xl font-bold select-none pointer-events-none -rotate-12 opacity-10">
                MASTER ACCESS
            </div>
        </div>
    );
};

export default MasterLogin;
