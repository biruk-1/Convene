import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import CryptoJS from 'crypto-js';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/themes'; // Ensure the path is correct

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const theme = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const handleLogin = async () => {
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
      console.log('Raw response:', responseText); // Log raw response for inspection

      // Trim whitespace before parsing
      const trimmedResponseText = responseText.trim();

      // Check if the response is valid JSON
      let data;
      try {
        data = JSON.parse(trimmedResponseText);
      } catch (parseError) {
        throw new Error('Could not parse JSON: ' + parseError.message);
      }

      // Check the parsed response
      if (data.result === "true") {
        login(data.participant); // Store participant ID in AuthContext
        navigation.navigate('EventList', { participantId: data.participant });
      } else {
        Alert.alert('Invalid credentials', data.result); // Show the error message from the server
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login failed', 'Please check your internet connection or try again later.');
    }
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: currentTheme.background }]}>
      <Image source={require('../../assets/images/logo.png')} style={globalStyles.logo} />
      <Text style={[globalStyles.title, { color: currentTheme.text }]}>Login</Text>

      <TextInput
        style={[globalStyles.inputPinkBorder, { backgroundColor: currentTheme.secondary, color: currentTheme.text }]}
        placeholder="Email"
        placeholderTextColor="#b0b0b0"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={[globalStyles.inputPinkBorder, { backgroundColor: currentTheme.secondary, color: currentTheme.text }]}
        placeholder="Password"
        placeholderTextColor="#b0b0b0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[globalStyles.fullButtonPink, { backgroundColor: currentTheme.primary }]} onPress={handleLogin}>
        <Text style={[globalStyles.buttonText, { color: currentTheme.text }]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;