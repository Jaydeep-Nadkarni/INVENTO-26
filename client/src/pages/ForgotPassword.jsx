import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import paperTexture from '../assets/UI/paper-texture.jpg';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    const otpRefs = useRef([]);

    // Handle OTP Input Change
    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto Focus Next
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    // Handle Backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMsg('');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users/send-login-otp`, { email });
            setMsg('Encrypted frequency established. Check your inbox.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Signal lost. Email not found in archive.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const otpCode = otp.join('');
        if (otpCode.length < 6) {
            setError('Incomplete sequence.');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/verify-login-otp`, { email, otp: otpCode });
            // Save Token
            localStorage.setItem('token', data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied. Invalid Code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-vt323">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-red-900/5 pointer-events-none"></div>

            {/* Back Button Outside Card */}
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
                    {/* CONFIDENTIAL Stamp */}
                    <div className="absolute top-10 right-8 transform rotate-12 opacity-80 pointer-events-none mix-blend-multiply">
                        <div className="border-4 border-red-800 p-2 rounded-sm">
                            <span className="text-red-800 font-black text-xl tracking-widest uppercase">RESTRICTED</span>
                        </div>
                    </div>

                    <div className="mb-8 text-center relative z-20">
                        <h2 className="text-4xl font-black text-[#1a1a1a] uppercase tracking-widest mb-2 font-teko">
                            Account Recovery
                        </h2>
                        <div className="h-1 w-24 bg-[#1a1a1a] mx-auto mb-2"></div>
                        <p className="text-sm font-mono text-red-800 font-bold uppercase tracking-wider">
                            Authorized Personnel Only
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSendOTP}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-xs font-bold font-mono text-[#5c5446] uppercase mb-2 tracking-widest">
                                        Agent Email Frequency
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#e8e4da] border-b-2 border-[#8c7e60] p-3 text-[#1a1a1a] font-mono focus:outline-none focus:border-[#1a1a1a] transition-colors placeholder-[#8c7e60]/50"
                                        placeholder="agent@hq.com"
                                        required
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1a1a1a] text-[#f4f1ea] py-4 font-black text-xl uppercase tracking-[0.2em] hover:bg-[#333] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[4px_4px_0px_#8c7e60]"
                                >
                                    {loading ? 'Transmitting...' : 'Send Access Code'}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleVerify}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <p className="font-mono text-xs text-[#5c5446] uppercase">Code transmitted to: <span className="font-bold text-[#1a1a1a]">{email}</span></p>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-[10px] text-red-700 underline mt-1 font-bold uppercase tracking-wider hover:text-red-900"
                                    >
                                        Change Frequency
                                    </button>
                                </div>

                                <div className="flex justify-between gap-2 max-w-[300px] mx-auto">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-10 h-12 bg-[#e8e4da] border-2 border-[#8c7e60] text-center text-2xl font-bold text-[#1a1a1a] font-mono focus:outline-none focus:border-red-800 transition-colors"
                                        />
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-800 text-[#f4f1ea] py-4 font-black text-xl uppercase tracking-[0.2em] hover:bg-red-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[4px_4px_0px_#1a1a1a]"
                                >
                                    {loading ? 'Verifying...' : 'Unlock Dossier'}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 bg-red-900/10 border-l-4 border-red-800 p-3"
                        >
                            <p className="text-red-900 font-bold font-mono text-xs uppercase text-center">{error}</p>
                        </motion.div>
                    )}

                    {msg && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 bg-green-900/10 border-l-4 border-green-800 p-3"
                        >
                            <p className="text-green-900 font-bold font-mono text-xs uppercase text-center">{msg}</p>
                        </motion.div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
