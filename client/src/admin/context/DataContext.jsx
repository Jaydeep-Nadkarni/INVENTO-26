import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiGet, apiPatch } from '../../utils/apiClient';
import { useAdminAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { adminUser } = useAdminAuth();
    // Initialize state from local storage (as fallback/cache)
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('adminData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure we don't carry over static data by checking if it looks like masterData
                if (parsed.participants?.length === 120 && parsed.admins?.length === 8) {
                    localStorage.removeItem('adminData');
                } else {
                    return {
                        ...parsed,
                        events: parsed.events || [],
                        participants: parsed.participants || [],
                        admins: parsed.admins || [],
                        teams: parsed.teams || [],
                        overviewStats: parsed.overviewStats || null,
                        globalSettings: parsed.globalSettings || { registrationsOpen: true },
                        masterActivityLogs: parsed.masterActivityLogs || []
                    };
                }
            } catch (e) {
                console.error("Error loading adminData from localStorage:", e);
            }
        }
        return {
            events: [],
            participants: [],
            admins: [],
            teams: [],
            overviewStats: null,
            globalSettings: { registrationsOpen: true },
            masterActivityLogs: []
        };
    });

    const [loading, setLoading] = useState(false);

    // Derived events filtered by team (Registration events excluded globally)
    const filteredEvents = useMemo(() => {
        return (data.events || []).filter(e => e.team?.toLowerCase() !== 'registration');
    }, [data.events]);

    // Derived teams from events
    const derivedTeams = useMemo(() => {
        const teamsSet = new Set();
        (data.events || []).forEach(e => {
            if (e.team && e.team.toLowerCase() !== 'registration') {
                teamsSet.add(e.team);
            }
        });
        // Always include General if not present
        teamsSet.add('General');
        
        return Array.from(teamsSet).map((team, index) => ({
            id: `T-${String(index + 1).padStart(2, '0')}`,
            name: team
        }));
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
                team: e.club || 'General',
                club: e.club,
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

    const refreshGlobalSettings = async () => {
        try {
            const { data } = await apiGet('/api/admins/settings/global');
            setData(prev => ({ ...prev, globalSettings: data }));
        } catch (error) {
            console.error("Failed to fetch global settings:", error);
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

    const refreshAll = async () => {
        setLoading(true);
        await Promise.allSettled([
            refreshEvents(),
            refreshParticipants(),
            refreshStats(),
            refreshAdmins(),
            refreshGlobalSettings()
        ]);
        setLoading(false);
    };

    const updateGlobalSettings = async (updates) => {
        try {
            const { data } = await apiPut('/api/admins/settings/global', updates);
            setData(prev => ({ ...prev, globalSettings: data }));
            return true;
        } catch (error) {
            console.error("Failed to update global settings:", error);
            return false;
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
        const filteredEventsList = currentEvents.filter(e => e.team !== 'Registration');

        const participants = data.participants || [];
        const admins = data.admins || [];

        const totalParticipants = participants.length;
        const totalEvents = filteredEventsList.length;
        const totalAdmins = admins.length;
        
        // Use revenue from overviewStats if available, otherwise calculate from local data
        // (Note: local data might be incomplete if price is not included)
        const revenueValue = data.overviewStats?.totals?.[0]?.totalRevenue || 
                            data.overviewStats?.totalRevenue || 0;

        const adminDistribution = derivedTeams.map(teamObj => ({
            team: teamObj.name,
            admins: admins.filter(a => a.team === teamObj.name).length,
            participants: participants.filter(p => p.team === teamObj.name).length
        }));

        return {
            masterStats: {
                totalParticipants,
                totalEvents,
                totalAdmins,
                totalRevenue: `₹${revenueValue.toLocaleString()}`,
                systemHealth: "Optimal",
                activeNodes: admins.filter(a => a.status === 'Active').length
            },
            adminDistribution
        };
    }, [data.participants, data.events, data.admins, derivedTeams, data.overviewStats]);

    // Update Functions
    const updateParticipant = async (eventId, inventoId, updates) => {
        try {
            // updates could contain: status, isPresent, paid
            if (updates.status) {
                await apiPatch(`/api/events/${eventId}/participants/${inventoId}/status`, { status: updates.status });
            }
            if (updates.isPresent !== undefined) {
                await apiPatch(`/api/events/${eventId}/participants/${inventoId}/attendance`, { isPresent: updates.isPresent });
            }
            // Add other update logic if needed (e.g., payment status)
            
            // Refresh participants to get updated state from backend
            await refreshParticipants();
            return true;
        } catch (error) {
            console.error("Failed to update participant:", error);
            return false;
        }
    };

    const updateEvent = async (id, updates) => {
        try {
            await apiPatch(`/api/events/${id}`, updates);
            await refreshEvents();
            return true;
        } catch (error) {
            console.error("Failed to update event:", error);
            return false;
        }
    };

    const createAdmin = async (payload) => {
        try {
            await apiPost('/api/admins', payload);
            await refreshAdmins();
            await refreshStats();
            return true;
        } catch (error) {
            console.error("Failed to create admin:", error);
            return false;
        }
    };

    const updateAdmin = async (id, updates) => {
        try {
            await apiPut(`/api/admins/${id}`, updates);
            await refreshAdmins();
            return true;
        } catch (error) {
            console.error("Failed to update admin:", error);
            return false;
        }
    };

    const deleteAdmin = async (id) => {
        try {
            await apiDelete(`/api/admins/${id}`);
            await refreshAdmins();
            await refreshStats();
            return true;
        } catch (error) {
            console.error("Failed to delete admin:", error);
            return false;
        }
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
            teams: derivedTeams,
            masterStats: stats.masterStats,
            adminDistribution: stats.adminDistribution,
            overviewStats: data.overviewStats,
            masterActivityLogs: data.masterActivityLogs || []
        },
        adminEvents,
        loading,
        refreshEvents,
        refreshStats,
        refreshParticipants,
        refreshAdmins,
        refreshGlobalSettings,
        updateParticipant,
        updateEvent,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        updateGlobalSettings,
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
        console.error("useData called outside of Provider! Current tree might be broken.");
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
