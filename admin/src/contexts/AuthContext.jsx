import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { loginApi } from '@/api/auth';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'authUser';
const DEFAULT_ADMIN_USER = { name: '관리자', email: 'admin@bukchon.kr' };
const BROKEN_ADMIN_NAMES = new Set(['愿由ъ옄', '原亘由中역']);

function normalizeUserName(name) {
  const normalized = typeof name === 'string' ? name.trim() : '';

  if (!normalized || BROKEN_ADMIN_NAMES.has(normalized)) {
    return DEFAULT_ADMIN_USER.name;
  }

  return normalized;
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') {
    return DEFAULT_ADMIN_USER;
  }

  return {
    ...DEFAULT_ADMIN_USER,
    ...user,
    name: normalizeUserName(user.name),
  };
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setUser(normalizeUser(getStoredUser()));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password, remember = false) => {
    const response = await loginApi(username, password);
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    otherStorage.removeItem(TOKEN_KEY);
    otherStorage.removeItem(USER_KEY);

    storage.setItem(TOKEN_KEY, response.token);
    storage.setItem(USER_KEY, JSON.stringify(response.user));

    setUser(normalizeUser(response.user));
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
