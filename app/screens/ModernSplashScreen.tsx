import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';

const { width, height } = Dimensions.get('window');

const ModernSplashScreen = ({ navigation }: { navigation: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    const startAnimations = async () => {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Scale animation
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Logo bounce animation
      Animated.sequence([
        Animated.timing(logoScaleAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    };

    startAnimations();

    // Check login status and navigate
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          const userId = await AsyncStorage.getItem('userId');
          // Navigate directly to main screen if logged in
          setTimeout(() => {
            navigation.replace('EventList', { participantId: userId });
          }, 2500);
        } else {
          // Navigate to Login screen after 3 seconds
          setTimeout(() => {
            navigation.replace('Login');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Fallback to login screen
        setTimeout(() => {
          navigation.replace('Login');
        }, 3000);
      }
    };

    checkLoginStatus();
  }, [navigation, fadeAnim, scaleAnim, logoScaleAnim]);

  return (
    <LinearGradient
      colors={[
        designTokens.colors.primary,
        designTokens.colors.primaryDark,
        designTokens.colors.secondary,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <Text style={styles.appName}>Convene</Text>
          <Text style={styles.subtitle}>A product of Kiburan</Text>
        </Animated.View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    backgroundColor: designTokens.colors.textInverse,
                    transform: [
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 1, 0.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: designTokens.spacing['4xl'],
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.xl,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 48,
    color: designTokens.colors.textInverse,
    fontWeight: 'bold',
    fontFamily: designTokens.typography.fontFamilyBold,
  },
  appName: {
    fontSize: designTokens.typography['3xl'],
    color: designTokens.colors.textInverse,
    fontWeight: 'bold',
    fontFamily: designTokens.typography.fontFamilyBold,
    marginBottom: designTokens.spacing.sm,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: designTokens.typography.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: designTokens.typography.fontFamily,
    letterSpacing: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ModernSplashScreen; 