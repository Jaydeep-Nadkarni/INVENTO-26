import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import { apiPost } from '../utils/apiClient'
import paperTexture from '../assets/UI/paper-texture.jpg'
import bgImage from '../assets/UI/Invento-bg.webp'
import Navbar from '../components/Navbar'

// SVG Icons
const Icons = {
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
};

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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

      if (data.status === 'AUTHENTICATED') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setSuccess('Authentication verified. Accessing secure profile...');
        setTimeout(() => navigate('/profile'), 1000);
      } else if (data.status === 'NEW_USER' || data.status === 'ONBOARDING_REQUIRED') {
        // Prepare user date for transfer to register page
        localStorage.setItem('incompleteUser', JSON.stringify(data.user)); // Store temporary user data
        setError('Agent not recognized. Redirection to registration dossier...');
        setTimeout(() => navigate('/register'), 1500);
      } else {
        throw new Error('Unknown authentication state.');
      }
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
      {isMobile ? (
        <Navbar position="absolute" isMobile={isMobile} />
      ) : (
        <Link 
          to="/" 
          className="fixed top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all group shadow-lg"
        >
          <Icons.ArrowLeft />
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:inline">Home</span>
        </Link>
      )}

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
              </div>

              <div className="space-y-8">
                {/* Google Login Button */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <p className="font-mono text-[9px] sm:text-[10px] text-gray-700 uppercase tracking-[0.1em] sm:tracking-[0.3em]">
                    Identity Verification Required
                  </p>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-10 py-2 sm:py-3 bg-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all group w-full max-w-[260px] sm:max-w-[380px]"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span className="font-mono text-[10px] sm:text-xs font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">
                      {loading ? 'Authenticating...' : 'Sign in with Google'}
                    </span>
                  </motion.button>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-8 p-4 bg-red-900/10 border-l-4 border-red-600 w-full"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-600 animate-pulse"></div>
                          <div>
                            <p className="text-[10px] font-mono font-black text-red-700 uppercase tracking-wider text-left">
                              SECURITY ALERT
                            </p>
                            <p className="text-gray-700 text-[10px] font-mono mt-1 text-left">{error}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-8 p-4 bg-green-900/10 border-l-4 border-green-600 w-full"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-600 animate-pulse"></div>
                          <div>
                            <p className="text-[10px] font-mono font-black text-green-700 uppercase tracking-wider text-left">
                              VERIFICATION CLEAR
                            </p>
                            <p className="text-gray-700 text-[10px] font-mono mt-1 text-left">{success}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-800 text-[10px] font-mono font-bold uppercase tracking-tight flex items-center gap-2"
                  >
                    <span className="text-lg"></span> {error}
                  </motion.div>
                )}

                {/* Info Text */}
                <div className="text-center space-y-4 pt-4 border-t border-gray-300">
                  <div className="pt-2">
                    <p className="text-gray-600 text-[10px] font-mono uppercase mb-2 tracking-widest">
                      Don't have an account?
                    </p>
                    <Link
                      to="/register"
                      className="text-xs text-gray-900 font-black uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-red-700 hover:border-red-700 transition-all"
                    >
                      Register Now
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
