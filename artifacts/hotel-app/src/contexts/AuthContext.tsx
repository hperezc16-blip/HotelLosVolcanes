import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PublicUser } from '@workspace/api-client-react';

interface AuthContextType {
  user: PublicUser | null;
  token: string | null;
  login: (token: string, user: PublicUser) => void;
  logout: () => void;
  updateUser: (user: PublicUser) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('hotel_token');
    const storedUser = localStorage.getItem('hotel_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
        localStorage.removeItem('hotel_token');
        localStorage.removeItem('hotel_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: PublicUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('hotel_token', newToken);
    localStorage.setItem('hotel_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hotel_token');
    localStorage.removeItem('hotel_user');
  };

  const updateUser = (updatedUser: PublicUser) => {
    setUser(updatedUser);
    localStorage.setItem('hotel_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
