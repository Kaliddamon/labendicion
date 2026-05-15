import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  roles: string[];
  login: (googleToken: string, user: AuthUser, roles: string[]) => void;
  logout: () => void;
  setToken: (token: string) => void;
  tieneRol: (nombreRol: string) => boolean;
  tienePermiso: (nombrePermiso: string) => boolean;
}

export interface AuthUser {
  id?: number;
  email: string;
  name: string;
  picture: string;
  roles?: string[];
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

  const [roles, setRoles] = useState<string[]>(() => {
    const storedRoles = localStorage.getItem('authRoles');
    return storedRoles ? JSON.parse(storedRoles) : [];
  });

  const login = (googleToken: string, authUser: AuthUser, userRoles: string[] = []) => {
    localStorage.setItem('authToken', googleToken);
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem('authRoles', JSON.stringify(userRoles));
    setTokenState(googleToken);
    setUser(authUser);
    setRoles(userRoles);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authRoles');
    setTokenState(null);
    setUser(null);
    setRoles([]);
    setIsAuthenticated(false);
  };

  const setToken = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setTokenState(newToken);
  };

  const tieneRol = (nombreRol: string): boolean => {
    return roles.includes(nombreRol);
  };

  const tienePermiso = (nombrePermiso: string): boolean => {
    // Por ahora, implementaremos esto en el backend
    // En el frontend solo verificamos roles
    return true; // Implementar lógica de permisos si es necesario
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, roles, login, logout, setToken, tieneRol, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
