import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import defaultData from '../data/masterData';
import { apiGet } from '../../utils/apiClient';
import { useAdminAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { adminUser } = useAdminAuth();
    // Initialize state from localData or local storage (as fallback/cache)
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('adminData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    ...parsed,
                    events: parsed.events || [],
                    participants: parsed.participants || [],
                    admins: parsed.admins || [],
                    teams: parsed.teams || [],
                    overviewStats: parsed.overviewStats || null
                };
            } catch (e) {
                console.error("Error loading adminData from localStorage:", e);
            }
        }
        return {
            events: [],
            participants: [],
            admins: [],
            teams: [],
            overviewStats: null
        };
    });

    const [loading, setLoading] = useState(false);

    // Derived events filtered by team (Registration events excluded globally)
    const filteredEvents = useMemo(() => {
        return (data.events || []).filter(e => e.team?.toLowerCase() !== 'registration');
    }, [data.events]);

    // Filtered data for granular admins - moved to top level
    const adminEvents = useMemo(() => {
        if (!adminUser || adminUser.role === 'master' || adminUser.isRegistration) return filteredEvents;
        if (!adminUser.access || adminUser.access.length === 0) return [];
        return filteredEvents.filter(e => adminUser.access.includes(e.id));
    }, [filteredEvents, adminUser]);

    // Fetch fresh events list
    const refreshEvents = async () => {
        try {
            setLoading(true);
            const { data: events } = await apiGet('/api/events');

            if (!Array.isArray(events)) return;

            // Map backend fields to frontend expected fields if necessary
            const formattedEvents = events.map(e => ({
                id: e._id || e.id,
                name: e.name,
                team: Array.isArray(e.club) ? e.club[0] : (e.club || 'General'),
                total_slots: e.slots?.totalSlots || 0,
                available_slots: e.slots?.availableSlots || 0,
                reserved_slots: (e.slots?.totalSlots || 0) - (e.slots?.availableSlots || 0),
                status: e.registration?.isOpen ? "Live" : "Closed",
                eventType: e.eventType,
                specificSlots: e.specificSlots,
                price: e.price,
                registration: e.registration,
                slots: e.slots
            }));

            setData(prev => ({
                ...prev,
                events: formattedEvents
            }));
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all participants/registrations
    const refreshParticipants = async () => {
        try {
            const { data: participants } = await apiGet('/api/events/registrations/all');
            if (Array.isArray(participants)) {
                setData(prev => ({
                    ...prev,
                    participants: participants
                }));
            }
        } catch (error) {
            console.error("Failed to fetch participants:", error);
        }
    };

    // Fetch all admins
    const refreshAdmins = async () => {
        try {
            const { data: admins } = await apiGet('/api/admins');
            if (Array.isArray(admins)) {
                setData(prev => ({
                    ...prev,
                    admins: admins
                }));
            }
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        }
    };

    // Fetch fest-wide overview
    const refreshStats = async () => {
        try {
            const { data: overview } = await apiGet('/api/events/analytics/overview');
            setData(prev => ({
                ...prev,
                overviewStats: overview
            }));
        } catch (error) {
            console.error("Failed to fetch overview stats:", error);
        }
    };

    // Auto-persist on every update
    useEffect(() => {
        localStorage.setItem('adminData', JSON.stringify(data));
    }, [data]);

    // Fetch on initial load if we have a token and proper role
    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminUserStr = localStorage.getItem('adminUser');

        if (token) {
            refreshEvents(); 

            if (adminUserStr) {
                try {
                    const user = JSON.parse(adminUserStr);
                    const role = user.role?.toUpperCase();
                    if (role === 'ADMIN' || role === 'MASTER' || role === 'COORDINATOR') {
                        refreshStats();
                        refreshParticipants();
                        if (role === 'MASTER') {
                            refreshAdmins();
                        }
                    }
                } catch (e) {
                    console.error("Error parsing user for stats fetch:", e);
                }
            }
        }
    }, [adminUser]);

    // Computed Stats (Re-calculated when participants/events/admins/teams change)
    const stats = useMemo(() => {
        // Filter out any lingering registration events from statistics
        const currentEvents = data.events || [];
        const filteredEvents = currentEvents.filter(e => e.team !== 'Registration');

        const participants = data.participants || [];
        const admins = data.admins || [];

        const totalParticipants = participants.length;
        const totalEvents = filteredEvents.length;
        const totalAdmins = admins.length;
        
        // Calculate revenue from participants and teams
        const revenue = participants.reduce((sum, p) => {
            // Check if it's a team or solo participant
            if (p.paid || p.payment_status === 'paid') {
                // If it's a team, we should be careful not to double count if the structure is different
                // In getFestRegistrations, it seems teams are included in the same list
                const amount = p.payment_amount || p.amount || 0;
                return sum + amount;
            }
            return sum;
        }, 0);

        const adminDistribution = [
            "Dance", "Music", "Media", "Coding", "Gaming", "HR", "Art"
        ].map(team => ({
            team,
            admins: admins.filter(a => a.team === team).length,
            participants: participants.filter(p => p.team === team).length
        }));

        return {
            masterStats: {
                totalParticipants,
                totalEvents,
                totalAdmins,
                totalRevenue: `₹${revenue.toLocaleString()}`,
                systemHealth: "Optimal",
                activeNodes: admins.filter(a => a.status === 'Active').length || 8
            },
            adminDistribution
        };
    }, [data.participants, data.events, data.admins, data.teams]);

    // Update Functions
    const updateParticipant = (id, updates) => {
        setData(prev => ({
            ...prev,
            participants: prev.participants.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
    };

    const updateEvent = (id, updates) => {
        setData(prev => ({
            ...prev,
            events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e)
        }));
    };

    const addAdmin = (newAdmin) => {
        setData(prev => ({
            ...prev,
            admins: [...prev.admins, newAdmin]
        }));
    };

    const updateTeam = (id, updates) => {
        setData(prev => ({
            ...prev,
            teams: prev.teams.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
    };

    const value = {
        data: {
            ...data,
            events: filteredEvents,
            masterStats: stats.masterStats,
            adminDistribution: stats.adminDistribution,
            overviewStats: data.overviewStats
        },
        adminEvents,
        loading,
        refreshEvents,
        refreshStats,
        refreshParticipants,
        refreshAdmins,
        updateParticipant,
        updateEvent,
        addAdmin,
        updateTeam
    };


    return (
        <DataContext.Provider value={value}>
            {console.log("DataProvider is rendering children:", !!children)}
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        console.error("useData called outside of Provider! Current tree might be broken.");
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
