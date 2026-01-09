import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import defaultData from '../data/masterData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    // Initialize state from localStorage or defaultData
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

    // Auto-persist on every update
    useEffect(() => {
        localStorage.setItem('adminData', JSON.stringify(data));
    }, [data]);

    // Computed Stats (Re-calculated when participants/events/admins/teams change)
    const stats = useMemo(() => {
        const totalParticipants = data.participants.length;
        const totalEvents = data.events.length;
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
            masterStats: stats.masterStats,
            adminDistribution: stats.adminDistribution
        },
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
