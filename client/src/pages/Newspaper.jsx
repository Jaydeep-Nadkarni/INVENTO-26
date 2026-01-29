import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiGet } from '../utils/apiClient';
import paperTexture from '../assets/UI/paper-texture.jpg';
import breakingLogo from '../assets/UI/BREAKING.png';
import kleLogo from '../assets/UI/KLE-TECH.png';

const Newspaper = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);

    const fetchNotices = async () => {
        try {
            const { data } = await apiGet('/api/notices');
            if (data.success) {
                setNotices(data.data);
            }
        } catch (error) {
            console.error("Error fetching notices:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeather = async () => {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=15.8528&longitude=74.5045&current=temperature_2m,weather_code');
            const data = await response.json();
            setWeather(data.current);
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    const getWeatherDesc = (code) => {
        if (code === 0) return "Clear Skies";
        if (code <= 3) return "Partly Cloudy";
        if (code === 45 || code === 48) return "Foggy Conditions";
        if (code >= 51 && code <= 67) return "Rainy Outlook";
        if (code >= 80 && code <= 82) return "Passing Showers";
        if (code >= 95) return "Thunderstorm Alert";
        return "Variable Intel";
    };

    useEffect(() => {
        fetchNotices();
        fetchWeather();
        // Live polling every 30 seconds
        const interval = setInterval(() => {
            fetchNotices();
            fetchWeather();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="min-h-screen w-full bg-[#1a1a1a] flex flex-col items-center py-10 px-4 md:px-10"
            style={{
                backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)`
            }}
        >
            {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="fixed top-4 left-4 z-40 p-2 hover:-translate-x-1 transition-transform flex items-center gap-2"
                    title="Return to Base"
                >
                    <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform text-white" />
                    <span className="font-medium text-white">Home</span>
                </button>

            {/* Newspaper Container */}
            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative w-full max-w-5xl overflow-hidden flex flex-col"
                style={{
                    backgroundImage: `url(${paperTexture})`,
                    coverage: 'no-repeat',
                    backgroundSize: 'cover',
                    minHeight: '250vh'
                }}
            >
                

                {/* Newspaper Header */}
                <div className="border-b-4 border-black mx-6 md:mx-10 mt-10 md:mt-16 pb-4 mb-2 flex flex-col items-center">
                    <h1 className="text-4xl md:text-8xl font-black font-serif leading-tight mb-8 uppercase">
                        INVENTO TIMES
                    </h1>
                    <div className="w-full flex justify-between items-end border-b border-black/20 pb-1 mb-6 text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] font-bold opacity-70">
                        <span>Special Edition</span>
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>Price: 10Rs</span>
                    </div>

                    <Link to="/" className="w-full flex justify-center">
                        <img
                            src={breakingLogo}
                            alt="INVENTO TIMES"
                            className="w-full max-w-3xl h-auto mb-6"
                            style={{mixBlendMode: 'multiply'}}
                        />
                    </Link>

                    <div className="w-full border-t-2 border-black pt-2 flex justify-center space-x-4 md:space-x-12 text-[10px] md:text-sm font-serif italic border-b-2 border-black pb-2">
                        <span>WORLD NEWS</span>
                        <span>·</span>
                        <span>SPY TECH</span>
                        <span>·</span>
                        <span>CRYPTOGRAPHY</span>
                        <span>·</span>
                        <span>OPERATIONS</span>
                    </div>
                </div>

                {/* Main Content Area - Multi-column Layout */}
                <div className="flex-1 px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-black">

                    {/* Main Headline Section */}
                    <div className="md:col-span-8 flex flex-col border-r-0 md:border-r border-black/30 md:pr-8">
                        <h1 className="text-4xl md:text-6xl font-black font-serif leading-tight mb-4 uppercase tracking-tighter">
                            INVENTO 2026: THE SPYVERSE UNFOLDS
                        </h1>
                        <p className="text-xl md:text-2xl font-serif italic mb-6 leading-relaxed opacity-90">
                            Intelligence agencies are on alert as INVENTO 2026 commences. All systems are live, and the Spyverse has officially been activated.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="font-serif text-sm md:text-base text-justify leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                                The dawn of 2026 brings a new chapter. INVENTO evolves into SPYVERSE a cultural fest that blends creativity, strategy, and performance. From electrifying stages to intense competitions, the campus comes alive with passion and talent. “We haven’t seen excitement of this scale in years,” say organizers. The campus has been
                            </div>
                            <div className="font-serif text-sm md:text-base text-justify leading-relaxed">
                                transformed into a Spyverse, where technology meets creativity. From the Retro Terminal to the Briefcase of Evidence, every installation is designed to spark curiosity and fun. Participants are encouraged to wear their IDs, explore every corner, and immerse themselves in the experience.
                            </div>
                        </div>

                        {/* Separator */}
                        <hr className="my-8 border-black border-double border-b-[3px] border-t-0" />

                        {/* Secondary News */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold font-serif mb-3 uppercase underline decoration-double">CLASSIFIED INTEL LEAKED</h2>
                            <p className="font-serif text-base leading-relaxed mb-4">
                                Internal updates from the organizing committee introduce a new feature: the Notice Board. This centralized hub will deliver real-time announcements, schedules, and important updates throughout INVENTO 2026
                            </p>
                            <div className="bg-black/5  p-4 border-2 border-black/20 shadow-xl">
                                <div className="flex justify-between text-black items-center mb-2 border-b border-white/10 pb-2">
                                    <p className="font-mono text-xs uppercase text-red-500 tracking-tighter">/// TOP SECRET: ENCRYPTED DATA STREAM ///</p>
                                    <span className="text-[10px] opacity-40">[X-99 PROTOCOL]</span>
                                </div>
                                <p className="font-mono text-black text-[11px] break-all opacity-70 leading-relaxed tracking-widest">
                                    U1RBVEVNRU5UOiBPUEVSQVRJT04gU1BZVkVSU0UgSVMgR08uIDxicj4KREVQTE9ZTUVOVCBDT01QTEVURSAyMDI2LjA0LjE1IDxicj4KQ09NTVVOSUNBVElPTlM6IFNFQ1VSRS4gPGicj4KQ09ERU5BTUU6IElOVkVOVE8uIDxicj4KQVVUSE9SSVpBVElPTjogUkVRVUlSRUQgRk9SIEVER0UgQUNDRVNTLiA8YnI+ClRBUkdFVDogQkVMQUdBVkkvS0xFLlRFQ0gu
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <div className="md:col-span-4 flex flex-col space-y-8">
                        <div className="border border-black p-4 bg-black/5">
                            <h3 className="text-lg font-bold font-serif mb-2 uppercase border-b border-black pb-1">Weather Forecast</h3>
                            {weather ? (
                                <p className="font-serif text-sm italic">
                                    {getWeatherDesc(weather.weather_code)} in Belagavi. <br />
                                    Temperature: {Math.round(weather.temperature_2m)}°C. <br />
                                    Outlook: {weather.temperature_2m > 30 ? "Warm & Intense" : "Cool & Mysterious"}.
                                </p>
                            ) : (
                                <p className="font-serif text-sm italic animate-pulse">Intercepting signals from Belagavi...</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold font-serif mb-4 uppercase text-center border-y border-black py-1">Advertisements</h3>
                            <div className="border-2 border-black p-2 mb-4 bg-black/5" style={{ mixBlendMode: 'multiply' }}>
                                <p className="font-black text-center text-2xl uppercase tracking-widest">WANTED</p>
                                <p className="text-center font-serif text-xs mt-1">YOU.</p>
                            </div>
                            <div className="border border-black p-4 text-center">
                                <p className="font-serif text-sm italic">"In the Spyverse, security starts with you. Encrypt your passwords."</p>
                                <p className="font-serif text-[10px] mt-2">- Department of Intelligence</p>
                            </div>
                        </div>

                        <div className="border-t-2 border-black pt-4">
                            <h3 className="text-lg font-bold font-serif mb-4 uppercase text-black border-b border-black pb-1">MARKETPLACE DISPATCHES</h3>
                            <div className="space-y-6">
                                {/* Ad Placement 1 */}
                                <div className="border border-black/20 p-3 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-bold bg-black text-white px-1">SPONSORED</span>
                                    </div>
                                    <p className="font-serif text-sm font-bold uppercase leading-tight">Official Tech Partner</p>
                                    <p className="font-serif text-xs italic mt-1 opacity-70">Empowering the digital frontier of Invento 2026. Stay connected.</p>
                                </div>

                                {/* Ad Placement 2 */}
                                <div className="border border-black/20 p-3 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-bold bg-black text-white px-1">SPONSORED</span>
                                    </div>
                                    <p className="font-serif text-sm font-bold uppercase leading-tight">Vantage View Estates</p>
                                    <p className="font-serif text-xs italic mt-1 opacity-70">Luxury living for the modern operative. Special rates for Invento attendees.</p>
                                </div>

                                {/* Ad Placement 3 */}
                                <div className="border border-black/20 p-3 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-bold bg-black text-white px-1">SPONSORED</span>
                                    </div>
                                    <p className="font-serif text-sm font-bold uppercase leading-tight">Quantum Cyber Cafe</p>
                                    <p className="font-serif text-xs italic mt-1 opacity-70">The best brews and the fastest bandwidth in the Spyverse sector.</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-center items-center mt-10'>
                            <img src={kleLogo} alt="KLE-TECH" />
                        </div>
                    </div>
                </div>

                {/* NOTICE BOARD SECTION */}
                <div className="mt-12 border-t-4 border-black pb-20 pt-10 px-6 md:px-10">
                    <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-2">
                        <h2 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight">THE NOTICE BOARD</h2>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-red-600 text-white animate-pulse">Updates</span>
                            <span className="text-[10px] font-mono mt-1">For you</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode='popLayout'>
                                {notices.length > 0 ? (
                                    notices.map((notice) => (
                                        <motion.div
                                            key={notice._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            layout
                                            className="bg-black/5 border-2 border-black p-5 relative group hover:-translate-y-1 transition-transform"
                                            style={{ mixBlendMode: 'multiply' }}
                                        >
                                            <div className="absolute -top-3 -left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rotate-[-5deg] shadow-md uppercase">
                                                {notice.type}
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-black/20"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-black/20"></div>
                                            </div>
                                            <p className="text-[10px] font-mono uppercase mb-2 opacity-60">
                                                {new Date(notice.date).toLocaleString()} | {notice.category}
                                            </p>
                                            <h3 className="text-xl font-bold font-serif mb-2 leading-tight uppercase group-hover:text-red-700 transition-colors">
                                                {notice.title}
                                            </h3>
                                            <p className="font-serif text-sm leading-relaxed">
                                                {notice.content}
                                            </p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed border-black/20 rounded-lg">
                                        <p className="font-serif italic text-black/50">No updates posted yet. Stay vigilant.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto border-t-2 border-black py-4 px-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-serif opacity-60 uppercase tracking-widest">
                    <span>© 2026 INVENTO TIMES — ALL RIGHTS RESERVED</span>
                    <span>KLE TECHNOLOGICAL UNIVERSITY</span>
                    <span>PROPERTY OF THE INVENTO TIMES</span>
                </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="mt-10 mb-10 text-white/40 flex items-center space-x-4">
                <div className="h-px w-20 bg-white/20"></div>
                <p className="font-serif text-sm uppercase tracking-widest italic animate-pulse">End of Transmission</p>
                <div className="h-px w-20 bg-white/20"></div>
            </div>
        </div>
    );
};

export default Newspaper;
