import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { isMobileDevice } from '../utils/performanceOptimization';

const Pass = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prevent zooming on mobile to maintain "App-like" feel
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
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
    }
    setLoading(false);
  }, []);

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

  // Logic for pass details
  const isPaid = user.payment; 
  const type = user.type || "A";
  
  // Minimalist accent colors (Subtle, not neon)
  const getRoleStyle = (r) => {
    switch(r) {
        case 'AAA': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case 'AA': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
        default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'; // Green for participant
    }
  };

  return (
    <div className="h-[100vh] w-full bg-[#050505] text-zinc-100 flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans selection:bg-zinc-800">
      
      {/* Subtle Grain Texture (Optional, adds realism) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- HEADER --- */}
      <div className="w-full pt-8 flex flex-col items-center z-10">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          INVENTO <span>2026</span>
        </h1>
      </div>

      {/* --- MAIN IDENTITY SECTION --- */}
      <div className="flex flex-col items-center w-full z-10 flex-1 justify-center gap-6">
          
          {/* Profile Photo */}
          <div className="relative">
            <div className="w-36 h-36 p-1 border border-zinc-800 bg-[#0a0a0a]">
                <img 
                    src={
                      user.profilePhoto 
                        ? (user.profilePhoto.startsWith('http') 
                            ? user.profilePhoto 
                            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profilePhoto}`)
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                    }
                    onError={(e) => {
                      console.error('Failed to load profile image from:', e.target.src);
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                    }}
                    alt="Profile"
                    className="w-full h-full object-cover opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                />
            </div>
          </div>

          {/* Text Details */}
          <div className="text-center space-y-2 max-w-[85%]">
            <h2 className="text-2xl font-semibold text-white tracking-tight leading-snug">
                {user.name || "Attendee"}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                {user.clgName || "University Not Provided"}
            </p>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 mt-2">
             {/* ID Badge */}
             <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 tracking-wider">
                ID: {user._id ? user._id.slice(-8).toUpperCase() : '------'}
             </div>
             
             {/* Role Badge */}
             <div className={`px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest ${getRoleStyle(type)}`}>
                {type}
             </div>
          </div>

      </div>

      {/* --- FOOTER / QR --- */}
      <div className="w-full pb-2 flex flex-col items-center gap-6 z-10">
          
          {/* QR Container - White for contrast */}
          <div className="bg-white p-3  shadow-lg shadow-zinc-900/50">
            <QRCodeSVG 
                value={`INVENTO:${user._id}:${user.email}`} 
                size={200}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#000000"
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">
                This is the official event pass for INVENTO 2026
            </p>
          </div>
      </div>

    </div>
  );
};

export default Pass;