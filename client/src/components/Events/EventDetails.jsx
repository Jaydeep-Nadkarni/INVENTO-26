import React, { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Shield, MapPin, AlertTriangle, Users, Zap, Clock, 
    Target, ChevronLeft, ChevronRight, Phone, User,
    FileText, List, Info, AlertCircle, Terminal,
    Lock, Eye, ArrowLeft, ArrowRight
} from 'lucide-react'
import { TextureOverlay } from './EventUIComponents'
import paperTexture from '../../assets/UI/paper-texture.jpg'

// Custom Hooks for Navigation
const useKeyboardNavigation = (onNext, onPrev) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' && onNext) onNext();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrev]);
};

const useSwipeGesture = (onNext, onPrev) => {
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const touchEndX = useRef(null);
    const minSwipeDistance = 80;

    const onTouchStart = (e) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const onTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current || !touchStartY.current) return;
        
        const horizontalDistance = touchStartX.current - touchEndX.current;
        const verticalDistance = Math.abs(touchStartY.current - (touchEndX.current || touchStartY.current));
        
        // Only trigger swipe if horizontal movement is dominant
        if (Math.abs(horizontalDistance) > minSwipeDistance && Math.abs(horizontalDistance) > verticalDistance * 2) {
            const isLeftSwipe = horizontalDistance > minSwipeDistance;
            const isRightSwipe = horizontalDistance < -minSwipeDistance;
            if (isLeftSwipe && onNext) onNext();
            if (isRightSwipe && onPrev) onPrev();
        }
    };

    return { onTouchStart, onTouchMove, onTouchEnd };
};

