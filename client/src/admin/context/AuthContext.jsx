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
        // Dummy credentials validation
        if (email === 'admin@invento.com' && password === 'admin123') {
            const user = { email, role: 'admin' };
            localStorage.setItem('adminUser', JSON.stringify(user));
            setAdminUser(user);
            return { success: true, role: 'admin' };
        } else if (email === 'master@invento.com' && password === 'master123') {
            const user = { email, role: 'master' };
            localStorage.setItem('adminUser', JSON.stringify(user));
            setAdminUser(user);
            return { success: true, role: 'master' };
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
