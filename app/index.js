import React, { useContext } from 'react';
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
import styles from './styles/styles';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './store'; // Import your Redux store
import { lightTheme, darkTheme } from './context/themes';

const Stack = createNativeStackNavigator();

export default function Index() {
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

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
                    backgroundColor: currentTheme.headerBackground,
                  },
                  headerTitleStyle: styles.headerTitleStyle,
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
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="EventList"
                  component={EventList}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="Feed"
                  component={FeedScreen}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="AddPostScreen"
                  component={AddPostScreen}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="QuestionsPage"
                  component={QuestionsPage}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="AskQuestion"
                  component={AskQuestion}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="CalanderView"
                  component={CalanderView}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
                <Stack.Screen
                  name="Feedback"
                  component={Feedback}
                  options={{
                    title: 'Convene',
                    headerStyle: { backgroundColor: currentTheme.headerBackground },
                    headerTitleStyle: styles.headerTitleStyle,
                  }}
                />
              </Stack.Navigator>
            </EventIdProvider>
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}