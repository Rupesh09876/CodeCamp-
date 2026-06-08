import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth load error", err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      await loadUserProfile();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || 'Registration failed';
      return { success: false, error: msg };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg = err.response?.data?.msg || 'Invalid Credentials';
      return { success: false, message: msg };
    }
  };

  // Helper to load profile after login/register
  const loadUserProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout, loadUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
