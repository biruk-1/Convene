import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import CryptoJS from 'crypto-js';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';
import { designTokens, modernStyles } from '../styles/modernDesignSystem';
import { ModernSpinner } from '../Components/ModernLoading';

const { width, height } = Dimensions.get('window');

const ModernLoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, logoScaleAnim]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const hashedPassword = CryptoJS.SHA512(password).toString();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', hashedPassword);

    try {
      const response = await fetch('https://zelesegna.com/convene/app/mobileLogin.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      const trimmedResponseText = responseText.trim();

      let data;
      try {
        data = JSON.parse(trimmedResponseText);
      } catch (parseError) {
        throw new Error('Could not parse JSON: ' + parseError.message);
      }

      if (data.result === "true") {
        const userData = {
          id: data.participant,
          name: data.name,
          profilePhoto: data.profile_photo,
        };
        login(userData);

        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('userId', data.participant);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        navigation.navigate('EventList', { participantId: data.participant });
      } else {
        Alert.alert('Invalid credentials', 'Please check your email and password and try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login failed', 'Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[modernStyles.containerCentered, { backgroundColor: currentTheme.background }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: logoScaleAnim },
            ],
          }}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={[styles.appTitle, { color: currentTheme.text }]}>Convene</Text>
            <Text style={[styles.appSubtitle, { color: currentTheme.text }]}>
              Welcome back! Please sign in to continue.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Sign In</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Email</Text>
              <TextInput
                style={[
                  modernStyles.input,
                  emailFocused && modernStyles.inputFocused,
                  {
                    backgroundColor: currentTheme.secondary,
                    color: currentTheme.text,
                    borderColor: emailFocused ? designTokens.colors.primary : currentTheme.primary,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={designTokens.colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Password</Text>
              <TextInput
                style={[
                  modernStyles.input,
                  passwordFocused && modernStyles.inputFocused,
                  {
                    backgroundColor: currentTheme.secondary,
                    color: currentTheme.text,
                    borderColor: passwordFocused ? designTokens.colors.primary : currentTheme.primary,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={designTokens.colors.textTertiary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                autoComplete="password"
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                modernStyles.button,
                loading && styles.buttonDisabled,
                { backgroundColor: currentTheme.primary },
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ModernSpinner size="small" color={designTokens.colors.textInverse} />
              ) : (
                <Text style={modernStyles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={[styles.forgotPasswordText, { color: currentTheme.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: designTokens.colors.textSecondary }]}>
              A product of Kiburan
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logoSection: {
    alignItems: 'center',
    marginBottom: designTokens.spacing['3xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadows.md,
  },
  logoText: {
    fontSize: 32,
    color: designTokens.colors.textInverse,
    fontWeight: 'bold',
    fontFamily: designTokens.typography.fontFamilyBold,
  },
  appTitle: {
    fontSize: designTokens.typography['2xl'],
    fontWeight: 'bold',
    fontFamily: designTokens.typography.fontFamilyBold,
    marginBottom: designTokens.spacing.sm,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: designTokens.typography.base,
    fontFamily: designTokens.typography.fontFamily,
    textAlign: 'center',
    lineHeight: designTokens.typography.lineHeight.relaxed * designTokens.typography.base,
    opacity: 0.8,
  },
  formSection: {
    width: '100%',
    maxWidth: 320,
  },
  sectionTitle: {
    fontSize: designTokens.typography.xl,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
    marginBottom: designTokens.spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  inputLabel: {
    fontSize: designTokens.typography.sm,
    fontWeight: '600',
    fontFamily: designTokens.typography.fontFamilyMedium,
    marginBottom: designTokens.spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
  },
  forgotPasswordText: {
    fontSize: designTokens.typography.sm,
    fontWeight: '500',
    fontFamily: designTokens.typography.fontFamilyMedium,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: designTokens.spacing['3xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: designTokens.typography.sm,
    fontFamily: designTokens.typography.fontFamily,
  },
});

ModernLoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default ModernLoginScreen; 