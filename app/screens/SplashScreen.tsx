import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from './AuthContext';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  EventList: { participantId?: string };
  Debug: undefined;
};

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('SplashScreen: Component mounted');
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('SplashScreen: Timeout reached, forcing navigation to Login');
      if (!isInitialized) {
        setError('Initialization timeout');
        navigation.replace('Login');
      }
    }, 10000); // 10 second timeout

    const checkLoginStatus = async () => {
      try {
        console.log('SplashScreen: Starting login check...');
        
        // Wait for auth context to finish loading
        if (isLoading) {
          console.log('SplashScreen: Auth context still loading...');
          return;
        }

        console.log('SplashScreen: isAuthenticated =', isAuthenticated);
        
        // Clear timeout since we're proceeding
        clearTimeout(timeoutId);
        setIsInitialized(true);
        
        if (isAuthenticated) {
          const userId = await AsyncStorage.getItem('userId');
          console.log('SplashScreen: userId =', userId);
          // Navigate to event list if authenticated
          setTimeout(() => {
            console.log('SplashScreen: Navigating to EventList');
            navigation.replace('EventList', { participantId: userId || undefined });
          }, 2000);
        } else {
          console.log('SplashScreen: User not authenticated, navigating to Login');
          // Navigate to Login screen after 2 seconds
          setTimeout(() => {
            console.log('SplashScreen: Navigating to Login');
            navigation.replace('Login');
          }, 2000);
        }
      } catch (error) {
        console.error('SplashScreen: Error checking login status:', error);
        clearTimeout(timeoutId);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        
        // Show error alert in development
        if (__DEV__) {
          Alert.alert(
            'Splash Screen Error',
            `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            [{ text: 'Continue to Login', onPress: () => navigation.replace('Login') }]
          );
        } else {
          // Fallback to login screen after 2 seconds
          setTimeout(() => {
            navigation.replace('Login');
          }, 2000);
        }
      }
    };

    checkLoginStatus();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigation, isAuthenticated, isLoading, isInitialized]);

  if (error) {
    return (
      <LinearGradient
        colors={['#4A148C', '#E91E63']}
        style={styles.splashContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.loadingText}>Redirecting to login...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#4A148C', '#E91E63']} // Deep purple to bright magenta
      style={styles.splashContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.logoContainer}>
        {/* New Logo Image */}
        {!imageError ? (
          <Image 
            source={require('../Images/image.png')}
            style={styles.logoImage}
            resizeMode="contain"
            onError={(error) => {
              console.error('Image loading error:', error);
              setImageError(true);
            }}
            onLoad={() => console.log('Image loaded successfully')}
          />
        ) : (
          <View style={[styles.logoImage, { backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>C</Text>
          </View>
        )}
        
        {/* Outlined "Convene" Text */}
        <Text style={styles.logoText}>Convene</Text>
        <Text style={styles.subtitle}>A product of Kiburan</Text>
        
        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? 'Loading...' : 'Initializing...'}
          </Text>
          
          {/* Debug access - tap 5 times quickly */}
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              console.log('Debug button pressed');
              navigation.navigate('Debug');
            }}
          >
            <Text style={styles.debugButtonText}>Debug</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 30,
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugButton: {
    marginTop: 20,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
  },
});

export default SplashScreen;
