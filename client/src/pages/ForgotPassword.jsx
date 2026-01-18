import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import paperTexture from '../assets/UI/paper-texture.jpg';

const ForgotPassword = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-red-900/5 pointer-events-none"></div>

            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-900 text-stone-200 font-mono text-xs uppercase tracking-widest border border-stone-700 transition-all rounded shadow-lg backdrop-blur-sm"
                title="Return to Previous Page"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* File Folder Tab Look */}
                <div className="absolute -top-8 left-0 bg-[#d4c5a3] w-32 h-10 rounded-t-lg z-0 border-t-2 border-l-2 border-r-2 border-[#8c7e60]"></div>

                {/* Main Paper Container */}
                <div
                    className="relative bg-[#f4f1ea] p-8 md:p-12 shadow-[15px_15px_30px_rgba(0,0,0,0.7)] border-2 border-[#8c7e60] z-10"
                    style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
                >
                    {/* DEPRECATED Stamp */}
                    <div className="absolute top-10 right-8 transform rotate-12 opacity-80 pointer-events-none mix-blend-multiply">
                        <div className="border-4 border-red-800 p-2 rounded-sm">
                            <span className="text-red-800 font-black text-lg tracking-widest uppercase">DEPRECATED</span>
                        </div>
                    </div>

                    <div className="mb-8 text-center relative z-20">
                        <h2 className="text-4xl font-black text-[#1a1a1a] uppercase tracking-widest mb-2">
                            Password Reset
                        </h2>
                        <div className="h-1 w-24 bg-[#1a1a1a] mx-auto mb-4"></div>
                        <p className="text-sm font-mono text-red-800 font-bold uppercase tracking-wider mb-6">
                            No Longer Available
                        </p>
                    </div>

                    {/* Deprecation Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="bg-red-50 border-l-4 border-red-800 p-6">
                            <h3 className="text-lg font-black text-red-800 uppercase tracking-wider mb-3">
                                ⚠️ Authentication System Updated
                            </h3>
                            <p className="text-red-900 font-mono text-sm leading-relaxed mb-4">
                                Password-based authentication has been deprecated in favor of secure Google Sign-In.
                            </p>
                            <p className="text-red-900 font-mono text-sm leading-relaxed mb-4">
                                Password reset is no longer available. All users must authenticate using their Google Account.
                            </p>
                            <div className="bg-red-100 p-4 rounded mt-4">
                                <p className="text-red-800 font-bold text-xs uppercase tracking-widest mb-2">
                                    How to regain access:
                                </p>
                                <ol className="text-red-800 text-sm font-mono space-y-2">
                                    <li className="flex items-start">
                                        <span className="font-bold mr-3">1.</span>
                                        <span>Visit the login page</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-3">2.</span>
                                        <span>Click "Sign in with Google"</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-3">3.</span>
                                        <span>Use the Google Account linked to your email</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-3">4.</span>
                                        <span>If onboarding needed, complete your profile</span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="w-full bg-[#1a1a1a] text-[#f4f1ea] py-4 font-black text-sm uppercase tracking-widest hover:bg-[#333] transition-colors shadow-[4px_4px_0px_#8c7e60]"
                            >
                                → Go to Login
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/register')}
                                className="w-full bg-[#f4f1ea] text-[#1a1a1a] py-4 font-black text-sm uppercase tracking-widest border-2 border-[#1a1a1a] hover:bg-[#e8e4da] transition-colors shadow-[4px_4px_0px_#8c7e60]"
                            >
                                → Create Account
                            </motion.button>
                        </div>

                        {/* Support Info */}
                        <div className="text-center pt-4 border-t border-[#8c7e60]">
                            <p className="text-[10px] font-mono text-[#5c5446] uppercase tracking-widest mb-2">
                                Need Help?
                            </p>
                            <p className="text-xs text-[#5c5446]">
                                Contact the Invento team if you have questions about the new authentication system.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
