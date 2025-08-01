import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';

const ModernHeader = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightComponent,
  leftComponent,
  icon = null,
  badge = null,
  transparent = false,
}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: transparent ? 'transparent' : currentTheme.secondary,
          borderBottomColor: transparent ? 'transparent' : designTokens.colors.borderLight,
        },
      ]}
    >
      <View style={styles.headerContent}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icon
                name="chevron-back"
                size={24}
                color={currentTheme.text}
              />
            </TouchableOpacity>
          )}
          {leftComponent}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {icon && (
            <View style={styles.headerIconContainer}>
              <Text style={styles.headerIcon}>{icon}</Text>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: currentTheme.text }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: designTokens.colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {badge && (
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            </View>
          )}
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.lg,
    borderBottomWidth: 1,
    ...designTokens.shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designTokens.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    ...designTokens.shadows.sm,
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: designTokens.spacing.md,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designTokens.colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: designTokens.spacing.md,
  },
  headerIcon: {
    fontSize: 18,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: designTokens.typography.xl,
    fontWeight: '700',
    fontFamily: designTokens.typography.fontFamilyBold,
    textAlign: 'center',
    marginBottom: designTokens.spacing.xs,
  },
  subtitle: {
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
    textAlign: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'flex-end',
  },
  badgeContainer: {
    marginRight: designTokens.spacing.sm,
  },
  badge: {
    backgroundColor: designTokens.colors.error,
    borderRadius: designTokens.borderRadius.full,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: designTokens.colors.textInverse,
    fontSize: designTokens.typography.xs,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
});

export default ModernHeader; 