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

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/admins/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const user = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role.toLowerCase(), // Store lowercase for frontend consistency if needed, but backend expects uppercase
                    team: data.team,
                    access: data.access || [],
                    isRegistration: data.isRegistration || false
                };
                
                // Store both token and user
                localStorage.setItem('token', data.token);
                localStorage.setItem('adminUser', JSON.stringify(user));
                setAdminUser(user);
                
                return { success: true, role: user.role, team: user.team };
            } else {
                return { success: false, message: data.message || 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server connection failed' };
        }
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
