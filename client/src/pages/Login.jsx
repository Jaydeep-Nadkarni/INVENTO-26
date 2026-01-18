import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import { apiPost } from '../utils/apiClient'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.webp'
import Navbar from '../components/Navbar'

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
};

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(isMobileDevice())

  // Listen for mobile/desktop switches
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const { data } = await apiPost('/api/users/auth/google', { idToken }, navigate);

      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      // Redirect directly to profile page as requested
      navigate('/profile');
    } catch (err) {
      console.error('Google Auth Error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gray-900"
      style={isMobile ? {
        backgroundImage: 'none',
        background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)'
      } : {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-center min-h-screen p-6"
      >
        <div className="w-full max-w-md">
          {/* Document Style Card */}
          <div className="relative">
            <div
              className="p-8 md:p-10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden border-2 border-gray-800 rounded-sm"
              style={{
                backgroundColor: '#f5f1e8',
                backgroundImage: `url(${paperTexture})`,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-amber-50/20 mix-blend-multiply pointer-events-none" />

              {/* Header */}
              <div className="mb-10 border-b-2 border-red-700/30 pb-6 text-center">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    Login
                  </h1>
                  <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 uppercase">Identity</span>
                </div>
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                  Authentication Required to Proceed
                </p>
              </div>

              <div className="space-y-8">
                {/* Google Login Button */}
                <div className="space-y-4">
                  <p className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-widest text-center">
                    Secure Single Sign-On
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[5px_5px_0px_rgba(0,0,0,0.3)]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                        </svg>
                        Sign in with Google
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-800 text-[10px] font-mono font-bold uppercase tracking-tight flex items-center gap-2"
                  >
                    <span className="text-lg">⚠️</span> {error}
                  </motion.div>
                )}

                {/* Info Text */}
                <div className="text-center space-y-4 pt-4 border-t border-gray-300">
                  <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                    By logging in, you agree to the <br/>
                    <span className="text-gray-900 font-bold">Terms of Service</span> and <span className="text-gray-900 font-bold">Privacy Protocol</span>
                  </p>
                  
                  <div className="pt-2">
                    <p className="text-gray-400 text-[10px] font-mono uppercase mb-2 tracking-widest">
                      New Agent?
                    </p>
                    <Link
                      to="/register"
                      className="text-xs text-gray-900 font-black uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-red-700 hover:border-red-700 transition-all"
                    >
                      Initialize Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
