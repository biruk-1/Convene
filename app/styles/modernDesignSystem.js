import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling function
const scale = (size) => (width / 375) * size;

// Modern iOS-inspired design tokens
export const designTokens = {
  // Colors (preserving brand colors)
  colors: {
    primary: '#cc0077', // Brand pink
    primaryDark: '#a6005f',
    primaryLight: '#ff3399',
    secondary: '#31083D', // Brand purple
    secondaryDark: '#1a041f',
    secondaryLight: '#4a0c5a',
    
    // Background colors
    background: '#F8F9FA',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F1F3F4',
    
    // Text colors
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Border colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
  },
  
  // Typography
  typography: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontFamilyMedium: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    fontFamilyBold: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    
    // Font sizes
    xs: scale(12),
    sm: scale(14),
    base: scale(16),
    lg: scale(18),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(30),
    '4xl': scale(36),
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  // Spacing
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(32),
    '4xl': scale(40),
  },
  
  // Border radius
  borderRadius: {
    sm: scale(6),
    md: scale(8),
    lg: scale(12),
    xl: scale(16),
    '2xl': scale(20),
    full: 9999,
  },
  
  // Shadows (iOS-style)
  shadows: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  
  // Animation durations
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

// Modern component styles
export const modernStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.background,
    paddingHorizontal: designTokens.spacing.lg,
  },
  
  // Card styles
  card: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginVertical: designTokens.spacing.sm,
    ...designTokens.shadows.md,
  },
  
  cardInteractive: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginVertical: designTokens.spacing.sm,
    ...designTokens.shadows.md,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
  },
  
  // Button styles
  button: {
    backgroundColor: designTokens.colors.primary,
    borderRadius: designTokens.borderRadius.lg,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...designTokens.shadows.sm,
  },
  
  buttonSecondary: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: designTokens.colors.border,
  },
  
  buttonText: {
    color: designTokens.colors.textInverse,
    fontSize: designTokens.typography.base,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
  
  buttonTextSecondary: {
    color: designTokens.colors.textPrimary,
    fontSize: designTokens.typography.base,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
  
  // Input styles
  input: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
    borderRadius: designTokens.borderRadius.lg,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    fontSize: designTokens.typography.base,
    color: designTokens.colors.textPrimary,
    fontFamily: designTokens.typography.fontFamily,
  },
  
  inputFocused: {
    borderColor: designTokens.colors.primary,
    ...designTokens.shadows.sm,
  },
  
  // Text styles
  text: {
    color: designTokens.colors.textPrimary,
    fontSize: designTokens.typography.base,
    fontFamily: designTokens.typography.fontFamily,
    lineHeight: designTokens.typography.lineHeight.normal * designTokens.typography.base,
  },
  
  textLarge: {
    color: designTokens.colors.textPrimary,
    fontSize: designTokens.typography.lg,
    fontFamily: designTokens.typography.fontFamily,
    lineHeight: designTokens.typography.lineHeight.normal * designTokens.typography.lg,
  },
  
  textSmall: {
    color: designTokens.colors.textSecondary,
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
    lineHeight: designTokens.typography.lineHeight.normal * designTokens.typography.sm,
  },
  
  textBold: {
    fontWeight: '700',
    fontFamily: designTokens.typography.fontFamilyBold,
  },
  
  textMedium: {
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
  },
  
  // Header styles
  header: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.lg,
    ...designTokens.shadows.sm,
  },
  
  headerTitle: {
    fontSize: designTokens.typography['2xl'],
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
    fontFamily: designTokens.typography.fontFamilyBold,
  },
  
  // Navigation styles
  navigationBar: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: designTokens.spacing.md,
    ...designTokens.shadows.lg,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.background,
  },
  
  // Gradient styles for splash screen
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modern list styles
  listItem: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginVertical: designTokens.spacing.xs,
    marginHorizontal: designTokens.spacing.lg,
    ...designTokens.shadows.sm,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
  },
  
  // Icon styles
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: designTokens.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: designTokens.colors.backgroundTertiary,
  },
  
  // Avatar styles
  avatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: designTokens.borderRadius.full,
    backgroundColor: designTokens.colors.backgroundTertiary,
  },
  
  avatarLarge: {
    width: scale(80),
    height: scale(80),
    borderRadius: designTokens.borderRadius.full,
    backgroundColor: designTokens.colors.backgroundTertiary,
  },
  
  // Badge styles
  badge: {
    backgroundColor: designTokens.colors.primary,
    borderRadius: designTokens.borderRadius.full,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
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

// Utility functions
export const getResponsiveSize = (size) => scale(size);
export const getPlatformSpecificStyle = (iosStyle, androidStyle) => 
  Platform.OS === 'ios' ? iosStyle : androidStyle; 