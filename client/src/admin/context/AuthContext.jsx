import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAdmin = localStorage.getItem('adminUser');
        if (storedAdmin) {
            try {
                setAdminUser(JSON.parse(storedAdmin));
            } catch (error) {
                console.error('Error parsing admin user:', error);
                localStorage.removeItem('adminUser');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const creds = {
            'dance@invento.com': 'dance123',
            'media@invento.com': 'media123',
            'registration@invento.com': 'reg123',
            'hr@invento.com': 'hr123',
            'music@invento.com': 'music123',
            'coding@invento.com': 'coding123',
            'gaming@invento.com': 'gaming123',
            'art@invento.com': 'art123',
            'master@invento.com': 'master123'
        };

        if (creds[email] && creds[email] === password) {
            const role = email.includes('master') ? 'master' : 'admin';
            const teamName = email.split('@')[0];
            const team = teamName.charAt(0).toUpperCase() + teamName.slice(1);
            
            const user = { email, role, team };
            localStorage.setItem('adminUser', JSON.stringify(user));
            setAdminUser(user);
            return { success: true, role, team };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const logout = () => {
        localStorage.removeItem('adminUser');
        setAdminUser(null);
    };

    return (
        <AdminAuthContext.Provider value={{ adminUser, login, logout, loading }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};
