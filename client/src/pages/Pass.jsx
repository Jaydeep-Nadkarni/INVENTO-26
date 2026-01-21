import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { isMobileDevice } from '../utils/performanceOptimization';
import { apiGet } from '../utils/apiClient';

const Pass = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passSettings, setPassSettings] = useState({ passControl: 'to all' });

  // Prevent zooming on mobile to maintain "App-like" feel
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await apiGet('/api/events/settings/global');
        setPassSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    const originalContent = metaViewport ? metaViewport.getAttribute('content') : 'width=device-width, initial-scale=1';

    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    }

    return () => {
      if (metaViewport) {
        metaViewport.setAttribute('content', originalContent);
      }
    }
  }, []);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const { data } = await apiGet('/api/users/profile', navigate);
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Error refreshing profile:", error);
      }
    };

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        fetchLatestProfile(); // Also fetch fresh data from server
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Check if passes are closed
  if (passSettings.passControl === 'close' || (passSettings.passControl === 'typewise' && passType === 'G')) {
    return (
      <div className="flex min-h-[100dvh] bg-black items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white font-sans">Access Temporarily Suspended</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] leading-relaxed font-sans">
            Passes will be available soon. The system is currently undergoing synchronization.
          </p>
          <button 
            onClick={() => navigate('/profile')}
            className="mt-8 px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors font-sans"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // Logic for pass details
  const isPaid = user.payment;
  const passType = user.passType || "G";

  // Minimalist accent colors
  const getRoleStyle = (type) => {
    switch (type) {
      case 'VIP': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'AAA': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'A': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-red-500 bg-red-500/10 border-zinc-500/20'; // G for General
    }
  };

  return (
    <div className="h-[100vh] w-full bg-[#050505] text-zinc-100 flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans selection:bg-zinc-800">

      {/* Subtle Grain Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* --- HEADER --- */}
      <div className="w-full pt-8 flex flex-col items-center z-10">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
          INVENTO <span className="text-zinc-500 font-light">2026</span>
        </h1>
        <div className="h-[1px] w-12 bg-zinc-800"></div>
      </div>

      {/* --- MAIN IDENTITY SECTION --- */}
      <div className="flex flex-col items-center w-full z-10 flex-1 justify-center gap-4">

        {/* Profile Photo */}
        <div className="relative">
          <div className={`w-36 h-36 p-1 border ${passType === 'VIP' ? 'border-purple-500/50' : 'border-zinc-800'} bg-[#0a0a0a]`}>
            <img
              src={
                user.profilePhoto
                  ? (user.profilePhoto.startsWith('http')
                    ? user.profilePhoto
                    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profilePhoto}`)
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
              }
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
              }}
              alt="Profile"
              className="w-full h-full object-cover opacity-90 transition-all duration-500"
            />
          </div>
          {passType === 'VIP' && (
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">
              INVITED
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="text-center space-y-1.5 max-w-[85%] mt-2">
          <h2 className="text-2xl font-semibold text-white tracking-tight leading-snug">
            {user.name || "Attendee"}
          </h2>
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 uppercase tracking-wide">
            {user.clgName || "University Not Provided"}
          </p>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 mt-1">
          <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 tracking-tighter">
            ID: {user._id ? user._id.toUpperCase() : '------'}
          </div>

          <div className={`px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest ${getRoleStyle(passType)}`}>
            {passType}
          </div>
        </div>


      </div>

      {/* --- FOOTER / QR --- */}
      <div className="w-full pb-4 flex flex-col items-center gap-6 z-10">

        {/* QR Container - White for contrast */}
        <div className="bg-white p-3 shadow-2xl shadow-zinc-900/50">
          <QRCodeSVG
            value={`INVENTO:${user._id}:${user.email}`}
            size={200}
            level="M"
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-zinc-600 uppercase font-mono">
            This is the offical event pass for INVENTO 2026
          </p>
        </div>
      </div>

    </div>
  );
};

export default Pass;