import React, { useContext } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import Feed from '../Components/Feed';
import ModernFooter from '../Components/ModernFooter';
import FeedbackHeader from './FeedbackHeader';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';

const ModernFeedScreen = () => {
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[modernStyles.container, { backgroundColor: currentTheme.background }]}>
      {/* Modern Header */}
      <View style={[styles.header, { backgroundColor: currentTheme.secondary }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <Text style={styles.headerIcon}>🏠</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: currentTheme.text }]}>Feed</Text>
              <Text style={[styles.headerSubtitle, { color: designTokens.colors.textSecondary }]}>
                Stay updated with the latest posts
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Feedback Header */}
      <View style={styles.feedbackContainer}>
        <FeedbackHeader />
      </View>

      {/* Feed Content */}
      <View style={styles.feedContainer}>
        <Feed />
      </View>

      {/* Modern Footer */}
      <ModernFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.lg,
    ...designTokens.shadows.sm,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: designTokens.typography.xl,
    fontWeight: '700',
    fontFamily: designTokens.typography.fontFamilyBold,
    marginBottom: designTokens.spacing.xs,
  },
  headerSubtitle: {
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: designTokens.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...designTokens.shadows.sm,
  },
  notificationText: {
    color: designTokens.colors.textInverse,
    fontSize: designTokens.typography.xs,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
  feedbackContainer: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  feedContainer: {
    flex: 1,
  },
});

export default ModernFeedScreen; 