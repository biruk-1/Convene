import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import FeedScreen from '../screens/FeedScreen';
import CalanderView from '../screens/CalendarView';
import AddPostScreen from '../screens/AddPostScreen';
import QuestionsPage from '../screens/QuestionsPage';
import Profile from '../screens/Profile';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 414;

const Tab = createBottomTabNavigator();

const ModernTabNavigator = () => {
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const getTabBarStyle = () => {
    const baseHeight = Platform.OS === 'ios' ? 102 : 80;
    const adjustedHeight = isSmallDevice ? baseHeight - 8 : isLargeDevice ? baseHeight + 8 : baseHeight;
    
    return {
      backgroundColor: currentTheme.tabBarBackground || currentTheme.background,
      borderTopWidth: 0,
      elevation: Platform.OS === 'android' ? 8 : 0,
      shadowColor: currentTheme.shadow || '#000',
      shadowOffset: {
        width: 0,
        height: Platform.OS === 'ios' ? -3 : -2,
      },
      shadowOpacity: theme === 'dark' ? 0.4 : 0.08,
      shadowRadius: Platform.OS === 'ios' ? 10 : 8,
      paddingBottom: Platform.OS === 'ios' ? 34 : 16,
      paddingTop: Platform.OS === 'ios' ? 8 : 12,
      paddingHorizontal: Platform.OS === 'ios' ? 0 : 8,
      height: adjustedHeight,
      borderTopLeftRadius: Platform.OS === 'ios' ? 24 : 20,
      borderTopRightRadius: Platform.OS === 'ios' ? 24 : 20,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      // Fix for dark theme visibility issues
      ...(theme === 'dark' && {
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
      }),
    };
  };

  const getTabBarIcon = (routeName, focused) => {
    let iconName;
    let baseSize = focused 
      ? (Platform.OS === 'ios' ? 28 : 26) 
      : (Platform.OS === 'ios' ? 26 : 24);
    
    // Adjust size based on device
    const size = isSmallDevice ? baseSize - 2 : isLargeDevice ? baseSize + 2 : baseSize;

    switch (routeName) {
      case 'Feed':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Calendar':
        iconName = focused ? 'calendar' : 'calendar-outline';
        break;
      case 'AddPost':
        iconName = focused ? 'add-circle' : 'add-circle-outline';
        break;
      case 'Questions':
        iconName = focused ? 'help-circle' : 'help-circle-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'home-outline';
    }

    const iconColor = focused 
      ? currentTheme.primary 
      : (theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : currentTheme.textSecondary);

    return (
      <Ionicons 
        name={iconName} 
        size={size} 
        color={iconColor} 
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
        tabBarActiveTintColor: currentTheme.primary,
        tabBarInactiveTintColor: currentTheme.textSecondary,
        tabBarStyle: getTabBarStyle(),
        tabBarLabelStyle: {
          fontSize: isSmallDevice ? 9 : Platform.OS === 'ios' ? 11 : 10,
          fontWeight: '600',
          marginTop: Platform.OS === 'ios' ? 4 : 6,
          color: currentTheme.textSecondary,
          // Ensure proper contrast in dark theme
          ...(theme === 'dark' && {
            color: 'rgba(255, 255, 255, 0.7)',
          }),
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen}
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => getTabBarIcon('Feed', focused),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalanderView}
        options={{ 
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ focused }) => getTabBarIcon('Calendar', focused),
        }}
      />
      <Tab.Screen 
        name="AddPost" 
        component={AddPostScreen}
        options={{ 
          tabBarLabel: 'Post',
          tabBarIcon: ({ focused }) => getTabBarIcon('AddPost', focused),
        }}
      />
      <Tab.Screen 
        name="Questions" 
        component={QuestionsPage}
        options={{ 
          tabBarLabel: 'Questions',
          tabBarIcon: ({ focused }) => getTabBarIcon('Questions', focused),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => getTabBarIcon('Profile', focused),
        }}
      />
    </Tab.Navigator>
  );
};

export default ModernTabNavigator; 