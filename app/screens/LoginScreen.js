import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import CryptoJS from 'crypto-js';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

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
        contentContainerStyle={[globalStyles.container, { backgroundColor: currentTheme.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../assets/images/convene-logo.png')}
          style={globalStyles.logo}
          resizeMode="contain"
        />
        <Text style={[globalStyles.title, { color: currentTheme.text }]}>Login</Text>

        <TextInput
          style={[
            globalStyles.input,
            {
              backgroundColor: currentTheme.secondary,
              color: currentTheme.text,
              borderColor: currentTheme.primary,
            },
          ]}
          placeholder="Email"
          placeholderTextColor="#b0b0b0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[
            globalStyles.input,
            {
              backgroundColor: currentTheme.secondary,
              color: currentTheme.text,
              borderColor: currentTheme.primary,
            },
          ]}
          placeholder="Password"
          placeholderTextColor="#b0b0b0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[
            globalStyles.loginButton,
            { backgroundColor: currentTheme.primary },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={currentTheme.text} />
          ) : (
            <Text style={[globalStyles.buttonText, { color: currentTheme.text }]}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[globalStyles.forgotPasswordText, { color: currentTheme.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;