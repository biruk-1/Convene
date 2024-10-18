import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import FeedScreen from './screens/FeedScreen';
import AddPostScreen from './screens/AddPostScreen';
import QuestionsPage from './screens/QuestionsPage';
import AskQuestion from './screens/AskQuestion';
import CalanderView from './screens/CalendarView';
import Profile from './screens/Profile';
import Feedback from './screens/FeedBack';
import SplashScreen from './screens/SplashScreen';
import styles from './styles/styles'; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }} // Hide header
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          title: 'Feed',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="AddPostScreen"
        component={AddPostScreen}
        options={{
          title: 'Add Post',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="QuestionsPage"
        component={QuestionsPage}
        options={{
          title: 'Questions',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="AskQuestion"
        component={AskQuestion}
        options={{
          title: 'Ask a Question',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="CalanderView"
        component={CalanderView}
        options={{
          title: 'Calendar',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{
          title: 'Feedback',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      />
    </Stack.Navigator>
  );
}
