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
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error loading adminData from localStorage:", e);
                return defaultData;
            }
        }
        return defaultData;
    });

    const [loading, setLoading] = useState(false);

    // Derived events filtered by team (Registration events excluded globally)
    const filteredEvents = useMemo(() => {
        return data.events.filter(e => e.team?.toLowerCase() !== 'registration');
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

            // Map backend fields to frontend expected fields if necessary
            const formattedEvents = events.map(e => ({
                id: e._id || e.id,
                name: e.name,
                team: Array.isArray(e.club) ? e.club[0] : (e.club || 'General'),
                total_slots: e.slots.totalSlots,
                available_slots: e.slots.availableSlots,
                reserved_slots: e.slots.totalSlots - e.slots.availableSlots,
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
        const userStr = localStorage.getItem('currentUser');

        if (token) {
            refreshEvents(); // Events list is now public, so safe to fetch for everyone

            // Only fetch admin specific stats if user is admin/coordinator
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.role === 'ADMIN' || user.role === 'COORDINATOR') {
                        refreshStats();
                    }
                } catch (e) {
                    console.error("Error parsing user for stats fetch:", e);
                }
            }
        }
    }, []);



    // Computed Stats (Re-calculated when participants/events/admins/teams change)
    const stats = useMemo(() => {
        // Filter out any lingering registration events from statistics
        const filteredEvents = data.events.filter(e => e.team !== 'Registration');

        const totalParticipants = data.participants.length;
        const totalEvents = filteredEvents.length;
        const totalAdmins = data.admins.length;
        const paidParticipants = data.participants.filter(p => p.payment_status === 'paid');
        const revenue = paidParticipants.reduce((sum, p) => sum + p.payment_amount, 0);

        const adminDistribution = [
            "Dance", "Music", "Media", "Coding", "Gaming", "HR", "Art"
        ].map(team => ({
            team,
            admins: data.admins.filter(a => a.team === team).length,
            participants: data.participants.filter(p => p.team === team).length
        }));

        return {
            masterStats: {
                totalParticipants,
                totalEvents,
                totalAdmins,
                totalRevenue: `₹${revenue.toLocaleString()}`,
                systemHealth: "Optimal",
                activeNodes: 8
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
        updateParticipant,
        updateEvent,
        addAdmin,
        updateTeam
    };


    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
