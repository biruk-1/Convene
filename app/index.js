import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Alert, LogBox } from 'react-native';
import { AuthProvider } from './screens/AuthContext';
import { EventIdProvider } from './context/EventIdContext';
import LoginScreen from './screens/LoginScreen';
import FeedScreen from './screens/FeedScreen';
import EventList from './screens/EventList';
import AddPostScreen from './screens/AddPostScreen';
import QuestionsPage from './screens/QuestionsPage';
import AskQuestion from './screens/AskQuestion';
import CalanderView from './screens/CalendarView';
import Profile from './screens/Profile';
import Feedback from './screens/FeedBack';
import SplashScreen from './screens/SplashScreen';
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from 'react-redux';
import store from './store';
import { Ionicons } from '@expo/vector-icons';
import AuthGuard from './Components/AuthGuard';
import ModernTabNavigator from './Components/ModernTabNavigator';

// Ignore specific warnings that might cause issues in production
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native',
  'Non-serializable values were found in the navigation state',
]);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Enhanced Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDebugInfo: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('=== CRITICAL APP ERROR ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);
    
    // In production, you might want to send this to a crash reporting service
    this.setState({ errorInfo });
    
    // Show alert in development
    if (__DEV__) {
      Alert.alert(
        'App Error',
        `An error occurred: ${error.message}`,
        [
          { text: 'OK', onPress: () => this.setState({ showDebugInfo: true }) },
          { text: 'Retry', onPress: () => this.setState({ hasError: false, error: null, errorInfo: null }) }
        ]
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong!</Text>
          <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
          
          {this.state.showDebugInfo && this.state.errorInfo && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Information:</Text>
              <Text style={styles.debugText}>
                {JSON.stringify(this.state.errorInfo, null, 2)}
              </Text>
            </View>
          )}
          
          <Text style={styles.retryText}>
            Please restart the app or contact support if the problem persists.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Tab Navigator for authenticated screens
function TabNavigator() {
  return (
    <AuthGuard>
      <ModernTabNavigator />
    </AuthGuard>
  );
}

// Main Stack Navigator
function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back gesture
        animation: 'slide_from_right', // Smooth slide animation
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="EventList"
        component={EventList}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="AskQuestion"
        component={AskQuestion}
        options={{ 
          headerShown: true,
          title: 'Ask Question',
          headerStyle: { backgroundColor: '#4A148C' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{ 
          headerShown: true,
          title: 'Feedback',
          headerStyle: { backgroundColor: '#4A148C' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  retryText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default function Index() {
  console.log('=== APP STARTUP ===');
  console.log('App: Starting application...');
  console.log('Environment:', __DEV__ ? 'Development' : 'Production');
  console.log('Platform:', require('react-native').Platform.OS);
  console.log('Node ENV:', process.env.NODE_ENV);
  
  try {
    console.log('App: Initializing providers...');
    
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider>
            <NavigationContainer
              onStateChange={(state) => {
                console.log('Navigation state changed:', state);
              }}
              onReady={() => {
                console.log('Navigation container is ready');
              }}
              fallback={<View style={styles.errorContainer}><Text>Loading...</Text></View>}
            >
              <AuthProvider>
                <EventIdProvider>
                  <MainNavigator />
                </EventIdProvider>
              </AuthProvider>
            </NavigationContainer>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('App: Critical error during initialization:', error);
    console.error('Error stack:', error.stack);
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Critical Initialization Error</Text>
        <Text style={styles.errorText}>{error.toString()}</Text>
        <Text style={styles.retryText}>
          Please restart the app. If the problem persists, contact support.
        </Text>
      </View>
    );
  }
}