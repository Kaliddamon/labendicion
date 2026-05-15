import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (googleToken: string, user: AuthUser) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export interface AuthUser {
  email: string;
  name: string;
  picture: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('authToken');
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });

  const login = (googleToken: string, authUser: AuthUser) => {
    localStorage.setItem('authToken', googleToken);
    localStorage.setItem('authUser', JSON.stringify(authUser));
    setTokenState(googleToken);
    setUser(authUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const setToken = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

