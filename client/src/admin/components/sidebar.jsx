import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Users2,
    BarChart3,
    Shield,
    Calendar,
    Activity,
    LogOut,
    CheckCircle
} from 'lucide-react';

const Sidebar = ({ panelType = 'admin' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, adminUser } = useAdminAuth();
    const isMaster = panelType === 'master';

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Participants', path: '/admin/participants', icon: <Users className="w-5 h-5" /> },
        { name: 'Stats', path: '/admin/stats', icon: <BarChart3 className="w-5 h-5" /> },
    ];

    const masterLinks = [
        { name: 'Dashboard', path: '/master/dashboard', icon: <Shield className="w-5 h-5" /> },
        { name: 'Admins', path: '/master/admins', icon: <Users className="w-5 h-5" /> },
        { name: 'Events', path: '/master/events', icon: <Calendar className="w-5 h-5" /> },
        { name: 'Participants', path: '/master/participants', icon: <Users className="w-5 h-5" /> },
        { name: 'Stats', path: '/master/stats', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Admin Controls', path: '/master/controls', icon: <CheckCircle className="w-5 h-5" /> },
    ];

    const links = panelType === 'master' ? masterLinks : adminLinks;

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <aside className="w-64 h-screen flex flex-col fixed left-0 top-0 z-40 transition-colors duration-500 bg-white border-r border-gray-200 text-gray-900">
            {/* Header / Logo */}
            <div className="p-6 border-b border-gray-100">
                <h1 className="font-bold text-xl tracking-tight uppercase text-gray-900">
                    INVENTO <span className="text-gray-400 text-sm italic">'26</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest mt-1 text-gray-500">
                    {isMaster ? 'Master Control' : 'Administrator'}
                </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${isActive
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}>
                                {link.icon}
                            </span>
                            <span className="text-sm font-medium">
                                {link.name}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase bg-white border border-gray-200 text-gray-700 shadow-sm">
                        {adminUser?.role?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-semibold truncate leading-none mb-1 text-gray-900">
                            {adminUser?.email?.split('@')[0]}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider leading-none text-gray-400">
                            {adminUser?.role === 'master' ? 'System Owner' : `${adminUser?.team} Team`}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