const EventDetails = ({
    currentEvent,
    currentClub,
    handleBackToEvents,
    goToPrevEvent,
    goToNextEvent,
    handleRegisterClick,
    regLoading,
    showRegModal,
    setShowRegModal,
    isOfficial,
    setIsOfficial,
    contingentKey,
    setContingentKey,
    teamInfo,
    setTeamInfo,
    memberDetails,
    newMemberId,
    setNewMemberId,
    fetchingMember,
    handleFetchMember,
    removeMember,
    initiatePayment,
    confirmation,
    navigate
}) => {
    if (!currentEvent) return null;

    // Navigation and Swipe Hooks
    useKeyboardNavigation(goToNextEvent, goToPrevEvent);
    const swipeHandlers = useSwipeGesture(goToNextEvent, goToPrevEvent);

    const userStr = localStorage.getItem('currentUser');
    const user = userStr ? JSON.parse(userStr) : null;
    const isMasterMiss = /master|miss|mr\.|ms\./i.test(currentEvent.themeName || currentEvent.name);

    const renderSlots = () => {
        if (isMasterMiss) {
            // Support multiple key formats for compatibility (availableBoysSlots, male, etc)
            const slots = currentEvent.specificSlots || {};
            const boys = slots.availableBoysSlots ?? slots.male ?? 0;
            const girls = slots.availableGirlsSlots ?? slots.female ?? 0;
            
            if (!user) return `${boys + girls}`;
            if (user.gender === "Male") return `${boys} (Master)`;
            if (user.gender === "Female") return `${girls} (Miss)`;
            return boys + girls;
        }
        return currentEvent.slotsAvailable === 'TBD' ? 'OPEN' : (currentEvent.slotsAvailable || '∞');
    };

    const eventTierColor = {
        'Silver': 'text-stone-400',
        'Gold': 'text-yellow-500',
        'Platinum': 'text-slate-300',
    }

    const tierClass = eventTierColor[currentEvent.tier] || 'text-white';

    return (
        <div 
            className="fixed inset-0 z-100 bg-stone-950 flex flex-col md:flex-row overflow-hidden selection:bg-red-600 selection:text-white"
        >
            <TextureOverlay opacity={0.3} className="pointer-events-none fixed inset-0" />

            {/* --- LEFT PANEL: EVENT OVERVIEW (Desktop: 40%) --- */}
            <div className="md:w-[40%] w-full bg-stone-900 text-stone-100 p-6 md:p-10 flex flex-col justify-between md:h-full border-r border-stone-800 z-10 shrink-0 md:overflow-y-auto">
                <div className="flex flex-col h-full">
                    {/* Header Nav */}
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <button 
                            onClick={handleBackToEvents}
                            className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-stone-500 hover:text-red-500 transition-colors group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                            BACK TO EVENTS
                        </button>
                        <div className="flex gap-2">
                             <button onClick={goToPrevEvent} className="p-2 border border-stone-700 hover:bg-stone-800 text-stone-400 transition-all"><ChevronLeft size={16}/></button>
                             <button onClick={goToNextEvent} className="p-2 border border-stone-700 hover:bg-stone-800 text-stone-400 transition-all"><ChevronRight size={16}/></button>
                        </div>
                    </div>

                    {/* Event Identity */}
                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                        <p>
                            <span className={`font-serif font-black text-lg uppercase ${tierClass}`}>
                                {currentEvent.tier}
                            </span>
                        </p>
                        <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight tracking-tight text-white uppercase wrap-break-word">
                            {currentEvent.themeName}
                        </h1>
                        <p className="font-mono text-[11px] text-stone-500 uppercase tracking-widest flex items-center gap-2 italic">
                            {currentEvent.realName || currentEvent.name}
                        </p>
                    </div>

                    {/* Event Stats Box */}
                    <div className="grid grid-cols-2 gap-px bg-stone-800/50 border border-stone-800 mb-6 md:mb-8">
                        <div className="p-4 md:p-5 bg-stone-900">
                             <p className="font-mono text-[9px] text-stone-500 uppercase mb-1">Registration Fee</p>
                             <p className="text-xl md:text-2xl font-mono font-bold text-white">{currentEvent.fee || 'TBD'}</p>
                        </div>
                        <div className="p-4 md:p-5 bg-stone-900 border-l border-stone-800">
                             <p className="font-mono text-[9px] text-stone-500 uppercase mb-1 flex items-center gap-2">
                                 Slots Available
                             </p>
                             <p className="text-xl md:text-2xl font-mono font-bold text-white leading-none tracking-tighter">
                                 {renderSlots()} <span className="text-[12px] text-stone-500 font-normal">SLOTS</span>
                             </p>
                        </div>
                    </div>

                    {/* Event Coordinators - Hidden on mobile, shown on right panel for mobile */}
                    <div className="hidden md:block space-y-4 mb-8">
                         <h4 className="font-mono text-[10px] text-stone-500 uppercase tracking-widest border-b border-stone-800 pb-2">Event Coordinators</h4>
                         <div className="space-y-3">
                             {currentEvent.contacts?.map((contact, idx) => (
                                 <div key={idx} className="flex justify-between items-center group">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded bg-stone-800 flex items-center justify-center text-stone-500 group-hover:text-red-500 transition-colors">
                                             <User size={14} />
                                         </div>
                                         <span className="font-serif italic text-white text-sm">{contact.name}</span>
                                     </div>
                                     <a href={`tel:${contact.phone}`} className="font-mono text-[10px] text-stone-400 hover:text-white transition-colors flex items-center gap-2">
                                         {contact.phone} <Phone size={10} />
                                     </a>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: DETAILS (Desktop: 60%) --- */}
            <div 
                className="md:w-[60%] w-full bg-stone-100 flex-1 relative scroll-smooth selection:bg-stone-900 selection:text-white overflow-y-auto"
                {...swipeHandlers}
            >
                <style>{`
                    .grain-overlay {
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                        opacity: 0.05;
                    }
                    ::-webkit-scrollbar {
                        width: 4px;
                        height: 4px;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #444;
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #666;
                    }
                `}</style>
                <div className="absolute inset-0 grain-overlay pointer-events-none z-0" />
                

                <div className="p-8 md:p-12 md:pb-24 max-w-4xl mx-auto space-y-16 md:space-y-24 relative z-10">
                    
                    {/* Section 1: Event Description */}
                    <section id="overview" className="scroll-mt-24">
                        <div className="relative">
                            <blockquote className="text-lg md:text-xl font-serif italic text-stone-800 leading-relaxed relative z-10">
                                {currentEvent.description || "The nature of this event remains confidential until the day of."}
                            </blockquote>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="h-0.5 w-10 bg-red-600" />
                                <span className="font-mono text-[9px] text-stone-400 uppercase tracking-[0.3em]">Brief Overview</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Key Information Grid */}
                    <section id="stats" className="py-8 border-t border-stone-200">
                        <div className="flex flex-wrap md:flex-nowrap justify-between gap-y-8">
                            {[
                                { label: 'Team Size', value: currentEvent.teamSize || '1 Member' },
                                { label: 'Rounds', value: currentEvent.rounds || 'TBD' },
                                { label: 'Date', value: currentEvent.date || 'TBD' },
                                { label: 'Venue', value: currentEvent.venue || 'TBD' },
                            ].map((stat, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-1 min-w-[50%] md:min-w-0 ${
                                        i !== 0 ? 'md:border-l md:border-stone-200 md:pl-10' : ''
                                    }`}
                                >
                                    <p className="font-mono text-[12px] text-stone-400 uppercase tracking-widest mb-3">
                                        {stat.label}
                                    </p>
                                    <p className="font-bold text-xl md:text-2xl text-stone-900 leading-none"> 
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Event Timeline */}
                    <section id="logistics" className="scroll-mt-24">
                        <h3 className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-8 border-b border-stone-200 pb-3 flex justify-between items-center">
                            <span>Timeline & Rounds</span>
                            <Terminal size={12} />
                        </h3>
                        
                        <div className="relative pl-6 border-l border-stone-300 space-y-10 py-2">
                            {currentEvent.roundDetails?.length > 0 ? (
                                currentEvent.roundDetails.map((round, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-8 top-0 w-3.5 h-3.5 rounded-full bg-stone-100 border-2 border-stone-300 group-hover:border-red-600 transition-colors z-10" />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-serif font-bold text-lg uppercase text-stone-900" style={{fontFamily: '"DM Serif Text", serif',fontVariantNumeric: 'tabular-nums'}}>
                                                    {round.title}</h4>
                                            </div>
                                            <ul className="space-y-1.5">
                                                {round.details?.map((detail, dIdx) => (
                                                    <li key={dIdx} className="flex gap-2.5 text-xs md:text-sm text-stone-600 leading-relaxed font-serif">
                                                        <span className="mt-2 w-1.5 h-px bg-stone-400 shrink-0" />
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-stone-400 font-serif italic py-2 text-sm"></div>
                            )}
                        </div>
                    </section>

                    {/* Section 4: Rules & Regulations */}
                    <section id="protocol" className="scroll-mt-24">
                        <div className="p-6 md:p-10 text-stone-900 relative overflow-hidden">
                            <h3 className="font-serif text-[18px] font-bold uppercase tracking-[0em] mb-8 flex items-center gap-2">
                                GENERAL RULES & GUIDELINES
                            </h3>

                            <div className="grid gap-5">
                                {currentEvent.rules?.map((rule, idx) => (
                                    <div key={idx} className="flex gap-4 items-start group">
                                        <span className="font-mono text-stone-600 text-[9px] pt-1 tracking-tighter">
                                            [{(idx + 1).toString().padStart(2, '0')}]
                                        </span>
                                        <p className="flex gap-2.5 text-xs md:text-sm text-stone-600 leading-relaxed font-serif">
                                            {rule}
                                        </p>
                                    </div>
                                ))}
                                {(!currentEvent.rules || currentEvent.rules.length === 0) && (
                                    <p className="text-stone-500 italic font-mono text-[10px] uppercase">Standard Inter-college event protocols apply.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Mobile Contact Details */}
                    <section className="md:hidden space-y-6 pt-12 border-t border-stone-200">
                        <h4 className="font-mono text-[12px] text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2">Event Coordinators</h4>
                         <div className="grid gap-4">
                             {currentEvent.contacts?.map((contact, idx) => (
                                 <div key={idx} className="flex justify-between items-center bg-white p-4 border border-stone-200 shadow-sm">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded bg-stone-100 flex items-center justify-center text-stone-500">
                                             <User size={16} />
                                         </div>
                                         <span className="font-serif italic text-stone-900 font-bold">{contact.name}</span>
                                     </div>
                                     <a href={`tel:${contact.phone}`} className="font-mono text-sm text-red-600 flex items-center justify-center">
                                         {contact.phone}
                                     </a>
                                 </div>
                             ))}
                         </div>
                    </section>

                    {/* Registration CTA for Right Panel */}
                    <section className="pt-12 pb-8">
                        <button
                            onClick={handleRegisterClick}
                            disabled={regLoading}
                            className="w-full py-5 bg-black text-white font-serif font-black text-lg uppercase tracking-wider hover:bg-red-600 transition-all transform active:scale-[0.98] shadow-xl group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {regLoading ? 'PROCESSING...' : 'REGISTER FOR EVENT'}
                                {!regLoading && <Zap size={18} className="fill-current" />}
                            </span>
                            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                        </button>
                    </section>
                </div>
            </div>

            {/* --- CLOSE BUTTON --- */}
            <button
                onClick={handleBackToEvents}
                className="fixed top-6 right-6 md:top-8 md:right-8 w-12 h-12 bg-stone-900 border border-stone-800 text-white flex items-center justify-center hover:bg-red-600 transition-all z-110 group"
                title="ESC to exit"
            >
                <span className="text-xl font-mono group-hover:rotate-90 transition-transform">✕</span>
            </button>

            {/* --- REGISTRATION MODAL (PRESERVED FUNCTIONALITY) --- */}
            <AnimatePresence>
                {showRegModal && (
                    <div className="fixed inset-0 z-200 flex items-center justify-center bg-stone-950/90 backdrop-blur-xl p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-2xl bg-stone-50 border-[6px] border-stone-900 shadow-[20px_20px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col max-h-[92vh]"
                            style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
                        >
                            <TextureOverlay opacity={0.3} className="pointer-events-none" />
                            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
                                <h2 className="text-2xl md:text-3xl font-serif font-black uppercase text-stone-900 mb-8 border-b-4 border-stone-900 pb-4 flex justify-between items-end">
                                    <span>{currentEvent.type?.toLowerCase() === 'solo' ? 'Registration' : 'Team Registration'}</span>
                                    <span className="text-[10px] font-mono text-red-600 animate-pulse">Confirmation Required</span>
                                </h2>

                                <div className="space-y-8">
                                    {currentEvent.type?.toLowerCase() !== 'solo' && (currentEvent.teamSize?.toString().includes('-') || parseInt(currentEvent.teamSize) > 1) ? (
                                        (() => {
                                            const sizeParts = currentEvent.teamSize?.toString().split('-') || ["1"]
                                            const minSize = parseInt(sizeParts[0])
                                            const maxSize = parseInt(sizeParts.pop())
                                            const currentCount = memberDetails.length + 1
                                            const isMinMet = currentCount >= minSize
                                            const isTeamFull = currentCount >= maxSize

                                            return (
                                                <div className="space-y-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500">Team Name</label>
                                                        <input
                                                            type="text"
                                                            value={teamInfo.teamName}
                                                            onChange={(e) => setTeamInfo({ ...teamInfo, teamName: e.target.value.toUpperCase() })}
                                                            placeholder="ENTER TEAM NAME"
                                                            className="w-full bg-white border-2 border-stone-900 px-5 py-4 font-mono text-sm text-stone-900 focus:bg-stone-50 outline-none transition-all placeholder:text-stone-300"
                                                        />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500">Add Team Members (ID: inv0001)</label>
                                                        <div className="flex gap-3">
                                                            <input
                                                                type="text"
                                                                value={newMemberId}
                                                                onChange={(e) => setNewMemberId(e.target.value)}
                                                                placeholder="ENTER INVENTO ID"
                                                                className="flex-1 bg-white border-2 border-stone-900 px-5 py-4 font-mono text-sm text-stone-900 focus:bg-stone-50 outline-none disabled:opacity-50 cursor-not-allowed"
                                                                disabled={isTeamFull}
                                                            />
                                                            <button
                                                                onClick={handleFetchMember} disabled={fetchingMember || isTeamFull}
                                                                className="px-8 bg-stone-900 text-white font-serif font-black text-sm uppercase hover:bg-red-600 transition-all disabled:bg-stone-300"
                                                            >
                                                                {fetchingMember ? '...' : 'ADD'}
                                                            </button>
                                                        </div>

                                                        {/* Member Counter */}
                                                        <div className="flex justify-between items-center  p-3">
                                                            <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Team Composition</p>
                                                            <p className={`text-xs font-mono font-black ${isMinMet ? 'text-green-600' : 'text-red-600'}`}>
                                                                {currentCount} / {maxSize} ADDED {isMinMet ? '✓' : ''}
                                                            </p>
                                                        </div>

                                                        {/* Team Members List */}
                                                        <div className="space-y-2 max-h-[25vh] overflow-y-auto pr-2">
                                                            <div className="flex items-center gap-3 bg-white p-4 border-2 border-stone-900 group">
                                                                <img 
                                                                    src={user?.profilePhoto?.startsWith('data:') || user?.profilePhoto?.startsWith('http') 
                                                                        ? user.profilePhoto 
                                                                        : user?.profilePhoto 
                                                                            ? `${import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')}${user.profilePhoto}` 
                                                                            : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name
                                                                    } 
                                                                    alt="Leader Avatar" 
                                                                    className="w-10 h-10 bg-stone-200 flex items-center justify-center text-stone-500 shrink-0 object-cover rounded-full" 
                                                                />
                                                                <div className="flex-1 overflow-hidden">
                                                                    <p className="font-serif font-black text-xs uppercase text-stone-900 truncate">{JSON.parse(localStorage.getItem('currentUser'))?.name} (Leader)</p>
                                                                    <p className="text-[9px] font-mono text-stone-400 uppercase truncate">{JSON.parse(localStorage.getItem('currentUser'))?.email}</p>
                                                                </div>
                                                                <span className="text-[9px] font-mono bg-stone-900 text-white px-2 py-0.5 uppercase tracking-tighter self-center">LDR</span>
                                                            </div>

                                                            {memberDetails.map((member) => (
                                                                <motion.div
                                                                    key={member._id}
                                                                    initial={{ x: -10, opacity: 0 }}
                                                                    animate={{ x: 0, opacity: 1 }}
                                                                    className="flex items-center gap-3 bg-white p-4 border-2 border-stone-900 group"
                                                                >
                                                                    <img 
                                                                        src={member?.profilePhoto?.startsWith('data:') || member?.profilePhoto?.startsWith('http') 
                                                                            ? member.profilePhoto 
                                                                            : member?.profilePhoto 
                                                                                ? `${import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')}${member.profilePhoto}` 
                                                                                : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + member.name
                                                                        } 
                                                                        alt={`${member.name} Avatar`} 
                                                                        className="w-10 h-10 bg-stone-200 flex items-center justify-center text-stone-500 shrink-0 object-cover rounded-full" 
                                                                    />
                                                                    <div className="flex-1 overflow-hidden">
                                                                        <p className="font-serif font-bold text-xs uppercase text-stone-900 truncate">{member.name}</p>
                                                                        <p className="text-[9px] font-mono text-stone-400 uppercase truncate">{member.email}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeMember(member._id)}
                                                                        className="text-stone-300 hover:text-red-600 transition-colors p-1"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })()
                                    ) : (
                                        <div className=" text-stone-600 p-2">
                                            <p className="font-serif italic text-sm md:text-md leading-relaxed">
                                                "By registering for this event, you confirm individual participation for <span className="text-stone-900 font-bold uppercase">{currentEvent.themeName}</span>. Your registration details will be confirmed upon payment. Attendance is mandatory after registration."
                                            </p>
                                        </div>
                                    )}

                                    {/* Official Registration - Brutalist Toggle */}
                                    <div className="pt-6 border-t-2 border-stone-200 mt-8">
                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <div className={`w-4 h-4 border-2 border-stone-900 flex items-center justify-center transition-all ${isOfficial ? 'bg-stone-900' : 'bg-white'}`}>
                                                {isOfficial && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isOfficial}
                                                onChange={(e) => setIsOfficial(e.target.checked)}
                                            />
                                            <span className="text-xs font-mono font-black uppercase text-stone-900 group-hover:text-red-500">Register under College Contingent?</span>
                                        </label>

                                        {isOfficial && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="mt-6 space-y-2 overflow-hidden"
                                            >
                                                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-stone-600">Contingent Code</label>
                                                <input
                                                    type="text"
                                                    value={contingentKey}
                                                    onChange={(e) => setContingentKey(e.target.value.toUpperCase())}
                                                    placeholder="ENTER CODE"
                                                    className="w-full bg-white border-2 border-stone-900 px-4 py-3 font-mono text-sm text-stone-900 outline-none"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-20 p-6 md:p-10 pt-0">
                                <div className="flex gap-4 pt-4 border-t-4 border-stone-900">
                                    <button
                                        type="button"
                                        onClick={() => setShowRegModal(false)}
                                        className="flex-1 bg-stone-200 py-4 border-4 border-stone-900 text-stone-900 font-serif font-black uppercase tracking-tighter hover:bg-stone-200 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={regLoading}
                                        onClick={initiatePayment}
                                        className="flex-1 py-4 bg-stone-900 text-white font-serif font-black uppercase tracking-tighter hover:bg-red-600 transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 text-sm"
                                    >
                                        {regLoading ? 'PROCESSING...' : 'REGISTER'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- CONFIRMATION MODAL (PRESERVED) --- */}
            <AnimatePresence>
                {confirmation.show && (
                    <div className="fixed inset-0 z-250 flex items-center justify-center bg-stone-950 p-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-stone-900 w-full max-w-lg p-8 md:p-12 border-8 border-green-600 text-center space-y-6 md:space-y-8 shadow-[0_40px_100px_rgba(22,163,74,0.3)]"
                        >
                             <div className="w-20 h-20 md:w-24 md:h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-green-600/40">
                                 <Zap size={40} className="fill-current" />
                             </div>
                             <div>
                                 <h2 className="text-3xl md:text-5xl font-serif font-black text-white uppercase tracking-tighter mb-2">REGISTRATION SUCCESSFUL</h2>
                                 <p className="font-mono text-[9px] text-green-500 uppercase tracking-[0.4em]">Event registration details confirmed</p>
                             </div>

                             <div className="p-4 md:p-6 bg-stone-950 border-l-4 border-green-600 text-left">
                                 <p className="text-stone-300 font-mono text-[10px] md:text-xs leading-relaxed uppercase">Log: {confirmation.message}</p>
                             </div>

                             <div className="space-y-4">
                                 {confirmation.whatsappLink && (
                                     <a
                                         href={confirmation.whatsappLink}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="w-full py-4 bg-white text-stone-900 font-serif font-black uppercase tracking-tighter hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-4 text-lg md:text-xl"
                                     >
                                         <Eye size={20} /> JOIN WHATSAPP GROUP
                                     </a>
                                 )}
                                 <button
                                     onClick={() => navigate('/profile')}
                                     className="text-[10px] font-mono font-bold uppercase text-stone-500 hover:text-white transition-all tracking-[0.3em]"
                                 >
                                     View My Registrations (Profile)
                                 </button>
                             </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EventDetails