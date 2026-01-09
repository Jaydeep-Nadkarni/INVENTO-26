import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';

const Sidebar = ({ panelType = 'admin' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, adminUser } = useAdminAuth();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Participants', path: '/admin/participants', icon: '👥' },
        { name: 'Stats', path: '/admin/stats', icon: '📈' },
    ];

    const masterLinks = [
        { name: 'Dashboard', path: '/master/dashboard', icon: '🛡️' },
        { name: 'Admins', path: '/master/admins', icon: '🔑' },
        { name: 'Events', path: '/master/events', icon: '📅' },
        { name: 'Participants', path: '/master/participants', icon: '👥' },
        { name: 'Stats', path: '/master/stats', icon: '📈' },
        { name: 'Activity', path: '/master/activity', icon: '📝' },
    ];

    const links = panelType === 'master' ? masterLinks : adminLinks;

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-700 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            >
                <span className="text-white text-xl">
                    {isOpen ? '✕' : '☰'}
                </span>
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside className={`w-64 h-screen bg-[#0d0d0d] border-r border-white/10 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Header / Logo */}
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-red-700 font-serif font-black text-2xl tracking-tighter uppercase">
                        INVENTO <span className="text-sm align-top text-red-600/70">'26</span>
                    </h1>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-1">
                        {panelType === 'master' ? '[ MASTER CONTROL ]' : '[ ADMIN PANEL ]'}
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                                    isActive 
                                    ? 'bg-red-700/10 text-red-600 border border-red-700/20 shadow-[0_0_15px_rgba(185,28,28,0.1)]' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                                    {link.icon}
                                </span>
                                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                                    {link.name}
                                </span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]"></span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a0a]/50">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded bg-red-700/20 border border-red-700/30 flex items-center justify-center font-black text-red-600 text-xs">
                            {adminUser?.role?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] text-gray-300 font-mono font-bold truncate uppercase tracking-tight">
                                {adminUser?.email?.split('@')[0]}
                            </p>
                            <p className="text-[8px] text-gray-500 font-mono uppercase tracking-widest">
                                {adminUser?.role === 'master' ? 'Level 0 Access' : 'Level 1 Access'}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all font-mono text-[10px] uppercase tracking-[0.2em] font-black border border-transparent hover:border-red-500/20"
                    >
                        <span>🚪</span>
                        <span>Abort Session</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
