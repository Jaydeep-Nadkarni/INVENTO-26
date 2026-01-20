import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextureOverlay } from './EventUIComponents'
import paperTexture from '../../assets/UI/paper-texture.jpg'

const EventDetails = ({
    currentEvent,
    clubSlug,
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

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 pt-24 md:pt-32">

            {/* Event Navigation Arrows */}
            <button onClick={goToPrevEvent} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-110 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 text-white transition-all backdrop-blur-sm group border border-white/20">
                <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            </button>
            <button onClick={goToNextEvent} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-110 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 text-white transition-all backdrop-blur-sm group border border-white/20">
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-7xl h-[85vh] md:aspect-video flex flex-col md:flex-row bg-[#fdfbf7] rounded-sm shadow-2xl overflow-hidden"
                style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
            >
                <TextureOverlay opacity={0.3} />

                {/* Left Panel: Visual / Title */}
                <div className="relative z-30 w-full md:w-[35%] bg-[#1a1a1a] text-white p-8 md:p-10 flex flex-col justify-between overflow-hidden shrink-0">
                    {/* Decorative Circle */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                    <div className="relative z-10 flex flex-col h-full">
                        <button
                            onClick={handleBackToEvents}
                            className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest hover:text-white transition-colors mb-8"
                        >
                            ← Back to dossier
                        </button>

                        <div className="mt-auto mb-auto">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none font-serif mb-2 text-yellow-500">
                                {currentEvent.themeName}
                            </h2>
                            <h3 className="text-xl md:text-2xl font-serif italic text-gray-400 mb-6">
                                ( {currentEvent.realName ||' '} )
                            </h3>

                            <div className="space-y-4 font-mono text-sm text-gray-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-red-600"></div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Registration Fee</p>
                                        <p className="text-xl font-bold text-white">{currentEvent.fee || 'Free'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Big decorative letter */}
                        <div className="absolute -bottom-10 -left-4 opacity-10 select-none pointer-events-none">
                            <h4 className="text-[12rem] font-black tracking-tighter leading-none">
                                {(currentEvent.themeName || currentEvent.name).charAt(0)}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Data - Scrollable */}
                <div className="relative z-30 flex-1 flex flex-col h-full overflow-hidden bg-[#fdfbf7]">
                    {/* Slots Badge */}
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold font-mono text-xs px-6 py-2 z-40 shadow-md">
                        {(() => {
                            const userStr = localStorage.getItem('currentUser');
                            const user = userStr ? JSON.parse(userStr) : null;
                            const isMasterMiss = /master|miss|mr\.|ms\./i.test(currentEvent.themeName || currentEvent.name);

                            if (isMasterMiss) {
                                if (!user) return "SLOTS AVAILABLE : Master + Miss Available";
                                const boys = currentEvent.specificSlots?.availableBoysSlots ?? 0;
                                const girls = currentEvent.specificSlots?.availableGirlsSlots ?? 0;
                                if (user.gender === "Male") return `SLOTS AVAILABLE : ${boys} (Master)`;
                                if (user.gender === "Female") return `SLOTS AVAILABLE : ${girls} (Miss)`;
                                return "SLOTS AVAILABLE : Master + Miss Available";
                            }
                            return `SLOTS AVAILABLE : ${currentEvent.slotsAvailable || 'Unlimited'}`;
                        })()}
                    </div>


                    <div className="flex-1 overflow-y-auto p-8 md:p-12 hide-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-10">

                            {/* Description */}
                            <section>
                                <p className="text-lg md:text-xl font-serif text-gray-800 leading-relaxed italic border-l-4 border-yellow-500 pl-6 py-2 bg-yellow-500/5 rounded-r-lg">
                                    {currentEvent.description ? `"${currentEvent.description}"` : '"No description available for this classified operation."'}
                                </p>
                            </section>

                            {/* Quick Stats Grid */}
                            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-black/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Team Size</p>
                                    <p className="font-bold text-gray-900 text-lg">{currentEvent.teamSize || 1}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Rounds</p>
                                    <p className="font-bold text-gray-900 text-lg">{currentEvent.rounds || 1}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Date</p>
                                    <p className="font-bold text-gray-900 text-lg">{currentEvent.date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Venue</p>
                                    <p className="font-bold text-gray-900 text-lg">{currentEvent.venue}</p>
                                </div>
                            </section>

                            {/* Rules */}
                            {currentEvent.rules && (
                                <section>
                                    <h3 className="font-bold text-xl uppercase tracking-tight mb-4 flex items-center gap-3">
                                        <span className="w-2 h-2 bg-black rounded-full"></span> Rules & Regulations
                                    </h3>
                                    <ul className="space-y-3 ml-2">
                                        {currentEvent.rules.map((rule, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-gray-700 font-medium">
                                                <span className="mt-1.5 w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Round Details */}
                            {currentEvent.roundDetails && (
                                <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="font-bold text-xl uppercase tracking-tight mb-6">Round Details</h3>
                                    <div className="grid gap-8">
                                        {currentEvent.roundDetails.map((round, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <h4 className="font-bold text-red-700 text-lg border-b border-gray-100 pb-2">{round.title}</h4>
                                                <ul className="space-y-1">
                                                    {round.details.map((detail, dIdx) => (
                                                        <li key={dIdx} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-300">
                                                            {detail}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Contact & Register Action */}
                            <section className="pt-8 flex flex-col md:flex-row items-end justify-between gap-8 border-t border-black/10">
                                <div className="w-full md:w-auto">
                                    <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-gray-500">Event Heads</h4>
                                    <div className="space-y-2">
                                        {currentEvent.contacts && currentEvent.contacts.map((contact, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white px-4 py-2 rounded border border-gray-200 shadow-sm">
                                                <span className="font-bold text-gray-900 text-sm">{contact.name}</span>
                                                <div className="h-4 w-px bg-gray-300"></div>
                                                <span className="font-mono text-red-600 text-sm">{contact.phone}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleRegisterClick}
                                    disabled={regLoading}
                                    className="w-full md:w-auto px-10 py-5 bg-gray-900 border-2 border-gray-900 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-black hover:border-black transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3 group"
                                >
                                    <span className="relative">
                                        {regLoading ? 'PROCESSING...' : 'Register Now'}
                                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></div>
                                    </span>
                                    {!regLoading && (
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Registration Modal */}
                <AnimatePresence>
                    {showRegModal && (
                        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-lg md:max-w-2xl bg-[#fdfbf7] md:p-10 p-6 border-4 border-gray-900 shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] rounded-sm"
                                style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
                            >
                                <TextureOverlay opacity={0.3} />
                                <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                                    <h2 className="text-2xl font-black uppercase text-gray-900 mb-6 border-b-2 border-red-700 pb-2 flex justify-between items-center">
                                        <span>{currentEvent.type?.toLowerCase() === 'solo' ? 'Individual Clearance' : 'Team Assembly'}</span>
                                        <span className="text-[10px] font-mono text-gray-400">Classified</span>
                                    </h2>

                                    <div className="space-y-6">
                                        {currentEvent.type?.toLowerCase() !== 'solo' && (currentEvent.teamSize?.toString().includes('-') || parseInt(currentEvent.teamSize) > 1) ? (
                                            (() => {
                                                const sizeParts = currentEvent.teamSize?.toString().split('-') || ["1"]
                                                const minSize = parseInt(sizeParts[0])
                                                const maxSize = parseInt(sizeParts.pop())
                                                const currentCount = memberDetails.length + 1
                                                const isMinMet = currentCount >= minSize
                                                const isTeamFull = currentCount >= maxSize

                                                return (
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">Team Name</label>
                                                            <input
                                                                type="text"
                                                                value={teamInfo.teamName}
                                                                onChange={(e) => setTeamInfo({ ...teamInfo, teamName: e.target.value.toUpperCase() })}
                                                                placeholder="ENTER TEAM NAME"
                                                                className="w-full bg-white/50 border-2 border-gray-300 px-4 py-3 font-mono text-gray-900 focus:border-red-700 outline-none transition-all"
                                                            />
                                                        </div>

                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">Add Team Members (Invento ID)</label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={newMemberId}
                                                                    onChange={(e) => setNewMemberId(e.target.value)}
                                                                    placeholder="ID: inv0001"
                                                                    className="flex-1 bg-white/50 border-2 border-gray-300 px-4 py-2 font-mono text-gray-900 focus:border-red-700 outline-none disabled:opacity-50"
                                                                    disabled={isTeamFull}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleFetchMember()}
                                                                />
                                                                <button
                                                                    onClick={handleFetchMember} disabled={fetchingMember || isTeamFull}
                                                                    className="px-4 py-2 bg-gray-900 text-white font-bold text-xs uppercase hover:bg-black transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                                >
                                                                    {fetchingMember ? '...' : isTeamFull ? 'FULL' : 'ADD'}
                                                                </button>
                                                            </div>

                                                            {/* Team Instructions */}
                                                            <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 space-y-2">
                                                                <p className="text-[10px] font-mono font-bold text-yellow-800 uppercase tracking-widest">Event Registration Steps:</p>
                                                                <ul className="text-[10px] font-mono text-yellow-900 space-y-1">
                                                                    <li>1. Tell members to register on this site first.</li>
                                                                    <li>2. Enter their Invento ID above to verify clearance.</li>
                                                                    <li>3. Once all members are added, proceed to payment.</li>
                                                                </ul>
                                                            </div>

                                                            {/* Member List */}
                                                            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Team Members</p>
                                                                    <p className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isMinMet ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                                                        {currentCount} / {maxSize}
                                                                    </p>
                                                                </div>
                                                                {/* Leader (Current User) */}
                                                                <div className="flex items-center gap-3 bg-white p-3 border border-gray-200 shadow-sm relative overflow-hidden group">
                                                                    <div className="w-10 h-10 bg-gray-200 shrink-0 overflow-hidden border border-gray-300">
                                                                        <img src={JSON.parse(localStorage.getItem('currentUser'))?.profilePhoto || `https://api.dicebear.com/7.x/pixel-art/svg?seed=leader`} className="w-full h-full object-cover" alt="leader" />
                                                                    </div>
                                                                    <div className="flex-1 overflow-hidden">
                                                                        <p className="font-bold text-xs uppercase text-gray-900 truncate">You (Squad Leader)</p>
                                                                        <p className="text-[10px] font-mono text-gray-500 truncate">{JSON.parse(localStorage.getItem('currentUser'))?.email}</p>
                                                                    </div>
                                                                    <span className="text-[10px] bg-red-700 text-white px-2 py-0.5 font-bold uppercase">LEADER</span>
                                                                </div>

                                                                {memberDetails.map((member) => (
                                                                    <motion.div
                                                                        key={member._id}
                                                                        initial={{ x: -20, opacity: 0 }}
                                                                        animate={{ x: 0, opacity: 1 }}
                                                                        className="flex items-center gap-3 bg-white p-3 border border-gray-200 shadow-sm relative overflow-hidden group"
                                                                    >
                                                                        <div className="w-10 h-10 bg-gray-200 shrink-0 overflow-hidden border border-gray-200">
                                                                            <img src={member.profilePhoto || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${member._id}`} className="w-full h-full object-cover" alt="member" />
                                                                        </div>
                                                                        <div className="flex-1 overflow-hidden">
                                                                            <p className="font-bold text-xs uppercase text-gray-900 truncate">{member.name}</p>
                                                                            <p className="text-[10px] font-mono text-gray-500 truncate">{member.email}</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => removeMember(member._id)}
                                                                            className="text-gray-400 hover:text-red-700 transition-colors px-2"
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
                                            <div className="bg-red-700/5 p-4 border border-red-700/10 rounded">
                                                <p className="text-gray-600 font-serif italic text-sm">
                                                    "By registering, you confirm your individual participation in this event.Once your payment is confirmed, you will receive a confirmation message"
                                                </p>
                                            </div>
                                        )}

                                        {/* Official Registration Checkbox (Minimalist) */}
                                        <div className="pt-2 border-t border-black/5 mt-4">
                                            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                                <input
                                                    type="checkbox"
                                                    id="officialReg"
                                                    checked={isOfficial}
                                                    onChange={(e) => setIsOfficial(e.target.checked)}
                                                    className="w-3.5 h-3.5 accent-red-700 cursor-pointer"
                                                />
                                                <label htmlFor="officialReg" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 cursor-pointer select-none">
                                                    Official Registration?
                                                </label>
                                            </div>

                                            {isOfficial && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="mt-3 space-y-1"
                                                >
                                                    <label className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-gray-400">Invento Contingent Key</label>
                                                    <input
                                                        type="text"
                                                        value={contingentKey}
                                                        onChange={(e) => setContingentKey(e.target.value.toUpperCase())}
                                                        placeholder="ENTER KEY"
                                                        className="w-full bg-black/5 border border-black/10 px-3 py-2 font-mono text-xs text-gray-900 focus:border-red-700 outline-none transition-all"
                                                    />
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowRegModal(false)}
                                                className="flex-1 py-3 border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest hover:bg-gray-100 transition-all font-mono text-xs"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                disabled={regLoading}
                                                onClick={initiatePayment}
                                                className="flex-1 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 font-mono text-xs"
                                            >
                                                {regLoading ? 'PROCESSING...' : 'PROCEED'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Confirmation Modal */}
                <AnimatePresence>
                    {confirmation.show && (
                        <div className="fixed inset-0 z-250 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full max-w-md bg-[#fdfbf7] p-8 border-4 border-gray-900 shadow-2xl text-center relative overflow-hidden"
                                style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
                            >
                                <TextureOverlay opacity={0.3} />
                                <div className="relative z-10 space-y-6">
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-white">
                                        <span className="text-4xl text-white">✓</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black uppercase text-gray-900 mb-2 leading-none">Access Granted</h2>
                                        <p className="font-mono text-[10px] text-red-700 uppercase tracking-widest">Operation Successfully Registered</p>
                                    </div>

                                    <div className="p-4 bg-black/5 border border-black/10 text-sm font-serif italic text-gray-700 leading-relaxed">
                                        {confirmation.message}
                                    </div>

                                    {confirmation.whatsappLink && (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-mono font-bold text-gray-500 uppercase">Join The Command Center (WhatsApp)</p>
                                            <a
                                                href={confirmation.whatsappLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-4 bg-[#25D366] text-white font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl rounded flex items-center justify-center gap-3"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                                JOIN GROUP
                                            </a>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="text-[10px] font-mono font-bold uppercase text-gray-400 hover:text-red-700 transition-colors"
                                    >
                                        View Assignments (Profile)
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Close button */}
                <button
                    onClick={handleBackToEvents}
                    className="absolute top-4 right-4 md:top-6 md:right-8 w-8 h-8 md:w-10 md:h-10 bg-black/10 hover:bg-black text-black hover:text-white flex items-center justify-center transition-all z-50 rounded-full"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>
            </motion.div>
        </div>
    )
}

export default EventDetails
