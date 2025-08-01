import React, { useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEventId } from '../context/EventIdContext';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';

export default function ModernFooter() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Feed');
  const { eventId } = useEventId();

  // Animation values for each tab
  const tabAnimations = useRef({
    Feed: new Animated.Value(1),
    CalanderView: new Animated.Value(1),
    AddPostScreen: new Animated.Value(1),
    QuestionsPage: new Animated.Value(1),
    Profile: new Animated.Value(1),
  }).current;

  const handlePress = (screenName, params = {}) => {
    // Animate the pressed tab
    Animated.sequence([
      Animated.timing(tabAnimations[screenName], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnimations[screenName], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate(screenName, params);
  };

  // Update the activeTab when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setActiveTab(routeName);
    }, [navigation])
  );

  const renderTab = (screenName, iconName, label, params = {}) => {
    const isActive = activeTab === screenName;
    const scale = tabAnimations[screenName];

    return (
      <TouchableOpacity
        key={screenName}
        onPress={() => handlePress(screenName, params)}
        style={styles.tabContainer}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.tabContent,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              isActive && styles.activeIconContainer,
            ]}
          >
            <Icon
              name={iconName}
              size={24}
              color={isActive ? designTokens.colors.textInverse : designTokens.colors.textSecondary}
            />
          </View>
          <Animated.Text
            style={[
              styles.tabLabel,
              {
                color: isActive ? designTokens.colors.primary : designTokens.colors.textSecondary,
                opacity: scale.interpolate({
                  inputRange: [0.8, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[modernStyles.navigationBar, styles.footerContainer]}>
      <View style={styles.tabsContainer}>
        {renderTab('Feed', 'home-outline', 'Home', { eventId })}
        {renderTab('CalanderView', 'calendar-outline', 'Calendar')}
        {renderTab('AddPostScreen', 'add-circle-outline', 'Post')}
        {renderTab('QuestionsPage', 'help-circle-outline', 'Questions')}
        {renderTab('Profile', 'person-outline', 'Profile')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: designTokens.spacing.sm,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: designTokens.spacing.xs,
    backgroundColor: designTokens.colors.backgroundTertiary,
    ...designTokens.shadows.sm,
  },
  activeIconContainer: {
    backgroundColor: designTokens.colors.primary,
    ...designTokens.shadows.md,
  },
  tabLabel: {
    fontSize: designTokens.typography.xs,
    fontWeight: '500',
    fontFamily: designTokens.typography.fontFamilyMedium,
    textAlign: 'center',
  },
}); 