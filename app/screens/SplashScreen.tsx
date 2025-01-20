import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
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
    };

    checkLoginStatus();
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
    backgroundColor: '#cc0077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 50,
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
