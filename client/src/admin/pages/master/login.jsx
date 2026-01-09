import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import bgImage from '../../../assets/UI/Invento-bg.jpg';

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

        // Simulate high-security verification delay
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
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden font-mono text-white">
            {/* Background Texture */}
            <div 
                className="fixed inset-0 bg-cover bg-center brightness-[0.1] contrast-150 grayscale pointer-events-none"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-black/80 backdrop-blur-md"></div>

            <div className="relative z-10 w-full max-w-lg p-1 px-1 bg-gradient-to-r from-red-900/50 via-red-700/50 to-red-900/50 rounded-sm">
                <div className="bg-[#050505] p-10 shadow-[0_0_100px_rgba(0,0,0,1)]">
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 border border-red-700/30 mb-6 bg-red-700/5">
                            <i className="fas fa-microchip text-4xl text-red-700"></i>
                        </div>
                        <h1 className="text-red-700 font-serif font-black text-5xl tracking-tighter uppercase mb-2 flex items-center justify-center gap-4">
                            <span className="h-px w-8 bg-red-700/30"></span>
                            MASTER
                            <span className="h-px w-8 bg-red-700/30"></span>
                        </h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black italic">
                            [ System Authority Level 0 ]
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-950/30 border border-red-700/50 text-red-500 text-[10px] uppercase tracking-widest text-center animate-pulse font-black">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            CRITICAL ERROR: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-gray-600 text-[9px] uppercase tracking-[0.4em] font-black">
                                MASTER IDENTITY (UID)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900/50 text-xs">$</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[#0d0d0d] border border-white/5 pl-10 pr-4 py-4 text-white focus:outline-none focus:border-red-700/50 transition-all text-sm tracking-widest"
                                    placeholder="master@invento.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-gray-600 text-[9px] uppercase tracking-[0.4em] font-black">
                                ENCRYPTION KEY (RSA)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900/50 text-xs">#</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-[#0d0d0d] border border-white/5 pl-10 pr-4 py-4 text-white focus:outline-none focus:border-red-700/50 transition-all text-sm tracking-widest"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-gradient-to-r from-red-800 to-red-600 text-white font-black uppercase tracking-[0.5em] text-[10px] hover:brightness-125 transition-all shadow-[0_0_30px_rgba(185,28,28,0.2)] active:scale-[0.98] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Verifying Biometrics...
                                </span>
                            ) : (
                                'Authorize Access'
                            )}
                        </button>
                        
                        <div className="flex justify-between items-center px-2">
                             <div className="flex gap-2">
                                 {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-red-900/30"></div>)}
                             </div>
                             <span className="text-[8px] text-gray-700 uppercase tracking-widest">Invento Central Command</span>
                             <div className="flex gap-2">
                                 {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-red-900/30"></div>)}
                             </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="absolute top-10 left-10 pointer-events-none opacity-20 hidden lg:block">
                <div className="text-[10px] space-y-2">
                    <p className="text-red-700 font-bold tracking-widest">CORE STATUS: STABLE</p>
                    <p className="text-gray-500">MEMORY_USAGE: 32%</p>
                    <p className="text-gray-500">NODES_CONNECTED: 08/08</p>
                    <p className="text-gray-500">ACTIVE_ENCRYPTION: AES-XTS-256</p>
                </div>
            </div>
        </div>
    );
};

export default MasterLogin;
