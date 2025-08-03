import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from './AuthContext';

const DebugScreen = ({ navigation }) => {
  const [debugInfo, setDebugInfo] = useState({});
  const [storageData, setStorageData] = useState({});
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      // Get AsyncStorage data
      const keys = await AsyncStorage.getAllKeys();
      const storageItems = {};
      
      for (const key of keys) {
        try {
          const value = await AsyncStorage.getItem(key);
          storageItems[key] = value;
        } catch (error) {
          storageItems[key] = `Error: ${error.message}`;
        }
      }

      setStorageData(storageItems);

      // Get system info
      const info = {
        platform: require('react-native').Platform.OS,
        version: require('react-native').Platform.Version,
        isDev: __DEV__,
        timestamp: new Date().toISOString(),
        authState: {
          isAuthenticated,
          isLoading,
          hasUser: !!user
        }
      };

      setDebugInfo(info);
    } catch (error) {
      console.error('Error loading debug info:', error);
      Alert.alert('Debug Error', error.message);
    }
  };

  const testAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('debug_test', 'test_value');
      const value = await AsyncStorage.getItem('debug_test');
      await AsyncStorage.removeItem('debug_test');
      
      Alert.alert('AsyncStorage Test', `Success! Retrieved: ${value}`);
    } catch (error) {
      Alert.alert('AsyncStorage Test Failed', error.message);
    }
  };

  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Storage Cleared', 'All AsyncStorage data has been cleared');
      loadDebugInfo();
    } catch (error) {
      Alert.alert('Clear Failed', error.message);
    }
  };

  const testNavigation = () => {
    try {
      navigation.navigate('Login');
      Alert.alert('Navigation Test', 'Navigation to Login successful');
    } catch (error) {
      Alert.alert('Navigation Test Failed', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#4A148C', '#E91E63']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Debug Information</Text>
          <Text style={styles.subtitle}>App Status & System Info</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Platform: {debugInfo.platform}</Text>
            <Text style={styles.infoText}>Version: {debugInfo.version}</Text>
            <Text style={styles.infoText}>Environment: {debugInfo.isDev ? 'Development' : 'Production'}</Text>
            <Text style={styles.infoText}>Timestamp: {debugInfo.timestamp}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication State</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Is Authenticated: {debugInfo.authState?.isAuthenticated ? 'Yes' : 'No'}</Text>
            <Text style={styles.infoText}>Is Loading: {debugInfo.authState?.isLoading ? 'Yes' : 'No'}</Text>
            <Text style={styles.infoText}>Has User: {debugInfo.authState?.hasUser ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AsyncStorage Data</Text>
          <View style={styles.infoContainer}>
            {Object.keys(storageData).length > 0 ? (
              Object.entries(storageData).map(([key, value]) => (
                <Text key={key} style={styles.infoText}>
                  {key}: {typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>No storage data found</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Functions</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={testAsyncStorage}>
              <Text style={styles.buttonText}>Test AsyncStorage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={testNavigation}>
              <Text style={styles.buttonText}>Test Navigation</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={loadDebugInfo}>
              <Text style={styles.buttonText}>Refresh Debug Info</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearAllStorage}>
              <Text style={styles.buttonText}>Clear All Storage</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 5,
    padding: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dangerButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DebugScreen; 