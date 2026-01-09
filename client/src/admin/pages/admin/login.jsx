import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import bgImage from '../../../assets/UI/Invento-bg.jpg';

const AdminLogin = () => {
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
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const result = login(email, password);
        if (result.success) {
            if (result.role === 'master') {
                navigate('/master/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden font-mono">
            {/* Background Texture */}
            <div 
                className="fixed inset-0 bg-cover bg-center brightness-[0.2] grayscale contrast-125 pointer-events-none"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-[#0d0d0d]/90 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-8">
                    <h1 className="text-red-700 font-serif font-black text-4xl tracking-tighter uppercase mb-2" style={{ textShadow: '2px 2px 0px #000' }}>
                        INVENTO <span className="text-sm align-top text-red-600">'26</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em]">
                        [ Restricted Personnel Only ]
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-900/20 border border-red-900/50 text-red-500 text-xs uppercase tracking-wider text-center animate-pulse">
                        ACCESS DENIED: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 px-1">
                            Credential ID (Email)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-red-700 transition-colors"
                            placeholder="agent@invento.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 px-1">
                            Auth Key (Password)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-red-700 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-red-700 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-red-800 transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Authenticating...
                            </span>
                        ) : (
                            'Initiate Session'
                        )}
                    </button>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-center gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-red-700/40"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-red-700/20"></div>
                    </div>
                </form>
            </div>
            
            <div className="absolute bottom-4 right-4 text-white/5 text-[8px] uppercase tracking-widest pointer-events-none">
                ENCRYPTION: AES-256 | STATUS: SECURE
            </div>
        </div>
    );
};

export default AdminLogin;
