import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for persistent storage

// Create an AuthContext for managing the login state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the logged-in user

  // Check if user is logged in when the app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedInUser = await AsyncStorage.getItem('userId');
      if (loggedInUser) {
        setUser({ username: loggedInUser });
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (username) => {
    await AsyncStorage.setItem('userId', username); // Save user data to AsyncStorage
    setUser({ username }); // Update user state
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userId'); // Remove user data from AsyncStorage
    setUser(null); // Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
