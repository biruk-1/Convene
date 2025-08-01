import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './store'; // Import your Redux store

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <Provider store={store}> {/* Wrap with Redux Provider */}
      <ThemeProvider>
        <NavigationContainer independent={true}>
          <AuthProvider>
            <EventIdProvider>
              <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#ffffff', // Default color, will be overridden by individual screens
                  },
                  headerTitleStyle: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#000',
                    textAlign: 'center',
                  },
                }}
              >
                <Stack.Screen
                  name="Splash"
                  component={SplashScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="EventList"
                  component={EventList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Feed"
                  component={FeedScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddPostScreen"
                  component={AddPostScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="QuestionsPage"
                  component={QuestionsPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AskQuestion"
                  component={AskQuestion}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CalanderView"
                  component={CalanderView}
                  // options={{
                  //   title: 'Convene',
                  //   headerStyle: { backgroundColor: '#ffffff' },
                  //   headerTitleStyle: styles.headerTitleStyle,
                  // }}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={Profile}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Feedback"
                  component={Feedback}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </EventIdProvider>
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}