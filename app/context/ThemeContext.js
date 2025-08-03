import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    // Handle theme changes safely
    const handleAppearanceChange = ({ colorScheme }) => {
      setTheme(colorScheme);
    };

    // Try to add listener, but handle gracefully if it fails
    let subscription;
    try {
      subscription = Appearance.addChangeListener(handleAppearanceChange);
    } catch (error) {
      console.warn('Appearance listener not available:', error);
    }

    return () => {
      try {
        if (subscription && typeof subscription.remove === 'function') {
          subscription.remove();
        }
      } catch (error) {
        console.warn('Error removing appearance listener:', error);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};