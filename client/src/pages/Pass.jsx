import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import paperTexture from '../assets/UI/paper-texture.jpg';
import { isMobileDevice } from '../utils/performanceOptimization';

const Pass = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());

    // Disable pinch-zoom for this page
    const metaViewport = document.querySelector('meta[name="viewport"]');
    const originalContent = metaViewport ? metaViewport.getAttribute('content') : 'width=device-width, initial-scale=1';
    
    if (metaViewport) {
       metaViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    }
    
    return () => {
        // Re-enable on cleanup
        if (metaViewport) {
           metaViewport.setAttribute('content', originalContent);
        }
    }
  }, []);

  useEffect(() => {
    // Get user from local storage (synced on login/profile load)
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
        <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
             <div className="text-[#f5c842] font-mono animate-pulse uppercase tracking-widest">Retrieving Clearance...</div>
        </div>
    );
  }

  if (!user) return null;

  // Determine pass type based on payment status
  // TODO: Re-enable payment check after testing phase
  const passType = "OFFICIAL AGENT"; // user.payment ? "OFFICIAL AGENT" : "PENDING CLEARANCE"
  const passColor = "#f5c842"; // Gold for paid, gray for unpaid

  // User without payment/clearance shouldn't see a pass (or sees a restricted one)
  // TODO: Re-enable access denial after testing phase
  // if (!user.payment) {
  //   return (
  //     <div className="min-h-[100vh] w-full bg-[#0e0e0e] flex items-center justify-center font-sans p-4">
  //          <div className="text-center space-y-4 max-w-sm">
  //              <div className="text-red-600 text-5xl mb-4">🚫</div>
  //              <h2 className="text-2xl text-white font-bold uppercase tracking-wider">Access Denied</h2>
  //              <p className="text-gray-400">Your registration is incomplete. Please complete payment to receive your official clearance pass.</p>
  //              <div className="mt-8 border border-red-900/50 bg-red-900/10 p-4 rounded text-red-400 font-mono text-sm">
  //                  STATUS: PENDING PAYMENT
  //              </div>
  //          </div>
  //     </div>
  //   )
  // }

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#0e0e0e] flex items-center justify-center relative overflow-hidden font-sans p-4 touch-none">
      
      {/* Background Noise/Grain Overlay - Disable on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }} 
        />
      )}

      {/* Main Pass Card */}
      <div 
        className="relative z-10 w-full bg-[#161616] text-[#e0e0e0] flex flex-col shadow-2xl overflow-hidden"
        style={{
          width: 'min(92vw, 420px)',
          height: 'min(92vh, 720px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Paper Texture Overlay (Multiply) */}
        <div 
          className="absolute inset-0 z-[1] opacity-10 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
        />

        {/* --- Header Section --- */}
        <div className="relative z-10 bg-[#1a1a1a] p-6 border-b border-white/10 flex flex-col items-center justify-center gap-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f5c842] via-red-600 to-[#f5c842]" />
          
          <h1 className="text-3xl font-black tracking-tighter text-[#eaeaea] font-[Georgia]" style={{ letterSpacing: '-0.05em' }}>
            INVENTO <span className="text-red-700">2026</span>
          </h1>
          
          <div className="bg-[#f5c842] text-black text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-sm">
            {passType}
          </div>
        </div>

        {/* --- User Details Section --- */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 space-y-6">
            
            {/* Profile Photo with Spy Ring */}
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-lg grayscale hover:grayscale-0 transition-all duration-500">
                    <img 
                      src={user.profilePhoto ? (user.profilePhoto.startsWith('data:') || user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "Agent"}`}
                      alt="Agent"
                      className="w-full h-full object-cover"
                    />
                </div>
                {/* Rotating Ring */}
                <div className={`absolute -inset-2 border border-[#f5c842]/30 rounded-full ${isMobile ? '' : 'animate-[spin_10s_linear_infinite]'}`} />
                <div className={`absolute -inset-2 border-t-2 border-[#f5c842] rounded-full ${isMobile ? '' : 'animate-[spin_3s_linear_infinite]'}`} />
            </div>

            {/* Name & College */}
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide font-sans">
                  {user.name || "Unknown Agent"}
                </h2>
                <div className="flex flex-col items-center justify-center gap-2 text-white/50 text-xs uppercase tracking-widest font-mono">
                   <span>{user.clgName || "Unknown Territory"}</span>
                   <span className="text-red-500/80">ID: {user._id ? user._id.slice(-6).toUpperCase() : '------'}</span>
                </div>
            </div>

            {/* Registration Type Badge */}
            <div className="w-full flex justify-center">
                 <div className="border border-white/20 bg-white/5 px-6 py-2 rounded-sm backdrop-blur-sm">
                    <span className="text-[#f5c842] font-mono text-sm tracking-[0.2em] uppercase">
                        {user.role === 'admin' ? 'ADMINISTRATOR' : (user.payment ? "VERIFIED AGENT" : "PARTICIPANT")}
                    </span>
                 </div>
            </div>

            {/* --- QR Code Section --- */}
            <div className="bg-white p-3 rounded-sm shadow-inner relative group">
                {/* Corner Marks */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-black" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-black" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-black" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-black" />
                
                <QRCodeSVG 
                    value={`INVENTO:${user._id}:${user.email}`} 
                    size={180}
                    level="H"
                />
            </div>
            
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest animate-pulse">
                SCAN TO VERIFY IDENTITY
            </p>
        </div>

        {/* --- Footer Warning --- */}
        <div className="relative z-10 bg-[#0a0a0a] p-4 border-t border-white/10">
            <div className="flex items-start gap-3 opacity-60">
                <div className="text-red-600 text-xl">⚠️</div>
                <p className="text-[9px] leading-relaxed font-mono uppercase text-white/70 text-justify">
                    This pass is strictly non-transferable. Unauthorized possession constitutes a breach of protocol. 
                    Top Secret Clearance Required.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Pass;
