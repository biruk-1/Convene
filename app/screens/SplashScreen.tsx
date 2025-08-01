import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          const userId = await AsyncStorage.getItem('userId');
          // Navigate directly to main screen if logged in
          navigation.replace('EventList', { participantId: userId });
        } else {
          // Navigate to Login screen after 3 seconds
          setTimeout(() => {
            navigation.replace('Login');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Fallback to login screen after 3 seconds
        setTimeout(() => {
          navigation.replace('Login');
        }, 3000);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#4A148C', '#E91E63']} // Deep purple to bright magenta
      style={styles.splashContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.logoContainer}>
        {/* New Logo Image */}
        <Image 
          source={require('../Images/image.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        
        {/* Outlined "Convene" Text */}
        <Text style={styles.logoText}>Convene</Text>
        <Text style={styles.subtitle}>A product of Kiburan</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: 'white', // This will make the logo white to match the design
  },
  logoText: {
    fontSize: 36,
    color: 'white',
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
