import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an AuthContext for managing the login state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in when the app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setIsLoading(true);
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const userId = await AsyncStorage.getItem('userId');
        const userData = await AsyncStorage.getItem('userData');

        if (isLoggedIn === 'true' && userId && userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          setIsAuthenticated(true);
        } else {
          // Clear any partial data
          await clearSession();
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const clearSession = async () => {
    try {
      await AsyncStorage.multiRemove([
        'isLoggedIn',
        'userId',
        'userData',
        'eventId',
        'userPreferences'
      ]);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  const login = async (userData) => {
    try {
      // Ensure userId is a string
      const userId = typeof userData.id === 'string' ? userData.id : String(userData.id);
      
      // Store all user data
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await clearSession();
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    clearSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
