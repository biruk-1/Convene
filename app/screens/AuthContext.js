import React, { createContext, useContext, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native'; // Import AsyncStorage for persistent storage
import { useNavigation } from '@react-navigation/native';

// Create an AuthContext for managing the login state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the logged-in user
  const navigation = useNavigation(); // To navigate after login/logout

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
    navigation.replace('Profile'); // Redirect to profile after login
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userId'); // Remove user data from AsyncStorage
    setUser(null); // Clear user state
    navigation.replace('Login'); // Redirect to login screen
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
