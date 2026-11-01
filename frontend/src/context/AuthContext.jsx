import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, fetchAdminMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('sweet_cake_admin_token') || null);
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('sweet_cake_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchAdminMe();
        if (res.data && res.data.admin) {
          setAdmin(res.data.admin);
          localStorage.setItem('sweet_cake_admin_user', JSON.stringify(res.data.admin));
        }
      } catch (err) {
        console.warn('Session expired or invalid, logging out');
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await adminLogin({ email, password });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('sweet_cake_admin_token', res.data.token);
      localStorage.setItem('sweet_cake_admin_user', JSON.stringify(res.data.admin));
      return res.data;
    }
    throw new Error('Authentication failed');
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('sweet_cake_admin_token');
    localStorage.removeItem('sweet_cake_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

