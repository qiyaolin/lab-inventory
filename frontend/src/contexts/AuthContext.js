import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage or default to null
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [tokens, setTokens] = useState(() => {
    const storedTokens = localStorage.getItem('tokens');
    return storedTokens ? JSON.parse(storedTokens) : null;
  });

  // Effect to update localStorage whenever user or tokens change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (tokens) {
      localStorage.setItem('tokens', JSON.stringify(tokens));
    } else {
      localStorage.removeItem('tokens');
    }
  }, [tokens]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setTokens(tokenData);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    // No need to manually clear localStorage here, the useEffects will handle it.
  };

  // The context value that will be supplied to all consuming components
  const value = { user, tokens, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 