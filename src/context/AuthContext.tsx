import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  emp_id: string;
  avatar?: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('pms_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pms_token') || null;
  });

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('pms_user', JSON.stringify(data.user));
        localStorage.setItem('pms_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login gagal' };
      }
    } catch (err: any) {
      // Fallback local mock login if backend network issue
      if (email && password === 'password123') {
        const mockUser: User = {
          id: 1,
          name: email.includes('hendra') ? 'Hendra Gunawan' : email.includes('sarah') ? 'Sarah Jenkins' : 'Bambang Sutrisno',
          email,
          role: email.includes('hendra') ? 'General Manager' : email.includes('sarah') ? 'Front Desk Manager' : 'Front Desk Agent',
          emp_id: 'EMP-001',
          avatar: email.includes('sarah') 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
            : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
          status: 'ACTIVE',
        };
        setUser(mockUser);
        setToken('demo-token');
        localStorage.setItem('pms_user', JSON.stringify(mockUser));
        localStorage.setItem('pms_token', 'demo-token');
        return { success: true };
      }
      return { success: false, message: 'Gagal terhubung ke server.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pms_user');
    localStorage.removeItem('pms_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
