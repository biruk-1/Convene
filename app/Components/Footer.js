import React, { useState, useCallback, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEventId } from '../context/EventIdContext';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

const { width, height } = Dimensions.get('window');

export default function Footer() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Feed');
  const { eventId } = useEventId();
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const handlePress = (screenName, params = {}) => {
    navigation.navigate(screenName, params);
  };

  // Update the activeTab when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setActiveTab(routeName);
    }, [navigation])
  );

  const renderIcon = (name, size, isActive, isAddButton = false) => (
            <Ionicons
          name={name}
          size={size}
          color={isAddButton ? '#FFFFFF' : (isActive ? '#4A148C' : currentTheme.text)}
        />
  );

  return (
    <View style={[styles.footerContainer, { backgroundColor: currentTheme.background }]}>
      {/* Home/Feed Tab */}
      <TouchableOpacity 
        onPress={() => handlePress('Feed', { eventId })} 
        style={styles.iconWrapper}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer, 
          activeTab === 'Feed' && styles.activeIconContainer
        ]}>
          {renderIcon('home-outline', 24, activeTab === 'Feed')}
        </View>
      </TouchableOpacity>

      {/* Calendar Tab */}
      <TouchableOpacity 
        onPress={() => handlePress('CalanderView')} 
        style={styles.iconWrapper}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer, 
          activeTab === 'CalanderView' && styles.activeIconContainer
        ]}>
          {renderIcon('calendar-outline', 24, activeTab === 'CalanderView')}
        </View>
      </TouchableOpacity>

      {/* Add Post Tab */}
      <TouchableOpacity 
        onPress={() => handlePress('AddPostScreen')} 
        style={styles.iconWrapper}
        activeOpacity={0.7}
      >
        <View style={[
          styles.addButtonContainer, 
          activeTab === 'AddPostScreen' && styles.activeAddButton
        ]}>
          {renderIcon('add', 28, activeTab === 'AddPostScreen', true)}
        </View>
      </TouchableOpacity>

      {/* Questions Tab */}
      <TouchableOpacity 
        onPress={() => handlePress('QuestionsPage')} 
        style={styles.iconWrapper}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer, 
          activeTab === 'QuestionsPage' && styles.activeIconContainer
        ]}>
          {renderIcon('help-circle-outline', 24, activeTab === 'QuestionsPage')}
        </View>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity 
        onPress={() => handlePress('Profile')} 
        style={styles.iconWrapper}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer, 
          activeTab === 'Profile' && styles.activeIconContainer
        ]}>
          {renderIcon('person-outline', 24, activeTab === 'Profile')}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12, // Account for home indicator on iOS
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 44,
    minHeight: 44,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(74, 20, 140, 0.1)', // Light purple background for active state
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A148C',
    shadowColor: '#4A148C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeAddButton: {
    backgroundColor: '#31083D',
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.5,
  },
});