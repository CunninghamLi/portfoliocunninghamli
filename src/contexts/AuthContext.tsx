import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_USERNAME = 'cunninghamli';
const VALID_PASSWORD = 'pwd123';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('portfolio_auth');
    if (stored === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('portfolio_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('portfolio_auth');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
