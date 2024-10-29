import React, { createContext, useContext, useState } from 'react';

// Create an AuthContext for managing the login state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store the logged-in user

  const login = (username) => {
    setUser(username);  // When the user logs in, store their username
  };

  const logout = () => {
    setUser(null);  // Clear the user when they log out
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
