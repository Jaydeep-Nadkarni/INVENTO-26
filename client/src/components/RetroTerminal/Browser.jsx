import React, { useState, useEffect } from 'react';
import { Shield, Lock, Radio, Terminal, AlertTriangle, FileText, Home } from 'lucide-react';

const Browser = () => {
  const [viewMode, setViewMode] = useState('home');
  const [url, setUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (link) => {
    setIsLoading(true);
    setUrl(link);
    setViewMode('browser');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      // Using Google Search with &igu=1 for better iframe compatibility
      navigateTo(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&igu=1`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 font-mono text-stone-900 overflow-hidden relative selection:bg-red-900 selection:text-white">
      
      {/* --- CRT SCANLINE OVERLAY --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-40"></div>
      
      {/* --- TOP STATUS BAR --- */}
      <div className="bg-stone-900 text-stone-50 text-[10px] p-1 flex justify-between items-center border-b-2 border-red-900 z-10">
        <div className="flex gap-4">
            <span className="flex items-center gap-1 text-green-500 animate-pulse"><Radio size={10} /> SIGNAL: ENCRYPTED (AES-256)</span>
            <span className="text-stone-500">MEM: 0x44F2...1A</span>
        </div>
        <div className="flex gap-4 uppercase tracking-widest">
            <span>{time.toLocaleTimeString()} // ZULU</span>
            <span className="text-red-500 font-bold">AUTH: LEVEL 4</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        {viewMode === 'home' ? (
          <div className="min-h-full p-8 md:p-16 flex flex-col items-center justify-center relative">
            
            {/* BACKGROUND WATERMARK */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Shield size={400} />
            </div>

            <div className="max-w-3xl w-full bg-stone-50 border-2 border-stone-800 p-1 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <div className="border border-stone-300 p-8 relative overflow-hidden">
                
                {/* STAMPS */}
                <div className="absolute top-4 right-4 border-2 border-red-800 text-red-800 px-2 py-1 text-xs font-black rotate-12 opacity-80 uppercase tracking-widest">
                    For Official Use Only
                </div>

                {/* HEADER */}
                <div className="mb-12 border-b-2 border-stone-800 pb-6">
                  <div className="flex items-end gap-4 mb-2">
                    <h1 className="text-5xl font-black italic tracking-tighter text-stone-900 font-serif">
                        INVENTO
                    </h1>
                    <span className="bg-stone-900 text-white px-2 py-0.5 text-xs font-bold mb-2">V.4.0.26</span>
                  </div>
                  <p className="text-xs font-mono text-stone-500 uppercase flex items-center gap-2">
                    <Terminal size={12} /> Secure Gateway Interface // Terminal Node #881
                  </p>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                  
                  {/* LEFT COL: LINKS */}
                  <div className="md:col-span-7 space-y-6">
                    <h2 className="text-sm font-bold bg-stone-200 inline-block px-1 uppercase border-l-4 border-stone-800">
                        Database Access
                    </h2>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <button 
                            onClick={() => navigateTo('https://www.google.com/search?q=kle+tech+bgm&igu=1')} 
                            className="group flex items-center gap-3 w-full hover:bg-stone-900 hover:text-white transition-all p-1"
                        >
                            <span className="text-stone-400 group-hover:text-red-500">[01]</span>
                            <span className="underline decoration-stone-400 decoration-dotted underline-offset-4 group-hover:no-underline">GOOGLE INTEL (SECURE BYPASS)</span>
                        </button>
                      </li>
                      <li>
                        <button 
                            onClick={() => navigateTo('https://en.wikipedia.org/wiki/Special:Random')} 
                            className="group flex items-center gap-3 w-full hover:bg-stone-900 hover:text-white transition-all p-1"
                        >
                            <span className="text-stone-400 group-hover:text-red-500">[02]</span>
                            <span className="underline decoration-stone-400 decoration-dotted underline-offset-4 group-hover:no-underline">ARCHIVE (RANDOM WIKI)</span>
                        </button>
                      </li>
                      <li>
                        <button className="group flex items-center gap-3 w-full hover:bg-red-900 hover:text-white transition-all p-1 cursor-not-allowed opacity-50">
                            <span className="text-red-900 group-hover:text-white">[XX]</span>
                            <span>PERSONNEL DECRYPTION (OFFLINE)</span>
                            <Lock size={12} />
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* RIGHT COL: STATUS BOX */}
                  <div className="md:col-span-5 flex flex-col justify-between border border-stone-300 p-4 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
                    <div>
                        <h2 className="text-[10px] font-bold text-red-600 mb-2 uppercase tracking-widest border-b border-red-200 pb-1 flex items-center gap-2">
                            <AlertTriangle size={10} /> Threat Level
                        </h2>
                        <p className="text-[10px] leading-relaxed text-stone-600 font-sans text-justify">
                            Global surveillance nodes detected. Local encryption protocols active. 
                            <br/><br/>
                            <span className="font-mono bg-stone-200 text-stone-800 px-1">IP: MASKED</span>
                        </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-stone-300">
                        <div className="flex justify-between text-[9px] uppercase font-bold text-stone-400">
                            <span>Uplink</span>
                            <span>98%</span>
                        </div>
                        <div className="w-full bg-stone-200 h-1 mt-1">
                            <div className="bg-stone-800 h-1 w-[98%] animate-pulse"></div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* SEARCH SECTION */}
                <div className="space-y-4">
                    <label className="text-xs font-bold flex items-center gap-2">
                        <FileText size={12} />
                        MANUAL OVERRIDE (INTEL SEARCH)
                    </label>
                    <form onSubmit={handleSearchSubmit} className="flex border-2 border-stone-800 shadow-sm group focus-within:ring-2 focus-within:ring-red-900 focus-within:ring-offset-2 transition-all">
                        <div className="bg-stone-800 text-stone-50 px-3 py-2 flex items-center justify-center font-bold text-sm">
                            {'>'}
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ENTER QUERY OBJECTIVE..."
                            className="flex-1 bg-white p-3 text-sm font-bold outline-none font-mono placeholder:text-stone-300 uppercase"
                        />
                        <button type="submit" className="bg-red-900 text-white px-6 py-2 text-xs font-bold hover:bg-red-800 uppercase tracking-wider transition-colors">
                            Execute
                        </button>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="mt-12 pt-4 border-t border-stone-200 flex justify-between items-center text-[9px] text-stone-400 uppercase">
                    <span>© 1996 - 2026 THE AGENCY.</span>
                    <span className="font-mono">ID: 887-221-X</span>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* BROWSER VIEW */
          <div className="w-full h-full flex flex-col bg-stone-200">
             <div className="bg-stone-800 text-stone-400 px-4 py-1.5 flex justify-between items-center text-xs border-b border-black">
                <div className="flex gap-4 items-center truncate flex-1 mr-4">
                    <button 
                        onClick={() => { setViewMode('home'); setIsLoading(false); }}
                        className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-700 hover:bg-stone-600 text-stone-200 transition-colors border border-stone-600 text-[10px]"
                        title="Return Home"
                    >
                        <Home size={12} /> HOME
                    </button>
                    <div className="flex gap-2 items-center truncate">
                        <span className={`text-[8px] ${isLoading ? 'text-yellow-500 animate-pulse' : 'text-green-500'}`}>●</span>
                        <span className="font-mono uppercase text-[10px] truncate">{url}</span>
                    </div>
                </div>
                <button 
                    onClick={() => { setViewMode('home'); setIsLoading(false); }}
                    className="hover:text-red-500 transition-colors uppercase text-[10px] font-bold"
                >
                    [TERMINATE SESSION]
                </button>
             </div>
            <div className="flex-1 relative">
                <iframe
                    src={url}
                    onLoad={() => setIsLoading(false)}
                    className="w-full h-full border-none grayscale-[20%] contrast-125"
                    title="Retro Browser Content"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
                {isLoading && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 animate-[loading_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                )}
            </div>
          </div>
        )}
      </div>
      
      {/* GLOBAL CSS FOR SCANLINES/ANIMATIONS */}
      <style>{`
        @keyframes loading {
            0% { width: 0%; opacity: 1; }
            50% { width: 70%; opacity: 1; }
            100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Browser;
