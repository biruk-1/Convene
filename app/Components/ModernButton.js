import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';
import { ModernSpinner } from './ModernLoading';

const ModernButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left', // 'left', 'right'
  fullWidth = false,
  style,
  textStyle,
  children,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      default:
        baseStyle.push(styles.primary);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        baseTextStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseTextStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseTextStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseTextStyle.push(styles.ghostText);
        break;
      default:
        baseTextStyle.push(styles.primaryText);
    }

    if (disabled || loading) {
      baseTextStyle.push(styles.disabledText);
    }

    return baseTextStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ModernSpinner size="small" color={variant === 'primary' ? designTokens.colors.textInverse : designTokens.colors.primary} />
          <Text style={[getTextStyle(), styles.loadingText]}>{title}</Text>
        </>
      );
    }

    if (children) {
      // Wrap children in Text component if it's a string, otherwise return as is
      if (typeof children === 'string') {
        return <Text style={getTextStyle()}>{children}</Text>;
      }
      return children;
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <Text style={[styles.icon, { marginRight: designTokens.spacing.xs }]}>{icon}</Text>
        )}
        <Text style={getTextStyle()}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <Text style={[styles.icon, { marginLeft: designTokens.spacing.xs }]}>{icon}</Text>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: designTokens.borderRadius.lg,
    ...designTokens.shadows.sm,
  },
  
  // Size variants
  small: {
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.lg,
    minHeight: 36,
  },
  medium: {
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    minHeight: 48,
  },
  large: {
    paddingVertical: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing['2xl'],
    minHeight: 56,
  },
  
  // Style variants
  primary: {
    backgroundColor: designTokens.colors.primary,
  },
  secondary: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: designTokens.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: designTokens.typography.sm,
  },
  mediumText: {
    fontSize: designTokens.typography.base,
  },
  largeText: {
    fontSize: designTokens.typography.lg,
  },
  
  // Text color variants
  primaryText: {
    color: designTokens.colors.textInverse,
  },
  secondaryText: {
    color: designTokens.colors.textPrimary,
  },
  outlineText: {
    color: designTokens.colors.primary,
  },
  ghostText: {
    color: designTokens.colors.primary,
  },
  disabledText: {
    opacity: 0.6,
  },
  
  // Loading state
  loadingText: {
    marginLeft: designTokens.spacing.sm,
  },
  
  // Icon
  icon: {
    fontSize: designTokens.typography.base,
  },
});

export default ModernButton; 