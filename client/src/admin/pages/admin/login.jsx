import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Mail } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-900">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 text-center relative">
                        <button 
                            onClick={() => navigate('/')}
                            className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                            title="Return to Home"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <LogIn className="w-8 h-8 text-gray-900" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Portal</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Personnel Authentication Required</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-md flex items-center gap-3 text-red-700 text-sm font-bold">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Mail className="w-3 h-3" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all placeholder:text-gray-300"
                                    placeholder="your-team@invento.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Lock className="w-3 h-3" />
                                    Password Key
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-md hover:bg-gray-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Authenticating...
                                    </span>
                                ) : (
                                    'Secure Login'
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invento '26 Core</span>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authorized Access Only</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
