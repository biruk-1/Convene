// SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    if (!navigation) {
      console.error("Navigation prop is not passed to SplashScreen");
    } else {
      // Automatically navigate to LoginScreen after 3 seconds
      const timer = setTimeout(() => {
        navigation.replace('Login');
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Convene</Text>
        <Text style={styles.subtitle}>A product of Kiburan</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#cc0077', // Adjust to your background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 50, // Adjust based on your logo size
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
});

export default SplashScreen;
