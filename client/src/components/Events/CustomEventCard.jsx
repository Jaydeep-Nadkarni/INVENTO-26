import React from 'react';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

const CustomEventCard = ({ event, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative w-full bg-[#f4f1ea] border-2 border-[#2a2a2a] p-6 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 min-h-[300px]"
        >
            {/* Background Texture Effect (Optional subtle noise like paper) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`}} 
            />

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-[#2a2a2a] border-r-[40px] border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#2a2a2a]" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full space-y-4">
                
                {/* Header */}
                <div className="border-b-2 border-dashed border-[#2a2a2a] pb-4">
                    <div className="flex justify-between items-start">
                        <h3 className="font-black text-2xl uppercase tracking-tighter leading-none text-[#2a2a2a] group-hover:text-red-700 transition-colors duration-300">
                            {event.themeName || event.realName}
                        </h3>
                        {/* ID Badge */}
                        <span className="text-[10px] font-mono border border-[#2a2a2a] px-1 py-0.5 rounded-sm">
                            #{event.id?.slice(0, 4).toUpperCase()}
                        </span>
                    </div>
                    <p className="font-serif italic text-sm text-gray-600 mt-2">
                        {event.realName}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-bold text-[#2a2a2a] uppercase tracking-wide">
                    {event.date && (
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-red-700" />
                            <span>{event.date}</span>
                        </div>
                    )}
                    {event.venue && (
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-red-700" />
                            <span>{event.venue}</span>
                        </div>
                    )}
                    {event.type && (
                         <div className="flex items-center gap-2">
                            <Users size={14} className="text-red-700" />
                            <span>{event.type}</span>
                        </div>
                    )}
                    {event.fee && (
                        <div className="flex items-center gap-2">
                            <Ticket size={14} className="text-red-700" />
                            <span>{event.fee}</span>
                        </div>
                    )}
                </div>

                {/* Description Truncated */}
                <div className="flex-grow">
                     <p className="font-serif text-gray-800 text-sm leading-relaxed line-clamp-3 mt-2">
                        {event.description}
                    </p>
                </div>

                {/* Action Area */}
                <div className="pt-4 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-gray-400 group-hover:text-[#2a2a2a] transition-colors">
                        INVENTO 2026 // CLASSIFIED
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#f4f1ea] group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300">
                         <span className="font-bold -mt-1">↗</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomEventCard;
