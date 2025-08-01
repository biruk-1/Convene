import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';

const ModernInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete = 'off',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  error,
  success,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  onRightIconPress,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (isFocused) {
      baseStyle.push(styles.inputFocused);
    }
    
    if (error) {
      baseStyle.push(styles.inputError);
    }
    
    if (success) {
      baseStyle.push(styles.inputSuccess);
    }
    
    if (disabled) {
      baseStyle.push(styles.inputDisabled);
    }

    if (multiline) {
      baseStyle.push(styles.inputMultiline);
    }

    return baseStyle;
  };

  const getBorderColor = () => {
    if (error) return designTokens.colors.error;
    if (success) return designTokens.colors.success;
    if (isFocused) return designTokens.colors.primary;
    return designTokens.colors.border;
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handlePasswordToggle}
          activeOpacity={0.7}
        >
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={designTokens.colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onRightIconPress}
          activeOpacity={0.7}
          disabled={!onRightIconPress}
        >
          <Icon
            name={rightIcon}
            size={20}
            color={designTokens.colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle, { color: currentTheme.text }]}>
          {label}
        </Text>
      )}
      
      <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={20}
              color={designTokens.colors.textSecondary}
            />
          </View>
        )}
        
        <TextInput
          style={[
            getInputStyle(),
            inputStyle,
            {
              color: currentTheme.text,
              backgroundColor: currentTheme.secondary,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={designTokens.colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
      
      {success && (
        <Text style={styles.successText}>
          {success}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.lg,
  },
  label: {
    fontSize: designTokens.typography.sm,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
    marginBottom: designTokens.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    ...designTokens.shadows.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    fontSize: designTokens.typography.base,
    fontFamily: designTokens.typography.fontFamily,
    color: designTokens.colors.textPrimary,
  },
  inputFocused: {
    ...designTokens.shadows.md,
  },
  inputError: {
    borderColor: designTokens.colors.error,
  },
  inputSuccess: {
    borderColor: designTokens.colors.success,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  leftIconContainer: {
    paddingLeft: designTokens.spacing.lg,
    paddingRight: designTokens.spacing.sm,
  },
  iconContainer: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
  },
  errorText: {
    color: designTokens.colors.error,
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
    marginTop: designTokens.spacing.xs,
  },
  successText: {
    color: designTokens.colors.success,
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
    marginTop: designTokens.spacing.xs,
  },
});

export default ModernInput; 